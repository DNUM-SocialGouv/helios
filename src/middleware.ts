/* eslint-disable @next/next/no-server-import-in-page */
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(request: NextRequest) {
    const allowedIps = (process.env["WHITELIST_IP"] as string).split(",");
    const userIp = request.headers.get("x-forwarded-for") || (request.ip as string);

    // Pour l'environnement de développement
    if (userIp === undefined) {
      return NextResponse.next();
    }

    if (!allowedIps.includes(userIp)) {
      const url = request.nextUrl.clone();
      url.pathname = "/inaccessible";
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/connexion"
    }
  })

export const config = {
  matcher: [
    "/",
    "/connexion",
    "/region/:path*",
    "/entite-juridique/:path*",
    "/etablissement-territorial-sanitaire/:path*",
    "/etablissement-territorial-medico-social/:path*",
    "/settings/:path*",
    "/profile",
    "/favoris",
    "/history",
    "/change-mot-passe",
    "/accessibilite",
    "/donnees-personnelles",
    "/mentions-legales",
    "/api/recherche",
    "/api/revalidate",
  ],
};
