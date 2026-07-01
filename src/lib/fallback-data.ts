import { Post, Project, Experience, SkillCategory } from './types';

export const fallbackPosts: Post[] = [
  {
    id: '1',
    slug: 'django-celery-redis',
    title: 'Production-Ready Django, Celery, and Redis: The Definitive Guide to Scaling Background Tasks',
    description: 'Learn how to configure, optimize, and deploy a robust asynchronous task execution system using Django, Celery, and Redis. This deep dive covers task idempotency, database transaction safety patterns, retries with exponential backoff, connection pooling, and Supervisor process controls.',
    published_at: '2026-05-19T00:00:00Z',
    updated_at: '2026-05-19T00:00:00Z',
    published: true,
    tags: ['Django', 'Celery', 'Redis', 'DevOps'],
    read_time: '12 min read',
    body: `In a modern web application, responsiveness is paramount. When a user clicks a button to generate a complex PDF invoice, process an uploaded image, or sync data with an external CRM, they expect an immediate response. Forcing a synchronous HTTP request-response cycle to block while executing heavy CPU or network tasks is a recipe for poor user experiences, application timeouts, and exhausted web server thread pools.

To build scalable, responsive web systems, we must offload time-consuming processes to an asynchronous worker queue. In the Python ecosystem, the combination of **Django, Celery, and Redis** represents the gold standard for implementing background tasks. However, bridging the gap between a local sandbox environment and a bulletproof, production-grade deployment requires addressing critical details like transaction safety, race conditions, task idempotency, queue routing, and daemon process monitoring.

This comprehensive guide explores how to configure, optimize, and deploy this architecture in a professional production environment. We will dive deep into architectural patterns, inspect production-ready code configurations, and lay out DevOps monitoring scripts.

---

## 1. Understanding the Distributed Architecture

Before writing code, we must understand how the individual components of this system coordinate. The architecture operates as a producer-broker-consumer model:

* **The Producer (Django Web Server):** Receives incoming client HTTP requests. Instead of performing heavy operations synchronously, it serializes a payload, pushes a message onto a queue, and returns an immediate HTTP response to the client.
* **The Message Broker (Redis):** A lightning-fast, in-memory data store that acts as the queue manager. It safely stores serialized task messages and distributes them to workers.
* **The Consumer (Celery Worker):** Independent, long-running processes that run concurrently with Django. Workers poll Redis for incoming task messages, execute the Python functions associated with those tasks, and optionally write the execution results to a backend.
* **The Result Backend (Redis/Database):** Stores the return value, status (SUCCESS, FAILURE, RETRY), and traceback of executed tasks, allowing the Django application to query task states asynchronously.

---

## 2. Production Project Configuration

Let's walk through setting up a structured Django project containing production-grade Celery settings.

### Configuring the Celery Instance (\`celery.py\`)

Create a \`celery.py\` file alongside your main Django \`settings.py\` file. This initializes the Celery application and auto-discovers tasks within your installed Django apps.

\`\`\`python
import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

app = Celery('myproject')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a \`CELERY_\` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
\`\`\`

### Hooking Celery into Django (\`__init__.py\`)

To ensure the Celery app is loaded when Django starts, edit your project's root \`__init__.py\` file:

\`\`\`python
# Ensure celery app is always imported when Django starts.
from .celery import app as celery_app

__all__ = ('celery_app',)
\`\`\`

### Production Celery Configuration in \`settings.py\`

In development, developers often use basic, insecure broker settings. In production, we need a secure Redis connection pool, custom task serializers, proper timeouts, and dedicated queue definitions to isolate critical tasks from low-priority background noise.

\`\`\`python
import os

# Broker Configuration (using secure environment variables)
REDIS_URL = os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/0')

CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL

# Production Security & Performance Settings
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'
CELERY_ENABLE_UTC = True

# Task result expiration (don't bloat Redis memory with old task states)
CELERY_RESULT_EXPIRES = 86400  # 24 hours

# Task limits and timeouts to prevent runaway processes
CELERY_TASK_TIME_LIMIT = 1800  # Hard timeout: kill worker task after 30 mins
CELERY_TASK_SOFT_TIME_LIMIT = 1500  # Soft timeout: raise Exception after 25 mins

# Avoid task prefetching bottlenecks on highly variable task sizes
# Prefetching causes one worker to grab multiple tasks, starving other workers
CELERY_WORKER_PREFETCH_MULTIPLIER = 1

# Connection pooling to optimize Redis sockets
CELERY_BROKER_POOL_LIMIT = 10  # Maintain up to 10 open connections
CELERY_BROKER_CONNECTION_TIMEOUT = 10.0  # Limit socket connection wait times
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True

# Visibility timeout: time broker waits for worker acknowledgement 
# before re-queuing the task. Must be larger than your longest running task.
# If visibility timeout is 1 hour, and a task takes 1.5 hours, Celery will
# send it to another worker while the first one is still running!
CELERY_BROKER_TRANSPORT_OPTIONS = {
    'visibility_timeout': 43200,  # 12 hours
    'socket_timeout': 5.0,
    'socket_connect_timeout': 5.0,
}

# Task routing: isolate high-importance tasks (e.g. transactional emails)
# from low-importance, slow tasks (e.g. data warehousing / backups)
CELERY_TASK_ROUTES = {
    'payment.tasks.process_payment': {'queue': 'critical'},
    'analytics.tasks.generate_reports': {'queue': 'low-priority'},
}
\`\`\`

---

## 3. The Golden Rules of Production Tasks

Scaling background tasks in production reveals three common pitfalls: race conditions, non-idempotent task reruns, and connection spikes. Below are the patterns you must follow.

### Rule #1: Database Transaction Safety (The \`on_commit\` Hook)

In Django, enqueuing a background task is often done when a database record is created. 
However, databases operate under transactional isolation. If you enqueue a task inside a Django transaction block, the task is sent to Redis *immediately*. 
If the Celery worker picks up the task before the Django database transaction finishes committing, the worker will try to query the record, find nothing, and throw a \`DoesNotExist\` error.

To prevent this classic race condition, always delay the task dispatch until **after** the database transaction commits successfully.

\`\`\`python
from django.db import transaction
from .tasks import send_welcome_email

def register_user(user_data):
    with transaction.atomic():
        # 1. Write user to database
        user = User.objects.create_user(**user_data)
        
        # 2. Avoid: send_welcome_email.delay(user.id) -> RACE CONDITION!
        
        # 3. Correct Pattern: Enqueue task ONLY after transaction succeeds
        transaction.on_commit(lambda: send_welcome_email.delay(user.id))
        
    return user
\`\`\`

### Rule #2: Task Idempotency

In a distributed system, you must assume that a task will run more than once. Celery could crash halfway through execution, or network hiccups might prevent task acknowledgments from reaching the broker, causing tasks to be re-delivered. 

An **idempotent task** is one that produces the exact same outcome whether it runs once or ten times. Running a charge processing task twice without idempotency charging a customer twice is a catastrophic failure.

We enforce idempotency by using a unique business key (like invoice ID or order ID) or checking status transitions in our models.

\`\`\`python
import logging
from celery import shared_task
from django.db import transaction
from .models import Payment, Order

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def process_payment(self, order_id, token):
    """
    Idempotent task that processes payment for a given order.
    """
    logger.info(f"Processing payment for order {order_id}")
    
    with transaction.atomic():
        # Select for update blocks other processes from modifying this order
        try:
            order = Order.objects.select_for_update().get(id=order_id)
        except Order.DoesNotExist:
            logger.error(f"Order {order_id} not found.")
            return False

        # Guard Clause: If order is already paid, exit gracefully without charging
        if order.status == Order.Status.PAID:
            logger.warning(f"Order {order_id} is already paid. Skipping payment.")
            return True

        if order.status == Order.Status.CANCELLED:
            logger.error(f"Cannot process payment for cancelled order {order_id}.")
            return False

        # Mark payment in-progress to prevent race conditions
        order.status = Order.Status.PAYMENT_PROCESSING
        order.save()

    # Call external payment gateway (outside transaction block to avoid lock timeouts)
    try:
        charge_successful = PaymentGateway.charge(amount=order.total, token=token)
    except Exception as exc:
        # Revert order status in database
        order.status = Order.Status.PENDING
        order.save()
        
        # Retry task with exponential backoff if gateway timed out
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)

    if charge_successful:
        with transaction.atomic():
            order.status = Order.Status.PAID
            order.save()
            
            # Record payment receipt
            Payment.objects.create(order=order, amount=order.total, transaction_id=charge_successful.tx_id)
        return True
    else:
        order.status = Order.Status.PAYMENT_FAILED
        order.save()
        return False
\`\`\`

---

## 4. Designing Resilient Task Retries

If your background task interacts with third-party APIs (SMS gateways, analytics tracking, mail delivery), those services will fail periodically. Your workers must handle this gracefully using retries with **exponential backoff** and **jitter** (random variation) to avoid DDOSing downstream APIs when they recover.

Below is a robust, production-grade task template demonstrating logs, custom execution backoff timeouts, and task error boundaries:

\`\`\`python
import random
import logging
from celery import shared_task
from celery.exceptions import MaxRetriesExceededError
import requests

logger = logging.getLogger(__name__)

@shared_task(
    bind=True,
    max_retries=5,
    acks_late=True,          # Acknowledge task after execution, not before
    reject_on_worker_lost=True # If worker dies, return task to Redis queue
)
def sync_lead_to_crm(self, lead_id):
    """
    Sends customer lead data to external CRM system.
    """
    try:
        lead = Lead.objects.get(id=lead_id)
    except Lead.DoesNotExist:
        logger.error(f"Lead {lead_id} does not exist. Skipping sync.")
        return

    payload = {
        "email": lead.email,
        "name": lead.full_name,
        "phone": lead.phone_number
    }
    
    try:
        response = requests.post("https://api.crm.example.com/v1/leads/", json=payload, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as exc:
        # Calculate exponential backoff: 2, 4, 8, 16, 32... seconds
        backoff = (2 ** self.request.retries)
        # Add random jitter to prevent thundering herd problem
        jitter = random.uniform(0.5, 1.5)
        countdown = int(backoff * jitter)
        
        logger.warning(
            f"CRM Sync failed for Lead {lead_id}. "
            f"Retrying in {countdown}s. Attempt {self.request.retries + 1}/5. Exception: {exc}"
        )
        
        try:
            raise self.retry(exc=exc, countdown=countdown)
        except MaxRetriesExceededError:
            logger.critical(f"CRM Sync completely failed for Lead {lead_id} after 5 attempts.")
            # Send alert to Slack/Sentry here
            return False
            
    logger.info(f"Successfully synced Lead {lead_id} to CRM.")
    return True
\`\`\`

---

## 5. Optimizing Redis for Celery

Redis is lightweight and fast, but it is often shared between Celery and Django caching. 
If Redis runs out of memory, it triggers its eviction policy. If your eviction policy is set to \`allkeys-lru\` (Least Recently Used), Redis might silently delete Celery task messages, leading to "ghost tasks" that disappear without warning.

Follow these configuration parameters for Redis:

| Configuration Param | Recommended Setting | Reasoning |
| --- | --- | --- |
| \`maxmemory-policy\` | \`noeviction\` | Prevents Redis from deleting Celery queue keys. If memory fills up, Redis throws write errors rather than deleting messages. |
| \`database\` allocation | \`db 0\` (Cache), \`db 1\` (Celery) | Isolate cache storage from background task broker storage. Running \`FLUSHDB\` on caching won't destroy queue state. |
| \`timeout\` | \`0\` (Disable connection timeout) | Ensures Celery worker socket connections to Redis aren't closed during periods of queue inactivity. |

---

## 6. DevOps: Worker Daemonization & Process Controls

In a local dev shell, you might start Celery using \`celery -A myproject worker -l info\`. In production, you must run Celery in the background as a system service. If the server reboots, Celery must launch automatically. If a worker crashes or leaks memory, the daemon manager must restart it immediately.

We use **Supervisor** to handle daemon process control. Below is a highly-tuned Supervisor configuration file:

\`\`\`ini
[program:celery-worker]
command=/home/ubuntu/venv/bin/celery -A myproject worker --loglevel=INFO --queues=default,critical -c 4 --max-tasks-per-child=1000 --max-memory-per-child=200000
directory=/home/ubuntu/myproject
user=ubuntu
numprocs=1
stdout_logfile=/var/log/celery/worker.log
stderr_logfile=/var/log/celery/worker_error.log
autostart=true
autorestart=true
startsecs=10

; Need to send SIGTERM to celery worker process group on shutdown
stopwaitsecs=600
killasgroup=true
priority=998
\`\`\`

Key optimization flags inside the \`command\`:

* \`-c 4\` (Concurrency): Spawns 4 worker threads. Typically set to equal the number of CPU cores.
* \`--max-tasks-per-child=1000\`: Restarts child processes after executing 1000 tasks. This mitigates memory leaks in Python dependencies.
* \`--max-memory-per-child=200000\`: Restarts the worker child process if its memory footprint exceeds 200MB, preventing RAM depletion.
* \`stopwaitsecs=600\`: During deployments, Supervisor sends \`SIGTERM\` and waits up to 10 minutes (600 seconds) to let workers finish active tasks before forcefully killing them.

---

## 7. Monitoring Queue Health

You cannot manage what you do not measure. In production, you need real-time dashboards to inspect queue lengths, task latency, and execution failures.

**Flower** is the standard web dashboard for Celery. Run it as a background service managed by Supervisor:

\`\`\`bash
# Install Flower
pip install flower

# Run Flower dashboard (binds to port 5555)
celery -A myproject flower --port=5555 --basic_auth=admin:gR0wwPerCl1ck!
\`\`\`

Expose Flower through a Nginx reverse proxy secured by basic authentication, allowing you to trace worker CPU utilization, active workloads, and task failures instantly.

## Conclusion

Setting up Django, Celery, and Redis is straightforward, but securing it for scale requires careful architecture:

1. Always dispatch tasks via \`transaction.on_commit\` to prevent timing bugs.
2. Build idempotent task functions that check order and transaction statuses.
3. Enforce request timeouts, connection pools, and exponential backoff retry schedules.
4. Run workers as daemonized services using process management tools like Supervisor with memory bounds.

By implementing these steps, you ensure your backend service remains responsive, scalable, and resilient under heavy workloads.`,
  },
  {
    id: '2',
    slug: 'disposable-email-filter',
    title: 'Filtering Disposable & Temporary Emails: A Guide to Clean Leads and Better SEO',
    description: 'Learn how filtering disposable and temporary email addresses protects your website\'s SEO, improves sender reputation, and prevents comment spam. Get active validation code libraries for Python, PHP, and JavaScript stacks.',
    published_at: '2026-05-22T00:00:00Z',
    updated_at: '2026-05-22T00:00:00Z',
    published: true,
    tags: ['Web Security', 'SEO', 'Backend', 'LeadGen'],
    read_time: '8 min read',
    body: `In modern web architecture and marketing, lead acquisition is the lifeblood of business growth. However, a significant portion of user signups, gated content access, and newsletters subscriptions are plagued by throwaway accounts. Known as **disposable or temporary email addresses**, these services allow users to generate transient inboxes that expire within minutes.

While convenient for privacy-minded end users, disposable email addresses represent a quiet disaster for software systems, marketing deliverability, and overall **Search Engine Optimization (SEO)**. To combat this issue, developers need a robust, low-latency filter strategy to protect registration endpoints. 

This guide outlines how temporary email signups directly degrade your SEO, explores implementation strategies, and provides a list of production-ready filtering libraries for **Python, PHP, and JavaScript** stacks.

---

## 1. The SEO and Marketing Impact of Disposable Emails

At first glance, a throwaway email address seems like an analytics issue, not an SEO issue. However, SEO has evolved from keyword density to holistic user engagement, site health, and brand authority. Throwaway emails harm your site in three main areas:

### A. Degraded Email Deliverability and Sender Reputation
Search engines pay close attention to your brand's overall digital ecosystem. When you send confirmation emails, activation codes, or newsletters to expired addresses, they bounce. 

High bounce rates flag your sending IP and domain (e.g., mail.yourdomain.com) with major mail providers (Gmail, Outlook). If your sender score falls, your transactional and marketing emails bypass users' inboxes and end up in the spam folder. When users cannot receive your confirmation emails or reset passwords, they bounce from your site, resulting in poor user engagement signals that hurt search page rankings.

### B. User Generated Content (UGC) Spam & Backlink Spoofing
Spammers often use automated bots to register accounts on blogs, forums, and directories using temporary emails. Once registered, these bots publish thousands of low-quality comments, profiles, and pages embedded with outbound spam links.

Search engines like Google penalize sites with unmoderated, spam-heavy pages. If your site links to malicious domains, your domain authority drops, and you risk a manual penalty from Google. Filtering out throwaway email domains at the registration level stops spam bots before they can publish harmful links on your site.

### C. Inaccurate Conversion Rates and Bloated Data
If 20% of your newsletter signups or trial leads are disposable, your web analytics are skewed. Bloated datasets lead to incorrect assumptions about landing page performance, conversion rate optimization (CRO), and traffic source quality. Inbound marketing relies on clean conversion data to make informed SEO campaign adjustments.

---

## 2. Implementation Strategies: Local Lists vs. API Checkers

There are two primary approaches to implementing a disposable email address filter:

* **Local Verification (Blocklists):** Checking the email domain against a local database or flat JSON file containing known disposable domains (e.g., \`mailinator.com\`, \`10minutemail.com\`). 
  * *Pros:* Extremely fast (sub-millisecond execution), free, zero external dependencies, no privacy concerns.
  * *Cons:* Requires regular updates to catch new throwaway domains created daily.
* **External API Verification:** Calling a real-time third-party service to query the domain's MX records, active mail servers, and domain age.
  * *Pros:* High accuracy, catches newly created domains automatically, handles advanced features like syntax and role checks.
  * *Cons:* Latency (network requests block registration), cost per API request, potential downtime of the validation service.

---

## 3. Email Filtering Libraries Across Stacks

Depending on your backend stack, there are excellent open-source libraries that let you implement quick local checks or interact with verification systems.

### 🐍 Python Stack

Python developers can use local lookup packages or comprehensive email validators:
* **\`burner-bouncer\`:** A fast, zero-dependency library for checking domains against local lists.
* **\`email-validator\`:** The standard library for checking syntax and querying MX records directly to verify active mail servers.

\`\`\`python
# Install using: pip install burner-bouncer email-validator
from burner_bouncer import BurnerBouncer
from email_validator import validate_email, EmailNotValidError

def validate_user_email(email_address):
    # 1. Syntax and domain lookup check
    try:
        valid_info = validate_email(email_address, check_deliverability=True)
        normalized_email = valid_info.normalized
        domain = valid_info.domain
    except EmailNotValidError as e:
        return False, f"Invalid email format: {str(e)}"
        
    # 2. Local check against disposable domains
    bouncer = BurnerBouncer()
    if bouncer.is_disposable(domain):
        return False, "Disposable email addresses are not allowed."
        
    return True, normalized_email
\`\`\`

### 🐘 PHP Stack

PHP backends can leverage highly-optimized composer packages that load domain blocklists:
* **\`beeyev/disposable-email-filter-php\`:** A framework-agnostic package with support for Laravel and $O(1)$ lookups using PHP array keys.
* **\`MattKetmo/EmailChecker\`:** A lightweight library with built-in adapters and customizable domain sources.

\`\`\`php
// Install using: composer require beeyev/disposable-email-filter-php
use Beeyev\\DisposableEmailFilter\\DisposableEmailFilter;

function verifyEmail($emailAddress) {
    $filter = new DisposableEmailFilter();
    
    // Check if the email contains a throwaway domain
    if ($filter->isDisposable($emailAddress)) {
        return [
            'isValid' => false,
            'message' => 'Disposable email addresses are blocked.'
        ];
    }
    
    return [
        'isValid' => true,
        'email' => filter_var($emailAddress, FILTER_SANITIZE_EMAIL)
    ];
}
\`\`\`

### 🟨 JavaScript / Node.js Stack

For Node.js backends or front-end validation (UI warnings):
* **\`burner-bouncer\`:** A dual-distribution ESM/CJS library that runs locally in browsers or Node.js.
* **\`@gmana/email-checker\`:** A TypeScript-first, zero-dependency utility with custom whitelist support.

\`\`\`javascript
// Install using: npm install burner-bouncer
import { BurnerBouncer } from 'burner-bouncer';

function checkRegistrationEmail(email) {
  const bouncer = new BurnerBouncer();
  
  // Extract domain name
  const parts = email.split('@');
  if (parts.length !== 2) {
    return { isValid: false, reason: 'Invalid email syntax.' };
  }
  
  const domain = parts[1].toLowerCase();
  
  // Verify against blocklist
  if (bouncer.isDisposable(domain)) {
    return { isValid: false, reason: 'Temporary emails are not allowed.' };
  }
  
  return { isValid: true };
}
\`\`\`

---

## 4. Designing a Self-Updating Local Filter

To bypass the downsides of paying for third-party APIs while keeping your local list fresh, you can implement a cached file strategy. This approach downloads the master disposable email domain registry during app startup or via a daily Celery/Cron job.

Below is a clean, production-ready Python class showing how to set up a self-updating email filter:

\`\`\`python
import time
import urllib.request
import json
import logging

logger = logging.getLogger(__name__)

class SelfUpdatingEmailFilter:
    def __init__(self, cache_file="disposable_domains.json", update_interval_seconds=86400):
        self.cache_file = cache_file
        self.update_interval = update_interval_seconds
        self.disposable_domains = set()
        self.last_updated = 0
        
        # Load initial local list
        self._load_local_cache()

    def _load_local_cache(self):
        try:
            with open(self.cache_file, 'r') as f:
                data = json.load(f)
                self.disposable_domains = set(data.get('domains', []))
                self.last_updated = data.get('last_updated', 0)
        except (FileNotFoundError, json.JSONDecodeError):
            logger.info("Local domain cache not found. Triggering sync.")
            self.sync_remote_list()

    def sync_remote_list(self):
        url_disposable = "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_domains.json"
        
        try:
            req = urllib.request.Request(url_disposable, headers={'User-Agent': 'EmailFilterBot/1.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                domains = json.loads(response.read().decode('utf-8'))
                
            self.disposable_domains = set(domains)
            self.last_updated = time.time()
            
            # Save local cache
            with open(self.cache_file, 'w') as f:
                json.dump({
                    'last_updated': self.last_updated,
                    'domains': list(self.disposable_domains)
                }, f)
            logger.info("Successfully synchronized disposable domains database.")
        except Exception as exc:
            logger.error(f"Failed to synchronize disposable domains: {exc}")

    def is_disposable(self, email):
        if time.time() - self.last_updated > self.update_interval:
            self.sync_remote_list()
            
        parts = email.strip().lower().split('@')
        if len(parts) != 2:
            return True # Flag malformed emails
            
        domain = parts[1]
        return domain in self.disposable_domains
\`\`\`

## Conclusion

An email address input field is the front door of your web application. Leaving it unmonitored invites spam bots and throwaway accounts, which degrades lead quality and compromises your site's SEO reputation.

By implementing a local verification library or a self-updating cached domain list:

1. You protect your outbound mail server's IP address from hitting high bounce rates.
2. You block automated spammers before they can post junk links in your comment section or forums.
3. You keep your database analytics clean and reliable.

Adding a disposable email filter is a quick and effective way to secure your application and maintain search engine visibility.`,
  },
  {
    id: '3',
    slug: 'custom-auth-vs-jwt',
    title: 'Custom Database-Backed Token Auth vs. JWT: Why We Rolled Our Own Authentication in Django Rest Framework (DRF)',
    description: 'Explore how we implemented a custom database-backed token authentication system in Django Rest Framework (DRF), and why this approach is often superior to JWT for real-world applications that require strict control over user sessions, device tracking, and instant token revocation.',
    published_at: '2026-05-27T00:00:00Z',
    updated_at: '2026-05-27T00:00:00Z',
    published: true,
    tags: ['Django', 'REST', 'Security', 'Backend'],
    read_time: '8 min read',
    body: `In modern web development, JSON Web Tokens (JWT) have become the default choice for API authentication. They are stateless, scale horizontally out-of-the-box, and don't require database queries for verification.

But are they always the right choice? 

In this post, we’ll explore how we implemented a **custom database-backed token authentication system** in Django Rest Framework (DRF), and why this approach is often superior to JWT for real-world applications that require strict control over user sessions, device tracking, and instant token revocation.

---

## 1. The Anatomy of Our Custom Token Authentication

Instead of using stateless JWTs, our system uses a database-backed \`Token\` model paired with a custom authentication backend that hooks directly into Django Rest Framework.

### The Custom Token Model (\`accounts/models.py\`)

Here is how our \`Token\` model is structured:

\`\`\`python
import binascii
import os
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Token(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="auth_tokens")
    key = models.CharField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Token"
        verbose_name_plural = "Tokens"

    def __str__(self):
        return f"Token for {self.user.mobile}"

    @classmethod
    def generate(cls):
        """Generate a secure random hex key"""
        return binascii.hexlify(os.urandom(40)).decode()
    
    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate()
        
        # Enforce session limits!
        token_limit = 1 if self.user.is_rider else 3
        if Token.objects.filter(user=self.user).count() >= token_limit:
            oldest_token = Token.objects.filter(user=self.user).order_by('created_at').first()
            if oldest_token:
                oldest_token.delete()        
        return super().save(*args, **kwargs)
\`\`\`

### The Custom DRF Backend (\`accounts/authentication.py\`)

To use this token in requests, we subclassed DRF's \`BaseAuthentication\` class:

\`\`\`python
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _
from .models import Token

class CustomTokenAuthentication(BaseAuthentication):
    """
    Custom token authentication that works with our custom Token model.
    Expects header: Authorization: YourCustomToken <token_key>
    """
    keyword = "YourCustomToken"

    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if not auth or auth[0].lower() != self.keyword.lower().encode():
            return None

        if len(auth) == 1:
            raise AuthenticationFailed(_('Invalid token header. No credentials provided.'))
        elif len(auth) > 2:
            raise AuthenticationFailed(_('Invalid token header. Token string should not contain spaces.'))

        try:
            token = auth[1].decode()
        except UnicodeError:
            raise AuthenticationFailed(_('Invalid token header. Token string contains invalid characters.'))

        return self.authenticate_credentials(token)

    def authenticate_credentials(self, key):
        try:
            # Optimize queries with select_related
            token = Token.objects.select_related('user').get(key=key)
        except Token.DoesNotExist:
            raise AuthenticationFailed(_('Invalid token.'))

        if not token.user.is_active:
            raise AuthenticationFailed(_('User inactive or deleted.'))

        return (token.user, token)

    def authenticate_header(self, request):
        return self.keyword
\`\`\`

---

## 2. Why Custom Token Auth Beats JWT (The Tradeoffs)

While JWTs are convenient, they introduce several challenges in production applications. Here is why our custom database-backed approach provides a better balance for many real-world use cases:

### A. Instant Token Revocation (The JWT Logout Problem)
* **The JWT Issue**: JWTs are stateless and self-verifying. Once issued, a JWT is valid until it expires. If a user logs out, changes their password, or is blocked by an admin, there is no clean way to invalidate that token immediately without maintaining a complex distributed blacklist (which effectively makes the auth stateful anyway).
* **Our Solution**: Because our tokens are stored in the database, invalidating a token is as simple as running a delete query: \`token.delete()\`. The very next API request will fail authentication instantly.

### B. Precise Session and Device Limits
* **The JWT Issue**: Controlling how many active devices or sessions a user has is difficult with pure JWTs.
* **Our Solution**: Our \`Token\` model intercepts the \`save\` method to enforce strict business rules:
  - Riders (who need high-security access on a single device) are limited to **1 active token**.
  - Customers are limited to **3 active tokens**.
  When a user logs in on a new device and exceeds their limit, the oldest token is automatically purged. This prevents abuse and keeps user sessions clean.

### C. Seamless Device and Push Notification Integration
* **The JWT Issue**: Associating push notification tokens (like Firebase Cloud Messaging tokens) with specific user sessions is challenging when the session itself has no database representation.
* **Our Solution**: Our database-backed tokens allow us to create direct foreign key relationships. We map device details (\`Device\` model) and FCM tokens (\`FCMTokenLink\` model) directly to the specific active \`Token\`. If a session is deleted (e.g., during logout or limit cleanup), the associated FCM links are cascade deleted automatically, preventing notifications from being sent to logged-out devices.

### D. Security Against Secret Leaks
* **The JWT Issue**: If your JWT signing secret is leaked, an attacker can forge tokens for *any* user in your system with admin rights, undetected, until you rotate the signing key (invalidating everyone's sessions).
* **Our Solution**: With custom database-backed tokens, each token is a highly secure, cryptographically random \`urandom\` string. Even if one user's token is compromised, other user sessions remain completely unaffected.

---

## 3. Mitigating the Database Query Overhead

The primary argument against database-backed tokens is the database query overhead on every request. However, this is easily mitigated with modern architecture patterns:

1. **Select Related**: In our DRF backend, we use \`select_related('user')\` to fetch the user and token in a single, efficient query.
2. **Indexing**: The token \`key\` is marked as \`unique=True\`, ensuring that lookup queries utilize a fast database index lookup ($O(1)$ complexity).
3. **Caching (Optional)**: If scale demands it, tokens can easily be cached in Redis with simple write-through policies. This retains all the benefits of stateful control (instant revocation) while matching the read speeds of stateless JWTs.

## Conclusion

JWTs are an excellent choice for microservices architectures where cross-service trust is required without database lookups. However, for monolithic or service-oriented backends powering mobile and web apps, **custom database-backed token authentication** offers unparalleled control, immediate revocation, simple session limiting, and direct integration with device tracking and push notifications.`,
  },
];

export const fallbackProjects: Project[] = [
  {
    id: 'p1',
    slug: 'movie-explorer',
    title: 'Movie Explorer AI',
    tagline: 'AI-powered movie recommendation platform',
    description: `## Summary

An AI-powered movie recommendation platform leveraging a machine learning model for personalized suggestions, mood-based filtering, and multi-language support. Features natural language processing, a FastAPI backend, and a custom recommendation algorithm that we fine-tuned to handle diverse queries.

## Technical Highlights
* **AI Recommendation Engine**: Built with \`scikit-learn\` using Content-Based Filtering and TF-IDF Vectorization over movie plot metadata, tags, and genres.
* **FastAPI Backend**: Leveraged async features in Python for concurrent requests and TMDB API integrations.
* **Tailwind Front-End**: Responsive web portal styled with dark mode and dynamic hover layouts.
* **Fuzzy Search Integration**: Auto-completes and maps misspelt user titles to database movies instantly.`,
    tech_stack: ['Python', 'FastAPI', 'scikit-learn', 'JavaScript', 'Tailwind CSS', 'TMDB API'],
    github_url: 'https://github.com/rahul-baberwal/Movie-Explorer-Latest',
    cover_image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgODAwIDQ1MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzExMTExOCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmM2M2ZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9ImJvbGQiPk1vdmllIEV4cGxvcmVyIEFJPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OWJiIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiI+UGVyc29uYWxpemVkIE1MIFJlY29tbWVuZGF0aW9uIEVuZ2luZTwvdGV4dD48L3N2Zz4=',
    featured: true,
    sort_order: 1,
  },
  {
    id: 'p2',
    slug: 'easyspinlaundry',
    title: 'EasySpin — Hyperlocal Ecosystem',
    tagline: 'On-demand laundry service platform',
    description: `## Summary

EasySpin is a hyperlocal logistics and utility platform designed to resolve laundry constraints for college campuses (originally prototyped for IIT Ropar students). It consists of a unified backend orchestrating REST APIs for Customer, Rider, and Store apps at a large scale.

## Technical Highlights
* **Multi-App Backend**: Built with Django Rest Framework, using PostgreSQL to store relation profiles.
* **Task Queuing**: Dispatched background notifications, SMS receipts, and account syncs using Celery & Redis.
* **OTP Authentication**: Implemented SMS OTP flows for user logins.
* **Automated Social Sync**: Integrated WhatsApp Business API for instant ordering updates.
* **Real-time Map tracking**: WebSockets to track delivery riders on campus maps.`,
    tech_stack: ['Django', 'DRF', 'PostgreSQL', 'Celery', 'Redis', 'Firebase', 'WebSockets'],
    github_url: 'https://play.google.com/store/apps/details?id=com.easyspinlaundry.user&pcampaignid=web_share',
    cover_image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgODAwIDQ1MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzExMTExOCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmM2M2ZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9ImJvbGQiPkVhc3lTcGluIExhdW5kcnk8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5YmIiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2Ij5IeXBlcmxvY2FsIERlbGl2ZXJ5IEVjb3N5c3RlbTwvdGV4dD48L3N2Zz4=',
    featured: true,
    sort_order: 2,
  },
  {
    id: 'p3',
    slug: 'college-website',
    title: 'College Website',
    tagline: 'Responsive college/institution web application',
    description: `## Summary

A modern, responsive college and institution website built with HTML5, CSS3, and SCSS, featuring clean typography, structured department grids, and professional representation of academic catalogs. 

## Technical Highlights
* **Modular Styling**: Built modular CSS rules using SCSS nesting, mixins, and custom design tokens.
* **Accessiblity**: Followed semantic HTML rules for screen-reader readability.
* **Responsive Layouts**: Multi-device support using flexbox and grid layouts.`,
    tech_stack: ['HTML', 'SCSS', 'CSS', 'Responsive Design'],
    github_url: 'https://github.com/rahul-baberwal/mycollege1',
    cover_image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgODAwIDQ1MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzExMTExOCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmM2M2ZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9ImJvbGQiPkNvbGxlZ2UgV2Vic2l0ZTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTkiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2Ij5Nb2Rlcm4gYW5kIFJlc3BvbnNpdmUgU0NTUzwvdGV4dD48L3N2Zz4=',
    featured: false,
    sort_order: 3,
  },
];

export const fallbackExperiences: Experience[] = [
  {
    id: 'exp1',
    date: 'Jul 2026 – Present',
    title: 'Full Stack Developer',
    company: 'AdsToPlay',
    description: 'Designing and building high-performance full-stack web applications, REST APIs, and interactive interfaces. Leveraging React, PHP, Python, and modern web technologies to optimize game and ad tech platforms.',
  },
  {
    id: 'exp2',
    date: 'Aug 2025 – Jun 2026',
    title: 'Back End Developer',
    company: 'Groww Per Click',
    description: 'Building and maintaining scalable backend systems, REST APIs, and server-side logic using Python. Contributing to product infrastructure in a fast-paced fintech environment.',
  },
  {
    id: 'exp3',
    date: 'Aug 2024 – Oct 2025',
    title: 'Major in Artificial Intelligence',
    company: 'Indian Institute of Technology, Ropar',
    description: 'Pursuing advanced studies in AI — covering machine learning, deep learning, natural language processing, computer vision, and pattern recognition. Exploring applications like autonomous vehicles, driving car simulations, and collaborating with machine learning engineers.',
  },
  {
    id: 'exp4',
    date: '2024',
    title: 'MSc Computer Science (ongoing)',
    company: 'Mohta College, MGSU University Bikaner',
    description: 'Pursuing MSc Computer Science at Mohta College, MGSU University Bikaner, covering algorithms, distributed systems, and advanced software engineering.',
  },
  {
    id: 'exp5',
    date: 'Jul 2022 – Jan 2024',
    title: 'O Level — IT Professional',
    company: 'NIELIT (National Institute of Electronics & Information Tech)',
    description: 'Completed NIELIT O Level certification in Computer and Information Sciences, gaining strong foundations in programming, networking, and IT fundamentals.',
  },
];

export const fallbackSkills: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: 'fa-solid fa-code',
    tags: ['Python', 'JavaScript', 'HTML5', 'CSS3', 'SCSS'],
  },
  {
    title: 'Backend & Infra',
    icon: 'fa-solid fa-server',
    tags: ['Django', 'Django REST', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis', 'Celery', 'Channels'],
  },
  {
    title: 'AI / Data Science',
    icon: 'fa-solid fa-brain',
    tags: ['Machine Learning', 'scikit-learn', 'Pandas', 'NumPy', 'Data Visualization', 'NLP / SBERT'],
  },
  {
    title: 'Tools',
    icon: 'fa-solid fa-screwdriver-wrench',
    tags: ['Git', 'GitHub', 'GitLab', 'Linux', 'VS Code', 'Postman'],
  },
];
