"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { X, ZoomIn } from "lucide-react"

interface PortfolioImage {
    id: string
    storage_path: string
    category: string
    width?: number
    height?: number
    alt_text?: any // JSON or string
}

interface PortfolioGalleryProps {
    images: PortfolioImage[]
    locale: string
}

export default function PortfolioGallery({ images, locale }: PortfolioGalleryProps) {
    const t = useTranslations('Portfolio')
    const [filter, setFilter] = useState("all")
    const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null)

    const categories = ["all", "studio", "outdoor", "wedding", "special"]

    const filteredImages = images.filter(img =>
        filter === "all" || img.category === filter
    )

    // Helper to get alt text
    const getAlt = (img: PortfolioImage) => {
        if (!img.alt_text) return "Portfolio Image"
        if (typeof img.alt_text === 'string') return img.alt_text
        return img.alt_text[locale] || img.alt_text['en'] || "Portfolio Image"
    }

    // Helper to get full URL
    // Assuming storage_path is relative, we prepend the public bucket URL if needed.
    // However, if the user uploads via dashboard and gets a public URL, they might store that. 
    // Let's assume storage_path is the relative path in the 'portfolio' bucket.
    const getImageUrl = (path: string) => {
        if (path.startsWith('http')) return path
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`
    }

    return (
        <div className="space-y-8">
            {/* Filter Tabs */}
            <div className="flex justify-center mb-8">
                <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="w-auto">
                    <TabsList className="flex flex-wrap justify-center h-auto p-1 bg-muted/30 rounded-full gap-1">
                        {categories.map(cat => (
                            <TabsTrigger
                                key={cat}
                                value={cat}
                                className="capitalize px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[80px]"
                            >
                                {t(`tabs.${cat}`)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* Gallery Grid (Masonry using standard CSS columns) */}
            <AnimatePresence mode="wait">
                <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                >
                    {filteredImages.map((img) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            key={img.id}
                            className="relative group overflow-hidden rounded-xl cursor-zoom-in bg-gray-100 dark:bg-gray-800 aspect-[4/5]"
                            onClick={() => setSelectedImage(img)}
                        >
                            <Image
                                src={getImageUrl(img.storage_path)}
                                alt={getAlt(img)}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <ZoomIn className="text-white w-10 h-10 drop-shadow-md" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {filteredImages.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    {t('noImages')}
                </div>
            )}

            {/* Lightbox Modal */}
            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="max-w-screen-xl w-full h-[90vh] p-0 bg-black/95 border-none shadow-none flex items-center justify-center outline-none">
                    <DialogTitle className="sr-only">
                        {selectedImage ? getAlt(selectedImage) : t('title')}
                    </DialogTitle>
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {selectedImage && (
                            <Image
                                src={getImageUrl(selectedImage.storage_path)}
                                alt={getAlt(selectedImage)}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
