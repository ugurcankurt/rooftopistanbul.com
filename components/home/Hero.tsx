import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { ArrowRight, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { getTranslations, getLocale } from "next-intl/server"
import { getLocalized } from "@/lib/i18n-utils"

export default async function Hero() {
    const t = await getTranslations('Home.hero');
    const locale = await getLocale();
    const supabase = await createClient()
    const { data: heroData } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', 'hero_section')
        .single()

    // Default Fallback
    const content = heroData?.content

    if (!content) return null

    const heading = getLocalized(content.heading, locale);
    const subheading = getLocalized(content.subheading, locale);

    return (
        <section className="relative h-[80vh] min-h-[480px] md:h-screen md:min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0 select-none">
                {/* Hero Image */}
                <Image
                    src={content.image_url}
                    alt={t('tag')}
                    fill
                    priority
                    className="object-cover object-center scale-110 animate-ken-burns"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 backdrop-blur-[1px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium tracking-wide">{t('tag')}</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    {heading.split(',')[0]}, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 filter drop-shadow-sm">
                        {heading.split(',')[1] || "Your Memory."}
                    </span>
                </h1>

                <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    {subheading}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <Button asChild size="lg" className="h-14 px-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.5)] border-0">
                        <Link href="/our-packages">
                            {t('ctaPrimary')}
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full bg-white/5 hover:bg-white/10 text-white border-white/30 backdrop-blur-sm font-semibold text-lg hover:text-white">
                        <Link href="#themes">
                            {t('ctaSecondary')}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
