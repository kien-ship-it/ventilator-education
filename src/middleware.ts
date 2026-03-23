import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Run middleware on:
         * - (main) group: /dashboard, /island/*, /activity/*, /researcher
         * - (auth) group: /login, /register, /onboarding
         *
         * Skip:
         * - _next/static, _next/image (Next.js internals)
         * - favicon.ico
         * - public assets (svg, png, jpg, etc.)
         * - /api/* routes (handled by route handlers)
         */
        '/dashboard',
        '/dashboard/:path*',
        '/island/:path*',
        '/activity/:path*',
        '/researcher',
        '/researcher/:path*',
        '/login',
        '/register',
        '/onboarding',
    ],
}
