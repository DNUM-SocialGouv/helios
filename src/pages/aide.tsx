import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { getAideEndpoint } from "../backend/infrastructure/controllers/getAideEndpoint";
import { dependencies } from "../backend/infrastructure/dependencies";
import { InterfaceAide } from "../frontend/ui/aide";
import type { IdentifiantRole } from "../frontend/ui/aide/utils";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import type { ContenuAide, DefinitionSection } from "../frontend/ui/parametrage-aide/types";

type PageAideProps = Readonly<{
  contenu: ContenuAide;
  role: IdentifiantRole;
}>;

export default function PageAide({ contenu, role }: PageAideProps) {
  const { breadcrumbHandler } = useDependencies();
  const [sectionCourante, setSectionCourante] = useState<DefinitionSection | null>(null);

  useBreadcrumb([
    {
      label: "Aide",
      path: "",
    },
  ]);

  useEffect(() => {
    const filAriane = [
      {
        label: "Aide",
        path: sectionCourante ? "/aide" : "",
      },
    ];

    if (sectionCourante) {
      filAriane.push({ label: sectionCourante.titre, path: "" });
    }

    breadcrumbHandler.updateBreadcrum(filAriane);
  }, [sectionCourante, breadcrumbHandler]);

  return <InterfaceAide contenu={contenu} role={role} surChangementSection={setSectionCourante} />;
}

export async function getServerSideProps(
  contexte: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageAideProps>> {
  try {
    const session = await getSession(contexte);
    const contenu = await getAideEndpoint(dependencies);

    if (!contenu || typeof contenu !== "object" || Array.isArray(contenu)) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        contenu: JSON.parse(JSON.stringify(contenu)) as ContenuAide,
        role: typeof session?.user?.role === "number" ? session.user.role : null,
      },
    };
  } catch (erreur: any) {
    dependencies.logger.error(erreur?.message ?? erreur);
    return {
      notFound: true,
    };
  }
}
