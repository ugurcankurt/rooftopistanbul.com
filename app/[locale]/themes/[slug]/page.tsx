import { createClient } from "@/lib/supabase"
import { getTranslations, getLocale } from "next-intl/server"
import { getLocalized } from "@/lib/i18n-utils"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import ConceptCard from "@/components/home/ConceptCard"

import { Metadata } from "next"

interface PageProps {
    params: Promise<{
        slug: string
        locale: string
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, locale } = await params
    const supabase = await createClient()

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    let query = supabase.from('concepts').select('title, description, image');

    if (isUuid) {
        query = query.or(`slug.eq.${slug},id.eq.${slug}`);
    } else {
        query = query.eq('slug', slug);
    }

    const { data: concept } = await query.single()

    if (!concept) return {}

    const title = getLocalized(concept.title, locale)
    const description = getLocalized(concept.description, locale)

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [concept.image]
        },
        alternates: {
            languages: {
                'en': `/en/themes/${slug}`,
                'tr': `/tr/themes/${slug}`,
                'ru': `/ru/themes/${slug}`,
                'ar': `/ar/themes/${slug}`,
                'es': `/es/themes/${slug}`,
            }
        }
    }
}

export const revalidate = 3600

export default async function ThemeDetailPage({ params }: PageProps) {
    const { slug, locale } = await params
    const t = await getTranslations('Home.themes')
    const tCommon = await getTranslations('Navbar')
    const supabase = await createClient()

    // 1. Fetch current concept
    // Check if UUID for backward compatibility
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    let query = supabase.from('concepts').select('*');
    if (isUuid) {
        query = query.or(`slug.eq.${slug},id.eq.${slug}`);
    } else {
        query = query.eq('slug', slug);
    }
    const { data: concept, error } = await query.single()

    if (error || !concept) return notFound()

    // 2. Fetch other concepts for "Explore More"
    const { data: otherConcepts } = await supabase
        .from('concepts')
        .select('*')
        .neq('id', concept.id) // Exclude current
        .limit(4)

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Full Screen Hero with Gradient */}
            <div className="relative w-full h-[60vh] md:h-[85vh]">
                <Image
                    src={concept.image}
                    alt={getLocalized(concept.title, locale)}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />


                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-24 container mx-auto">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
                        {getLocalized(concept.title, locale)}
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild size="lg" className="rounded-full text-lg px-8 py-6 bg-white text-black hover:bg-gray-200 transition-all duration-300">
                            <Link href="/our-packages">
                                {tCommon('bookNow')} <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-20 lg:py-32">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-4">
                        {locale === 'tr' ? 'HİKAYESİ' : 'THE STORY'}
                    </h2>
                    <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-p:text-gray-600 dark:prose-p:text-gray-300">
                        <p className="text-xl md:text-2xl leading-relaxed whitespace-pre-line font-light">
                            {getLocalized(concept.description, locale)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Other Themes Section */}
            {otherConcepts && otherConcepts.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-900/50 py-20 border-t border-gray-100 dark:border-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-end mb-12">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                {locale === 'tr' ? 'Diğer Konseptler' : 'Explore More Concepts'}
                            </h3>
                            <Link href="/themes" className="text-amber-500 hover:text-amber-400 font-medium hidden md:flex items-center gap-2">
                                {locale === 'tr' ? 'Tümünü Gör' : 'View All'} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {otherConcepts.map((item) => (
                                <ConceptCard
                                    key={item.id}
                                    slug={item.slug || item.id}
                                    title={getLocalized(item.title, locale)}
                                    description={getLocalized(item.description, locale)}
                                    image={item.image}
                                />
                            ))}
                        </div>
                        <div className="mt-8 md:hidden text-center">
                            <Link href="/themes" className="text-amber-500 font-medium inline-flex items-center gap-2">
                                {locale === 'tr' ? 'Tümünü Gör' : 'View All'} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
