import { useTranslations } from "next-intl"
import { Mail, Phone, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
    const t = useTranslations('Contact')
    const f = useTranslations('Footer')

    return (
        <div className="min-h-screen py-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                        {t('title')}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Info Card */}
                    <Card className="border-muted bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-8 space-y-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2">{t('info')}</h2>
                                <div className="h-1 w-20 bg-amber-500 rounded-full" />
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1 text-sm text-muted-foreground uppercase tracking-wider">{t('addressLabel')}</h3>
                                        <p className="text-foreground">{f('address')}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1 text-sm text-muted-foreground uppercase tracking-wider">{t('emailLabel')}</h3>
                                        <a href={`mailto:${f('email')}`} className="text-foreground hover:text-amber-600 transition-colors">
                                            {f('email')}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1 text-sm text-muted-foreground uppercase tracking-wider">{t('phoneLabel')}</h3>
                                        <a href={`https://wa.me/${f('phone').replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-amber-600 transition-colors">
                                            {f('phone')}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t">
                                <Button className="w-full h-12 text-lg font-bold bg-amber-600 hover:bg-amber-700" asChild>
                                    <a href={`https://wa.me/${f('phone').replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer">
                                        {t('chatWhatsapp')}
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Google Maps Profile Card */}
                    <Card className="overflow-hidden border-muted shadow-xl min-h-[400px] flex items-center justify-center bg-muted/20 relative group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col items-center text-center p-8 space-y-6 max-w-sm">
                            <div className="h-20 w-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg mb-2">
                                <MapPin className="w-10 h-10 text-amber-600" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">Rooftop Istanbul</h3>
                                <p className="text-muted-foreground">Nova Photo Istanbul</p>
                                <div className="flex items-center justify-center gap-1 text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                    ))}
                                    <span className="text-foreground font-medium ml-2">5.0</span>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {t('googleMapsDesc')}
                            </p>

                            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20" asChild>
                                <a
                                    href="https://share.google/azJKkPuCi6nzV3WCY"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('openMaps')}
                                </a>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
