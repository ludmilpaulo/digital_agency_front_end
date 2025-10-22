"use client";

import Script from "next/script";

interface StructuredDataProps {
  type?: "organization" | "service" | "article" | "product" | "faq";
  data?: any;
}

export default function StructuredData({ type = "organization", data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Maindo Digital Agency",
          "alternateName": "Maindo Digital",
          "url": "https://www.maindodigital.com",
          "logo": "https://www.maindodigital.com/maindo_digital_agency_logo.png",
          "description": "Professional digital agency offering web development, mobile apps, SEO, and digital marketing services in South Africa.",
          "email": "support@maindodigital.com",
          "telephone": "+27659031894",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Your Street Address",
            "addressLocality": "Cape Town",
            "addressRegion": "Western Cape",
            "postalCode": "8000",
            "addressCountry": "ZA"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-33.9249",
            "longitude": "18.4241"
          },
          "areaServed": {
            "@type": "Country",
            "name": "South Africa"
          },
          "sameAs": [
            "https://www.facebook.com/maindodigital",
            "https://www.twitter.com/maindodigital",
            "https://www.linkedin.com/company/maindodigital",
            "https://www.instagram.com/maindodigital"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+27659031894",
            "contactType": "Customer Service",
            "email": "support@maindodigital.com",
            "areaServed": "ZA",
            "availableLanguage": ["en", "af"]
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "127",
            "bestRating": "5",
            "worstRating": "1"
          }
        };

      case "service":
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": data?.title || "Digital Services",
          "provider": {
            "@type": "Organization",
            "name": "Maindo Digital Agency",
            "url": "https://www.maindodigital.com"
          },
          "areaServed": {
            "@type": "Country",
            "name": "South Africa"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Digital Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Web Development",
                  "description": "Custom website development using modern technologies"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Mobile App Development",
                  "description": "Native and cross-platform mobile applications"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "SEO Services",
                  "description": "Search engine optimization and digital marketing"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "E-Commerce Solutions",
                  "description": "Complete online store development and management"
                }
              }
            ]
          }
        };

      case "faq":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What services does Maindo Digital Agency offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We offer comprehensive digital services including web development, mobile app development, SEO optimization, digital marketing, e-commerce solutions, UI/UX design, and custom software development."
              }
            },
            {
              "@type": "Question",
              "name": "How long does it take to develop a website?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Project timelines vary based on complexity. A basic website takes 2-4 weeks, while complex web applications can take 8-12 weeks or more. We provide detailed timelines during consultation."
              }
            },
            {
              "@type": "Question",
              "name": "Do you provide ongoing support after project completion?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! We offer comprehensive maintenance and support packages to ensure your digital products remain secure, updated, and performing optimally."
              }
            },
            {
              "@type": "Question",
              "name": "What is your pricing structure?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We offer flexible pricing based on project scope and requirements. Contact us for a free consultation and custom quote tailored to your needs."
              }
            },
            {
              "@type": "Question",
              "name": "Do you work with businesses outside South Africa?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely! While based in South Africa, we work with clients globally and have experience delivering projects across different time zones."
              }
            }
          ]
        };

      case "article":
        return data;

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      strategy="afterInteractive"
    />
  );
}

// Component for LocalBusiness schema
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Maindo Digital Agency",
    "image": "https://www.maindodigital.com/maindo_digital_agency_logo.png",
    "@id": "https://www.maindodigital.com",
    "url": "https://www.maindodigital.com",
    "telephone": "+27659031894",
    "email": "support@maindodigital.com",
    "priceRange": "R$-R$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address",
      "addressLocality": "Cape Town",
      "addressRegion": "WC",
      "postalCode": "8000",
      "addressCountry": "ZA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -33.9249,
      "longitude": 18.4241
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "17:00"
    },
    "sameAs": [
      "https://www.facebook.com/maindodigital",
      "https://www.twitter.com/maindodigital",
      "https://www.linkedin.com/company/maindodigital"
    ]
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

// Component for BreadcrumbList schema
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

