import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that belong to the (main) authenticated route group
const PROTECTED_ROUTES = ['/dashboard', '/island', '/activity', '/researcher']

function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))
}

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh session — IMPORTANT: do not remove, required for session cookie rotation
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    // Redirect unauthenticated users trying to access protected routes to login
    if (!user && isProtectedRoute(pathname)) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // For authenticated users accessing protected routes, check onboarding status
    if (user && isProtectedRoute(pathname) && pathname !== '/onboarding') {
        const { data: dbUser } = await supabase
            .from('users')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single()

        if (dbUser && !dbUser.onboarding_completed) {
            const url = request.nextUrl.clone()
            url.pathname = '/onboarding'
            return NextResponse.redirect(url)
        }
    }

    // Redirect authenticated users who completed onboarding away from login/register
    if (user && (pathname === '/login' || pathname === '/register')) {
        const { data: dbUser } = await supabase
            .from('users')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single()

        const url = request.nextUrl.clone()
        url.pathname = dbUser?.onboarding_completed ? '/dashboard' : '/onboarding'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
