/* eslint-disable */
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const allowedIps = (process.env['WHITELIST_IP'] as string).split(',')
  const userIp = request.headers.get('x-forwarded-for') || request.ip as string

  // Pour l'environnement de développement
  if (userIp === undefined) {
    return NextResponse.next()
  }

  if (!allowedIps.includes(userIp)) {
    const url = request.nextUrl.clone()
    url.pathname = '/inaccessible'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/region/:path*',
    '/entite-juridique/:path*',
    '/etablissement-territorial-sanitaire/:path*',
    '/etablissement-territorial-medico-social/:path*',
    '/accessibilite',
    '/donnees-personnelles',
    '/mentions-legales',
    '/api/recherche',
    '/api/revalidate',
  ],
}
