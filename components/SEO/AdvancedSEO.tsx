"use client";

import Script from "next/script";

interface VideoObject {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl: string;
}

interface ArticleSchema {
  headline: string;
  image: string;
  author: string;
  publisher: string;
  datePublished: string;
  dateModified: string;
}

export function VideoSchema({ video }: { video: VideoObject }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.name,
    "description": video.description,
    "thumbnailUrl": [video.thumbnailUrl],
    "uploadDate": video.uploadDate,
    "duration": video.duration,
    "contentUrl": video.contentUrl,
    "embedUrl": video.contentUrl,
  };

  return (
    <Script
      id="video-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

export function ArticleSchema({ article }: { article: ArticleSchema }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.headline,
    "image": [article.image],
    "author": {
      "@type": "Person",
      "name": article.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": article.publisher,
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.maindodigital.com/maindo_digital_agency_logo.png"
      }
    },
    "datePublished": article.datePublished,
    "dateModified": article.dateModified,
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Maindo Digital Agency",
    "url": "https://www.maindodigital.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.maindodigital.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

export function OffersSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Web Development",
          "description": "Custom website development using React, Next.js, and modern technologies"
        },
        "seller": {
          "@type": "Organization",
          "name": "Maindo Digital Agency"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Mobile App Development",
          "description": "Native and cross-platform mobile applications for iOS and Android"
        },
        "seller": {
          "@type": "Organization",
          "name": "Maindo Digital Agency"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "SEO & Digital Marketing",
          "description": "Search engine optimization and comprehensive digital marketing services"
        },
        "seller": {
          "@type": "Organization",
          "name": "Maindo Digital Agency"
        }
      }
    ]
  };

  return (
    <Script
      id="offers-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

// Rating Aggregate Schema for better search results
export function RatingSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Digital Marketing Services",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "5000",
      "highPrice": "100000",
      "priceCurrency": "ZAR",
      "offerCount": "4"
    }
  };

  return (
    <Script
      id="rating-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

