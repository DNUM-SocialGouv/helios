import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

import "@gouvfr/dsfr/dist/core/core.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-arrows/icons-arrows.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-communication/icons-communication.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-design/icons-design.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-development/icons-development.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-device/icons-device.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-document/icons-document.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-editor/icons-editor.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-finance/icons-finance.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-health/icons-health.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-logo/icons-logo.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-map/icons-map.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-media/icons-media.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-others/icons-others.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-weather/icons-weather.min.css";
import "@gouvfr/dsfr/dist/utility/colors/colors.min.css";
import "@gouvfr/dsfr/dist/component/button/button.min.css";
import "@gouvfr/dsfr/dist/component/input/input.min.css";
import "@gouvfr/dsfr/dist/component/form/form.min.css";
import "@gouvfr/dsfr/dist/component/search/search.min.css";
import "@gouvfr/dsfr/dist/component/badge/badge.min.css";
import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";
import "@gouvfr/dsfr/dist/component/radio/radio.min.css";
import "@gouvfr/dsfr/dist/component/notice/notice.min.css";
import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/segmented/segmented.min.css";
import "../frontend/ui/commun/global.css";

import { ComparaisonContextProvider } from "../frontend/ui/commun/contexts/ComparaisonContextProvider";
import { ProfileContextProvider } from "../frontend/ui/commun/contexts/ProfileContextProvider";
import { RechecheAvanceeContextProvider } from "../frontend/ui/commun/contexts/RechercheAvanceeContextProvider";
import { DependenciesProvider } from "../frontend/ui/commun/contexts/useDependencies";
import { UserContextProvider } from "../frontend/ui/commun/contexts/userContextProvider";
import { Footer } from "../frontend/ui/commun/Footer/Footer";
import { Header } from "../frontend/ui/commun/Header/Header";
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
          <RechecheAvanceeContextProvider>
            <ComparaisonContextProvider>
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
            </ComparaisonContextProvider>
          </RechecheAvanceeContextProvider>
        </ProfileContextProvider>
      </UserContextProvider>
    </SessionProvider>
  );
}
