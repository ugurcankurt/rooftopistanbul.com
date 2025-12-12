"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PackageCard from "@/components/packages/PackageCard"
import ReservationModal from "@/components/packages/ReservationModal"
import { getLocalized } from "@/lib/i18n-utils"

interface Package {
    id: string
    name: any
    price: number
    currency: string
    features: any
    is_featured: boolean
    category: 'outdoor' | 'studio'
}

interface PackagesViewProps {
    packages: Package[]
    locale: string
}

import { useCurrency } from "@/context/CurrencyContext"

export default function PackagesView({ packages, locale }: PackagesViewProps) {
    const t = useTranslations('Packages')
    const { convertPrice } = useCurrency()
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Group packages by category
    const studioPackages = packages?.filter(p => p.category === 'studio') || []
    const outdoorPackages = packages?.filter(p => !p.category || p.category === 'outdoor') || []

    const handleSelectPackage = (pkg: Package) => {
        setSelectedPackage(pkg)
        setIsModalOpen(true)
    }

    return (
        <>
            <div className="py-20 bg-gray-50 dark:bg-black min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">{t('title')}</h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                            {t('description')}
                        </p>
                    </div>

                    <Tabs defaultValue="studio" className="w-full">
                        <div className="flex justify-center mb-12">
                            <TabsList className="grid w-full max-w-md grid-cols-2">
                                <TabsTrigger value="studio">{t('tabs.studio')}</TabsTrigger>
                                <TabsTrigger value="outdoor">{t('tabs.outdoor')}</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="studio">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {studioPackages.map((pkg) => {
                                    const { value, symbol } = convertPrice(pkg.price)
                                    return (
                                        <PackageCard
                                            key={pkg.id}
                                            name={getLocalized(pkg.name, locale)}
                                            price={value}
                                            currency={symbol}
                                            features={getLocalized(pkg.features, locale)}
                                            isFeatured={pkg.is_featured}
                                            onSelect={() => handleSelectPackage(pkg)}
                                        />
                                    )
                                })}
                                {studioPackages.length === 0 && (
                                    <p className="col-span-3 text-center text-gray-500 py-12 bg-white dark:bg-gray-900 rounded-xl border-dashed border-2 border-gray-200">
                                        {t('noStudio')}
                                    </p>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="outdoor">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {outdoorPackages.map((pkg) => {
                                    const { value, symbol } = convertPrice(pkg.price)
                                    return (
                                        <PackageCard
                                            key={pkg.id}
                                            name={getLocalized(pkg.name, locale)}
                                            price={value}
                                            currency={symbol}
                                            features={getLocalized(pkg.features, locale)}
                                            isFeatured={pkg.is_featured}
                                            onSelect={() => handleSelectPackage(pkg)}
                                        />
                                    )
                                })}
                                {outdoorPackages.length === 0 && (
                                    <p className="col-span-3 text-center text-gray-500 py-12 bg-white dark:bg-gray-900 rounded-xl">
                                        {t('noOutdoor')}
                                    </p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-20 text-center bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-3xl font-bold mb-4">{t('custom.title')}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            {t('custom.description')}
                        </p>
                        <a href="mailto:info@rooftopistanbul.com" className="text-amber-600 font-bold hover:underline">
                            {t('custom.cta')}
                        </a>
                    </div>
                </div>
            </div>

            {selectedPackage && (
                <ReservationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    packageName={getLocalized(selectedPackage.name, locale)}
                    packageId={selectedPackage.id}
                    packagePrice={selectedPackage.price}
                    packageCategory={selectedPackage.category}
                    allPackages={packages}
                    locale={locale}
                />
            )}
        </>
    )
}
