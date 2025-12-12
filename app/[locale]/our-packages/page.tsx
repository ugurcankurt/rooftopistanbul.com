import { createClient } from "@/lib/supabase"
import PackagesView from "@/components/packages/PackagesView"
import { getTranslations, getLocale } from "next-intl/server"

export const revalidate = 3600 // Revalidate every hour

export default async function PackagesPage() {
    const t = await getTranslations('Packages');
    const locale = await getLocale();
    const supabase = await createClient()
    const { data: packages, error } = await supabase
        .from('packages')
        .select('*')
        .order('price', { ascending: true })

    if (error) {
        console.error("Error fetching packages:", error)
        return <div className="text-center py-20 text-red-500">{t('error')}</div>
    }

    return <PackagesView packages={packages || []} locale={locale} />
}
