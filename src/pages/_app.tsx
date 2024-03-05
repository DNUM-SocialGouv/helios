import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";

import "@gouvfr/dsfr/dist/core/core.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-design/icons-design.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-document/icons-document.min.css";
import "@gouvfr/dsfr/dist/utility/colors/colors.min.css";
import "@gouvfr/dsfr/dist/component/button/button.min.css";
import "@gouvfr/dsfr/dist/component/input/input.min.css";
import "@gouvfr/dsfr/dist/component/search/search.min.css";
import "@gouvfr/dsfr/dist/component/badge/badge.min.css";
import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";
import "@gouvfr/dsfr/dist/component/radio/radio.min.css";
import "../frontend/ui/commun/global.css";

import { ProfileContextProvider } from "../frontend/ui/commun/contexts/ProfileContextProvider";
import { DependenciesProvider } from "../frontend/ui/commun/contexts/useDependencies";
import { UserContextProvider } from "../frontend/ui/commun/contexts/userContextProvider";
import { Footer } from "../frontend/ui/commun/Footer/Footer";
import { Header } from "../frontend/ui/commun/Header/Header";
// import { Cookies } from "../frontend/ui/cookies/Cookies";
import { resizeChartOnPrint } from "../plugins/resizeChartAtPrint";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      // @ts-ignore
      const atPiano = new ATInternet.Tracker.Tag({
        cookieSecure: true,
        sameSiteStrict: true,
        secure: true,
        site: process.env["NEXT_PUBLIC_AT_PIANO_SITE_ID"],
      });

      if (router.pathname.includes("[numeroFiness]")) {
        atPiano.page.send({ name: router.pathname });
      } else {
        atPiano.page.send({ name: router.asPath });
      }
    }
  });

  useEffect(resizeChartOnPrint, []);
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.onpageshow = function (event) {
        if (event.persisted) {
          window.location.reload();
        }
      };
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.addEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <SessionProvider session={session}>
      <UserContextProvider>
        <ProfileContextProvider>
          <DependenciesProvider>
            <Head>
              <meta charSet="utf-8" />
              <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport" />
              {/*<script src="/tarteaucitron.min.js"></script>
              <script src="/tarteaucitron.init.js"></script>*/}
            </Head>
            <Header />
            <Component {...pageProps} />
            <Footer />
            <Script src="/dsfr.module.min.js" strategy="lazyOnload" type="module"></Script>
            <Script noModule src="/dsfr.nomodule.min.js" strategy="lazyOnload" type="text/javascript"></Script>
            {process.env.NODE_ENV !== "development" && <Script src="/smarttag.js" strategy="beforeInteractive" />}
          </DependenciesProvider>
        </ProfileContextProvider>
      </UserContextProvider>
    </SessionProvider>
  );
}
