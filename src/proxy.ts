import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

import { Paths } from "./frontend/configuration/Paths";
import type { NextFetchEvent, NextRequest } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";


const authMiddleware = withAuth({
  pages: {
    signIn: "/connexion",
  },
});


const PATHS = new Paths();


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

    const token = (request as NextRequestWithAuth).nextauth.token as { cgu?: boolean } | null;

    const isCguPage = request.nextUrl.pathname === PATHS.VALIDER_CGU;
    const hasAcceptedCgu = token?.cgu === true;

    if (!hasAcceptedCgu && !isCguPage) {
      const url = request.nextUrl.clone();
      url.pathname = PATHS.VALIDER_CGU;
      return NextResponse.redirect(url);
    }

  // Si l'IP est valide, on délègue ensuite à next-auth pour gérer la session
  return (authMiddleware as any)(request, event);
}

export const config = {
  matcher: [
    "/",
    "/connexion",
    "/region/:path*",
    "/entite-juridique/:path*",
    "/etablissement-territorial-sanitaire/:path*",
    "/etablissement-territorial-medico-social/:path*",
    "/settings/:path*",
    "/mon-compte",
    "/recherche-avancee",
    "/favoris",
    "/comparaison",
    "/history",
    "/change-mot-passe",
    "/valider-cgu",
    "/liste/:path*",
    "/api/recherche",
    "/api/revalidate",
    "/api/liste/:path*",
    "/mes-listes"
  ],
};
