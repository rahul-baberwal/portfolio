# Custom Database-Backed Token Auth vs. JWT: Why We Rolled Our Own Authentication in Django Rest Framework (DRF)

In modern web development, JSON Web Tokens (JWT) have become the default choice for API authentication. They are stateless, scale horizontally out-of-the-box, and don't require database queries for verification.

But are they always the right choice? 

In this post, we’ll explore how we implemented a **custom database-backed token authentication system** in Django Rest Framework (DRF), and why this approach is often superior to JWT for real-world applications that require strict control over user sessions, device tracking, and instant token revocation.

---

## 1. The Anatomy of Our Custom Token Authentication

Instead of using stateless JWTs, our system uses a database-backed `Token` model paired with a custom authentication backend that hooks directly into Django Rest Framework.

### The Custom Token Model (`accounts/models.py`)

Here is how our `Token` model is structured:

```python
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
```

### The Custom DRF Backend (`accounts/authentication.py`)

To use this token in requests, we subclassed DRF's `BaseAuthentication` class:

```python
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
```

---

## 2. Why Custom Token Auth Beats JWT (The Tradeoffs)

While JWTs are convenient, they introduce several challenges in production applications. Here is why our custom database-backed approach provides a better balance for many real-world use cases:

### A. Instant Token Revocation (The JWT Logout Problem)
* **The JWT Issue**: JWTs are stateless and self-verifying. Once issued, a JWT is valid until it expires. If a user logs out, changes their password, or is blocked by an admin, there is no clean way to invalidate that token immediately without maintaining a complex distributed blacklist (which effectively makes the auth stateful anyway).
* **Our Solution**: Because our tokens are stored in the database, invalidating a token is as simple as running a delete query: `token.delete()`. The very next API request will fail authentication instantly.

### B. Precise Session and Device Limits
* **The JWT Issue**: Controlling how many active devices or sessions a user has is difficult with pure JWTs.
* **Our Solution**: Our `Token` model intercepts the `save` method to enforce strict business rules:
  - Riders (who need high-security access on a single device) are limited to **1 active token**.
  - Customers are limited to **3 active tokens**.
  When a user logs in on a new device and exceeds their limit, the oldest token is automatically purged. This prevents abuse and keeps user sessions clean.

### C. Seamless Device and Push Notification Integration
* **The JWT Issue**: Associating push notification tokens (like Firebase Cloud Messaging tokens) with specific user sessions is challenging when the session itself has no database representation.
* **Our Solution**: Our database-backed tokens allow us to create direct foreign key relationships. We map device details (`Device` model) and FCM tokens (`FCMTokenLink` model) directly to the specific active `Token`. If a session is deleted (e.g., during logout or limit cleanup), the associated FCM links are cascade deleted automatically, preventing notifications from being sent to logged-out devices.

### D. Security Against Secret Leaks
* **The JWT Issue**: If your JWT signing secret is leaked, an attacker can forge tokens for *any* user in your system with admin rights, undetected, until you rotate the signing key (invalidating everyone's sessions).
* **Our Solution**: With custom database-backed tokens, each token is a highly secure, cryptographically random `urandom` string. Even if one user's token is compromised, other user sessions remain completely unaffected.

---

## 3. Mitigating the Database Query Overhead

The primary argument against database-backed tokens is the database query overhead on every request. However, this is easily mitigated with modern architecture patterns:

1. **Select Related**: In our DRF backend, we use `select_related('user')` to fetch the user and token in a single, efficient query.
2. **Indexing**: The token `key` is marked as `unique=True`, ensuring that lookup queries utilize a fast database index lookup (O(1) complexity).
3. **Caching (Optional)**: If scale demands it, tokens can easily be cached in Redis with simple write-through policies. This retains all the benefits of stateful control (instant revocation) while matching the read speeds of stateless JWTs.

## Conclusion

JWTs are an excellent choice for microservices architectures where cross-service trust is required without database lookups. However, for monolithic or service-oriented backends powering mobile and web apps, **custom database-backed token authentication** offers unparalleled control, immediate revocation, simple session limiting, and direct integration with device tracking and push notifications. 
