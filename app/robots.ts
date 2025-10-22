import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/userDashboard/', '/_next/'],
      },
    ],
    sitemap: 'https://www.maindodigital.com/sitemap.xml',
  }
}

