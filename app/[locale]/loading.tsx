import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-20 min-h-screen">
            <div className="space-y-8">
                {/* Hero Section Skeleton */}
                <div className="h-[60vh] w-full rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="space-y-4 text-center w-full max-w-2xl px-4">
                            <Skeleton className="h-4 w-32 mx-auto rounded-full" />
                            <Skeleton className="h-16 w-3/4 mx-auto rounded-xl" />
                            <Skeleton className="h-6 w-1/2 mx-auto rounded-lg" />
                            <div className="flex justify-center gap-4 pt-4">
                                <Skeleton className="h-12 w-32 rounded-full" />
                                <Skeleton className="h-12 w-32 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-64 w-full rounded-xl" />
                            <Skeleton className="h-6 w-3/4 rounded-lg" />
                            <Skeleton className="h-4 w-full rounded-lg" />
                            <Skeleton className="h-4 w-2/3 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
