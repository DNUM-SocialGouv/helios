import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import "@gouvfr/dsfr/dist/component/tab/tab.min.css";

import { ProfilModel } from "../../../database/models/ProfilModel";
import { getAideEndpoint } from "../../backend/infrastructure/controllers/getAideEndpoint";
import { getAllProfilesEndpoint } from "../../backend/infrastructure/controllers/getAllProfilesEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../frontend/ui/commun/hooks/useBreadcrumb";
import { GestionAide, ContenuAide } from "../../frontend/ui/parametrage-aide";
import { ParametragePage } from "../../frontend/ui/parametrage-profil/ParametragePage";

const AIDE_TAB_LABEL = "Paramétrage de l'aide";

type TabKey = "profiles" | "aide";

type RouterProps = Readonly<{
  profiles: ProfilModel[];
  aideData: ContenuAide;
  initialTab: TabKey;
}>;

const TAB_QUERY_KEY = "onglet";

export default function SettingsParametragePage({ profiles, aideData, initialTab }: RouterProps) {
  const router = useRouter();
  const { wording, breadcrumbHandler } = useDependencies();
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const baseBreadcrumb = useMemo(
    () => [
      {
        label: wording.PARAMETRAGE_TITRE,
        path: "",
      },
    ],
    [wording.PARAMETRAGE_TITRE]
  );

  useBreadcrumb(baseBreadcrumb);

  useEffect(() => {
    const breadcrumb =
      activeTab === "aide"
        ? baseBreadcrumb.concat({ label: AIDE_TAB_LABEL, path: "" })
        : baseBreadcrumb;
    breadcrumbHandler.updateBreadcrum(breadcrumb);
  }, [activeTab, baseBreadcrumb, breadcrumbHandler]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    const query = { ...router.query };
    if (tab === "profiles") {
      delete query[TAB_QUERY_KEY];
    } else {
      query[TAB_QUERY_KEY] = tab;
    }

    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
  };

  return (
    <main id="content">
      <div className="fr-container fr-py-9w">
        <div className="fr-tabs">
          <ul className="fr-tabs__list" role="tablist">
            <li>
              <button
                aria-controls="tabpanel-profiles"
                aria-selected={activeTab === "profiles"}
                className={`fr-tabs__tab${activeTab === "profiles" ? " fr-tabs__tab--selected" : ""}`}
                id="tab-profiles"
                onClick={() => handleTabChange("profiles")}
                role="tab"
                type="button"
              >
                {wording.PARAMETRAGE_TITRE}
              </button>
            </li>
            <li>
              <button
                aria-controls="tabpanel-aide"
                aria-selected={activeTab === "aide"}
                className={`fr-tabs__tab${activeTab === "aide" ? " fr-tabs__tab--selected" : ""}`}
                id="tab-aide"
                onClick={() => handleTabChange("aide")}
                role="tab"
                type="button"
              >
                {AIDE_TAB_LABEL}
              </button>
            </li>
          </ul>

          <div
            aria-labelledby="tab-profiles"
            className={`fr-tabs__panel${activeTab === "profiles" ? " fr-tabs__panel--selected" : ""}`}
            hidden={activeTab !== "profiles"}
            id="tabpanel-profiles"
            role="tabpanel"
          >
            <ParametragePage profiles={profiles} wrapInMain={false} />
          </div>

          <div
            aria-labelledby="tab-aide"
            className={`fr-tabs__panel${activeTab === "aide" ? " fr-tabs__panel--selected" : ""}`}
            hidden={activeTab !== "aide"}
            id="tabpanel-aide"
            role="tabpanel"
          >
            <GestionAide contenuInitial={aideData} envelopperDansMain={false} />
          </div>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<RouterProps>> {
  try {
    const session = await getSession(context);

    if (session?.user?.role !== 1) {
      return {
        redirect: {
          destination: "/inaccessible",
          permanent: false,
        },
      };
    }

    const [profiles, aideData] = await Promise.all([
      getAllProfilesEndpoint(dependencies),
      getAideEndpoint(dependencies),
    ]);

    if (!aideData || typeof aideData !== "object" || Array.isArray(aideData)) {
      return {
        notFound: true,
      };
    }

    const tabParam = context.query[TAB_QUERY_KEY];
    const initialTab = tabParam === "aide" ? "aide" : "profiles";

    return {
      props: {
        profiles: JSON.parse(JSON.stringify(profiles ?? [])),
        aideData: JSON.parse(JSON.stringify(aideData)) as ContenuAide,
        initialTab,
      },
    };
  } catch (error) {
    dependencies.logger.error((error as Error)?.message ?? error);
    return {
      notFound: true,
    };
  }
}
