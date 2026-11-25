import React from 'react';

export function PersonJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://rahulbaberwal.com/#person",
    "name": "Rahul Baberwal",
    "alternateName": [
      "Rahul Baberwal"
    ],
    "url": "https://rahulbaberwal.com",
    "image": "https://rahulbaberwal.com/profile.webp",
    "jobTitle": "Software Developer",
    "description": "Software Developer building Android apps in Kotlin and Python backends with Django and FastAPI. Author of open-source Django packages on PyPI. Currently at AdsToPlay.",
    "email": "mailto:im@rahulbaberwal.com",
    "homeLocation": {
      "@type": "Place",
      "name": "Amarpura (Amarpura Dham)",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Amarpura Dham",
        "addressRegion": "Rajasthan",
        "addressCountry": "India"
      }
    },
    "birthPlace": {
      "@type": "Place",
      "name": "Amarpura Dham, Rajasthan, India"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "AdsToPlay"
    },
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "Indian Institute of Technology, Ropar"
      },
      {
        "@type": "EducationalOrganization",
        "name": "Mohta College, MGSU University Bikaner"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/in/rahul-baberwal/",
      "https://github.com/rahul-baberwal",
      "https://gitlab.com/rahul-baberwal",
      "https://about.me/rahulbaberwal/",
      "https://www.facebook.com/rahulbaberwal.in/",
      "https://www.instagram.com/rahulbaberwal.in/",
      "https://pypi.org/user/rahulbaberwal/",
      "https://djangopackages.org/profiles/rahul-baberwal/"
    ],
    "knowsAbout": [
      "Python",
      "Django",
      "FastAPI",
      "Kotlin",
      "Android",
      "Jetpack Compose",
      "Software Engineering",
      "PostgreSQL",
      "Docker",
      "Redis",
      "Celery",
      "Machine Learning",
      "Artificial Intelligence"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who is Rahul Baberwal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Rahul Baberwal is a Software Developer building Android apps in Kotlin and Python backends with Django and FastAPI. He is a Major in AI from IIT Ropar and has completed MSc Computer Science at MGSU Bikaner."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Rahul Baberwal from?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Rahul Baberwal is originally from Amarpura, popularly known as Amarpura Dham, in Churu, Rajasthan, India."
        }
      },
      {
        "@type": "Question",
        "name": "What does Rahul Baberwal do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "He is a Software Developer specialising in Android (Kotlin) and Python backends (Django, FastAPI). He also authors open-source Django packages on PyPI and currently works at AdsToPlay."
        }
      },
      {
        "@type": "Question",
        "name": "What are Rahul Baberwal's skills?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "His skills include Python, Django, FastAPI, Kotlin, Android, Jetpack Compose, PostgreSQL, Redis, Celery, Docker, and Machine Learning."
        }
      },
      {
        "@type": "Question",
        "name": "Where did Rahul Baberwal study?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "He studied at the Indian Institute of Technology (IIT), Ropar for an AI Major, and Mohta College (MGSU University Bikaner) for his MSc in Computer Science."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}