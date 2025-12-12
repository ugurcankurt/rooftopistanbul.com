import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase'

const locales = ['en', 'tr', 'ru', 'ar', 'es']
const baseUrl = 'https://rooftopistanbul.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()
    const { data: concepts } = await supabase
        .from('concepts')
        .select('id, slug, created_at')

    const sitemapEntries: MetadataRoute.Sitemap = []

    // Static routes
    const routes = ['', '/our-packages', '/contact']

    routes.forEach(route => {
        locales.forEach(locale => {
            const url = `${baseUrl}/${locale}${route}`
            sitemapEntries.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : 0.8
            })
        })
    })

    // Dynamic concepts
    if (concepts) {
        concepts.forEach((concept) => {
            locales.forEach(locale => {
                const slug = concept.slug || concept.id
                const url = `${baseUrl}/${locale}/themes/${slug}`
                sitemapEntries.push({
                    url,
                    lastModified: new Date(concept.created_at || new Date()),
                    changeFrequency: 'weekly',
                    priority: 0.7
                })
            })
        })
    }

    return sitemapEntries
}
