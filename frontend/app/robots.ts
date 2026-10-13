import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/sobre-nosotros'],
      disallow: ['/api/', '/login', '/dashboard', '/clients', '/quotes', '/equipment', '/work-orders', '/users', '/requisitions', '/email-requests', '/admin'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
