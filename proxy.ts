import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/navigation';

export default createMiddleware(routing);

export const config = {
    // Match only internationalized pathnames
    // Explicitly exclude static files, api, and _next
    matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
};
