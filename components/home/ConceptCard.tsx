import Image from "next/image"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/navigation"

interface ConceptCardProps {
    slug: string
    title: string
    description: string
    image: string
    className?: string
}

export default function ConceptCard({ slug, title, description, image, className }: ConceptCardProps) {
    return (
        <Link href={`/themes/${slug}`} className={cn("group relative block overflow-hidden rounded-2xl cursor-pointer aspect-[3/4] w-full", className)}>
            <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 lg:opacity-60 lg:group-hover:opacity-90 transition-opacity duration-300" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-lg lg:text-xl font-bold text-white mb-1 lg:mb-2 leading-tight">{title}</h3>
                <p className="text-gray-200 text-xs lg:text-sm lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                    {description}
                </p>
            </div>
        </Link>
    )
}
