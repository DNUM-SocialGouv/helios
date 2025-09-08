

import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { CategoriesFinessModel } from "../../database/models/CategoriesFinessModel";
import { getDatesMiseAjourSourcesEndpoint } from "../backend/infrastructure/controllers/getDatesMiseAjourSources";
import { getFinessCategoriesEndpoint } from "../backend/infrastructure/controllers/getFinessCategoriesEndpoint";
import { dependencies } from "../backend/infrastructure/dependencies";
import { DatesMisAjourSources } from "../backend/métier/entities/ResultatDeComparaison";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { ComparaisonPage } from "../frontend/ui/comparaison/ComparaisonPage";
import { CategoriesFinessViewModel } from "../frontend/ui/recherche-avancee/model/CategoriesFinessViewModel";


type RouterProps = Readonly<{ datesMisAjour: DatesMisAjourSources, codeProfiles: string[], codeRegion: string, categories: CategoriesFinessModel[] | null }>;

export default function Router({ codeProfiles, codeRegion, datesMisAjour, categories }: RouterProps) {
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: wording.COMPARAISON,
      path: "",
    },
  ]);

  const categoriesViewModel = categories?.map((categorie) => new CategoriesFinessViewModel(categorie)) ?? [];

  return <ComparaisonPage categories={categoriesViewModel} codeProfiles={codeProfiles} codeRegion={codeRegion} datesMisAjour={datesMisAjour} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  const session = await getSession(context);
  const codeRegion = session?.user.codeRegion as unknown as string;
  const codeProfiles = session?.user.codeProfiles as string[];
  const datesMisAjour = await getDatesMiseAjourSourcesEndpoint(dependencies);
  const categoriesFiness = await getFinessCategoriesEndpoint(dependencies);

  return {
    props: { codeProfiles, codeRegion, datesMisAjour: JSON.parse(JSON.stringify(datesMisAjour)), categories: JSON.parse(JSON.stringify(categoriesFiness)) },
  };
}
