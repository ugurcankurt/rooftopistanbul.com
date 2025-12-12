"use client"

import { Quote } from "lucide-react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLocale, useTranslations } from "next-intl"
import { getLocalized } from "@/lib/i18n-utils"

interface Testimonial {
    id: string
    client_name: string
    location?: any // Changed from string to any (JSONB)
    quote: any // Changed from string to any (JSONB)
    rating: number
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
    const t = useTranslations('Testimonials');
    const locale = useLocale();

    if (!testimonials || testimonials.length === 0) return null

    return (
        <section id="testimonials" className="py-24 bg-amber-50/50 dark:bg-black/40">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">{t('title')}</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>

                <div className="flex justify-center">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full max-w-5xl"
                    >
                        <CarouselContent className="-ml-4">
                            {testimonials.map((t) => (
                                <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                                    <div className="p-1 h-full">
                                        <Card className="h-full border-none shadow-lg bg-white dark:bg-gray-900 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                                <Quote className="w-24 h-24 text-amber-500 transform rotate-12" />
                                            </div>
                                            <CardContent className="flex flex-col h-full bg-white dark:bg-gray-900 p-8 pt-10">
                                                <div className="flex-1 mb-6 relative z-10">
                                                    <div className="flex gap-1 mb-4">
                                                        {[...Array(t.rating)].map((_, i) => (
                                                            <span key={i} className="text-amber-500 text-lg">★</span>
                                                        ))}
                                                    </div>
                                                    <blockquote className="text-gray-600 dark:text-gray-300 italic leading-relaxed line-clamp-[7]">
                                                        "{getLocalized(t.quote, locale)}"
                                                    </blockquote>
                                                </div>
                                                <div className="flex items-center gap-4 mt-auto border-t pt-6 dark:border-gray-800">
                                                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                                                        <AvatarFallback className="bg-amber-100 text-amber-700 font-bold">
                                                            {t.client_name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <cite className="not-italic font-bold text-sm block text-gray-900 dark:text-white">
                                                            {t.client_name}
                                                        </cite>
                                                        {t.location && (
                                                            <span className="text-xs text-muted-foreground block">
                                                                {getLocalized(t.location, locale)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12 bg-white hover:bg-amber-50 border-gray-200 text-gray-800" />
                        <CarouselNext className="hidden md:flex -right-12 bg-white hover:bg-amber-50 border-gray-200 text-gray-800" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
