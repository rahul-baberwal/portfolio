import React from 'react';

export function PersonJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://rahulbaberwal.com/#person",
    "name": "Rahul Baberwal",
    "alternateName": [
      "Rahul Amarpura",
      "Rahul Baberwal Amarpura",
      "Rahul Baberwal Amarpura Dham"
    ],
    "url": "https://rahulbaberwal.com",
    "image": "https://rahulbaberwal.com/profile.webp",
    "jobTitle": "Full Stack Developer & AI Engineer",
    "description": "Rahul Baberwal — Full Stack Developer at AdsToPlay and AI Engineer originally from Amarpura (Amarpura Dham), Bikaner, Rajasthan. MSc Computer Science student at MGSU Bikaner and AI Major from IIT Ropar.",
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
      "Machine Learning",
      "Software Engineering",
      "PostgreSQL",
      "Docker",
      "Redis",
      "Celery",
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
          "text": "Rahul Baberwal is a Full Stack Developer and AI Engineer originally from Amarpura (Amarpura Dham), Rajasthan. He is an MSc Computer Science student at MGSU Bikaner, and an AI Major from IIT Ropar."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Rahul Baberwal from?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Rahul Baberwal is originally from Amarpura, popularly known as Amarpura Dham, in Bikaner, Rajasthan, India."
        }
      },
      {
        "@type": "Question",
        "name": "What does Rahul Baberwal do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "He specializes in full-stack web development with React, PHP, Python, Django, and FastAPI, as well as Artificial Intelligence and Machine Learning. He currently works as a Full Stack Developer at AdsToPlay."
        }
      },
      {
        "@type": "Question",
        "name": "What are Rahul Baberwal's skills?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "His skills include Python, JavaScript, Django, FastAPI, Docker, PostgreSQL, Redis, Celery, and Machine Learning."
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