import { createClient } from "@/lib/supabase"
import { getTranslations } from "next-intl/server"
import PortfolioGallery from "@/components/portfolio/PortfolioGallery"

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Portfolio' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function PortfolioPage({
    params
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Portfolio' });
    const supabase = await createClient()

    // Fetch images from 'portfolio_images' table
    // Ordering by created_at desc for newest first
    const { data: images } = await supabase
        .from('portfolio_images')
        .select('*')
        .order('created_at', { ascending: false })

    // Shuffle images for random display
    const shuffledImages = images ? [...images].sort(() => Math.random() - 0.5) : []

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        {t('title')}
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        {t('description')}
                    </p>
                </div>

                <PortfolioGallery images={shuffledImages} locale={locale} />
            </div>
        </div>
    )
}
