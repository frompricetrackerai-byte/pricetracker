import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://pricetracker.store';

    return {
        rules: {
            userAgent: '*',
            allow: ['/', '/amazon-price-tracker', '/flipkart-price-tracker', '/myntra-price-tracker', '/ajio-price-tracker'],
            disallow: ['/admin/', '/dashboard/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
