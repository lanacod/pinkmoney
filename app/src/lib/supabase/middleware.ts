import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

// Rotas públicas (não precisam de auth)
const PUBLIC_ROUTES = ['/login', '/cadastro']
const ONBOARDING_ROUTES = ['/bem-vinda', '/objetivos', '/categorias']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
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

  // Refresh session — IMPORTANTE: não remova este bloco
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isPublic    = PUBLIC_ROUTES.some(r => pathname.startsWith(r))
  const isOnboarding = ONBOARDING_ROUTES.some(r => pathname.startsWith(r))
  const isRoot      = pathname === '/'

  // Usuário não autenticado → redireciona para login
  if (!user && !isPublic) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Usuário autenticado tentando acessar rotas públicas → vai pro dashboard
  if (user && isPublic) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  // Root → redireciona
  if (isRoot) {
    const target = request.nextUrl.clone()
    target.pathname = user ? '/dashboard' : '/login'
    return NextResponse.redirect(target)
  }

  return supabaseResponse
}
