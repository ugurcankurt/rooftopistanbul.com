import { Link } from "@/i18n/navigation"
import { Instagram, Mail, Phone, MapPin, Facebook } from "lucide-react"
import Image from "next/image"
import { getTranslations } from "next-intl/server"

export default async function Footer() {
    const t = await getTranslations('Footer');
    const navT = await getTranslations('Navbar'); // Reuse some keys or duplicate? Defined separately in messages.
    // Actually I defined "navigation" in Footer group too.

    return (
        <footer className="bg-amber-50 text-gray-900 py-12 border-t border-amber-200">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-105 shrink-0">
                                <Image
                                    src="/logo.png"
                                    alt="Nova Photo Logo"
                                    fill
                                    sizes="48px"
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl md:text-2xl font-bold leading-none text-gray-900 tracking-tight">NOVA PHOTO</span>
                                <span className="text-[0.6rem] md:text-[0.65rem] font-medium leading-none text-amber-600 uppercase tracking-[0.2em]">istanbul rooftop studio</span>
                            </div>
                        </Link>
                        <p className="text-gray-600 text-sm">
                            {t('description')}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-gray-900">{t('navigation')}</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/" className="hover:text-amber-600 transition-colors">{navT('home')}</Link></li>
                            <li><Link href="/our-packages" className="hover:text-amber-600 transition-colors">{navT('packages')}</Link></li>
                            <li><Link href="/#themes" className="hover:text-amber-600 transition-colors">{navT('themes')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-gray-900">{t('contact')}</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{t('address')}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 shrink-0" />
                                <span>{t('email')}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 shrink-0" />
                                <span>{t('phone')}</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-gray-900">{t('social')}</h3>
                        <div className="flex gap-4">
                            <a href="https://instagram.com/novaphotoistanbul" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-600 transition-colors text-amber-900 hover:text-white">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://facebook.com/novaphotoistanbul" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 hover:bg-blue-600 transition-colors text-amber-900 hover:text-white">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-amber-200 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
                    <p>&copy; {new Date().getFullYear()} Rooftop Istanbul. {t('rights')}</p>
                    <a href="https://istanbulportrait.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">
                        {t('madeBy')}
                    </a>
                </div>
            </div>
        </footer>
    )
}
