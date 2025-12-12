import Hero from "@/components/home/Hero"
import ConceptCard from "@/components/home/ConceptCard"
import Testimonials from "@/components/home/Testimonials"
import { createClient } from "@/lib/supabase"
import { getTranslations, getLocale } from "next-intl/server"
import { getLocalized } from "@/lib/i18n-utils"

import reviewsData from "@/data/reviews.json"

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  return {
    alternates: {
      languages: {
        'en': '/en',
        'tr': '/tr',
        'ru': '/ru',
        'ar': '/ar',
        'es': '/es',
      },
    }
  };
}

export default async function Home() {
  const t = await getTranslations('Home');
  const locale = await getLocale();
  const supabase = await createClient()

  const { data: concepts } = await supabase
    .from('concepts')
    .select('*')
    .order('created_at', { ascending: true })

  const { data: whyUsData } = await supabase
    .from('site_content')
    .select('content')
    .eq('key', 'why_choose_us')
    .single()

  const whyUs = whyUsData?.content

  // Use local GMB reviews
  const testimonials = reviewsData

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Concepts Section */}
      <section id="themes" className="py-20 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t('themes.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('themes.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {concepts?.map((concept) => (
              <ConceptCard
                key={concept.id}
                slug={concept.slug || concept.id} // Fallback to ID if slug is missing temporarily
                title={getLocalized(concept.title, locale)}
                description={getLocalized(concept.description, locale)}
                image={concept.image}
              />
            ))}
            {!concepts?.length && <p className="col-span-4 text-center text-gray-500">{t('themes.noConcepts')}</p>}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      {whyUs && (
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${whyUs.image_url}')` }}
                />
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-6">{getLocalized(whyUs.heading, locale)}</h2>
                <div className="space-y-6">
                  {whyUs.reasons?.map((reason: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-xl shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{getLocalized(reason.title, locale)}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{getLocalized(reason.description, locale)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* Testimonials */}
      <Testimonials testimonials={testimonials || []} />
    </div>
  )
}
