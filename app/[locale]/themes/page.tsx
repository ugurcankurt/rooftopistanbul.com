import { createClient } from "@/lib/supabase"
import { getTranslations, getLocale } from "next-intl/server"
import { getLocalized } from "@/lib/i18n-utils"
import ConceptCard from "@/components/home/ConceptCard"

export const revalidate = 3600

export default async function ThemesPage() {
    const t = await getTranslations('Home.themes')
    const locale = await getLocale()
    const supabase = await createClient()

    const { data: concepts } = await supabase
        .from('concepts')
        .select('*')
        .order('created_at', { ascending: true })

    return (
        <div className="min-h-screen py-24 bg-gray-50 dark:bg-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                        {t('title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        {t('description')}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {concepts?.map((concept) => (
                        <ConceptCard
                            key={concept.id}
                            slug={concept.slug || concept.id}
                            title={getLocalized(concept.title, locale)}
                            description={getLocalized(concept.description, locale)}
                            image={concept.image}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
