

import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { getDatesMiseAjourSourcesEndpoint } from "../backend/infrastructure/controllers/getDatesMiseAjourSources";
import { dependencies } from "../backend/infrastructure/dependencies";
import { DatesMisAjourSources } from "../backend/métier/entities/ResultatDeComparaison";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { ComparaisonPage } from "../frontend/ui/comparaison/ComparaisonPage";


type RouterProps = Readonly<{ datesMisAjour: DatesMisAjourSources, codeProfiles: string[], codeRegion: string }>;

export default function Router({ codeProfiles, codeRegion, datesMisAjour }: RouterProps) {
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: wording.COMPARAISON,
      path: "",
    },
  ]);

  return <ComparaisonPage codeProfiles={codeProfiles} codeRegion={codeRegion} datesMisAjour={datesMisAjour} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  const session = await getSession(context);
  const codeRegion = session?.user.codeRegion as unknown as string;
  const codeProfiles = session?.user.codeProfiles as string[];
  const datesMisAjour = await getDatesMiseAjourSourcesEndpoint(dependencies);

  return {
    props: { codeProfiles, codeRegion, datesMisAjour: JSON.parse(JSON.stringify(datesMisAjour)) },
  };
}
