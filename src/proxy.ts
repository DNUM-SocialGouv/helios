import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

import type { NextFetchEvent, NextRequest } from "next/server";

const authMiddleware = withAuth({
  pages: {
    signIn: "/connexion",
  },
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  const allowedIps = (process.env["WHITELIST_IP"] as string).split(",");
  // We get the IP from the X-Forwarded-For set by scalingo with a fall-back to X-Real-Ip
  // https://doc.scalingo.com/platform/internals/routing
  const userIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");

  if (!userIp || !allowedIps.includes(userIp)) {
    const url = request.nextUrl.clone();
    url.pathname = "/inaccessible";
    return NextResponse.rewrite(url);
  }

  // Si l'IP est valide, on délègue ensuite à next-auth pour gérer la session
  return (authMiddleware as any)(request, event);
}

export const config = {
  matcher: [
    '/',
    '/connexion',
    '/connexion/',
    '/region/:path*',
    '/entite-juridique/:path*',
    '/etablissement-territorial-sanitaire/:path*',
    '/etablissement-territorial-medico-social/:path*',
    '/settings/:path*',
    '/mon-compte',
    '/recherche-avancee',
    '/favoris',
    '/comparaison',
    '/history',
    '/change-mot-passe',
    '/liste/:path*',
    '/api/recherche',
    '/api/revalidate',
    '/api/liste/:path*',
    '/mes-listes',
  ],
};
