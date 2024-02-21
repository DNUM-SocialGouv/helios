import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheEndpoints";
import { récupèreLÉtablissementTerritorialMédicoSocialEndpoint } from "../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialMédicoSocialEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { ÉtablissementTerritorialMédicoSocial } from "../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from "../../backend/métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { PageÉtablissementTerritorialMédicoSocial } from "../../frontend/ui/établissement-territorial-médico-social/PageÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialViewModel } from "../../frontend/ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel";


type RouterProps = Readonly<{
  établissementTerritorial: ÉtablissementTerritorialMédicoSocial;
  rechercheResult: any;
}>;

export default function Router({ rechercheResult, établissementTerritorial }: RouterProps) {
  const { paths, wording } = useDependencies();
  if (!établissementTerritorial) return null;
  // eslint-disable-next-line no-console
  console.log('result établissementTerritorial', établissementTerritorial);
  const établissementTerritorialViewModel = new ÉtablissementTerritorialMédicoSocialViewModel(établissementTerritorial, wording, paths);
  const rechercheViewModel = new RechercheViewModel(rechercheResult.résultats[0], paths);

  return (
    <>
      {rechercheViewModel ? (
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialViewModel}
        />
      ) : (
        <Spinner />
      )}
    </>

  )
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const session = await getSession(context);
    const codeRegion = session?.user.codeRegion as unknown as string;
    const codeProfiles = session?.user.codeProfiles as string[];

    if (context.params && context.params["numeroFiness"]) {
      const numeroFiness = context.params["numeroFiness"] as string;

      const établissementTerritorial = (await récupèreLÉtablissementTerritorialMédicoSocialEndpoint(
        dependencies,
        numeroFiness,
        codeRegion,
        codeProfiles
      )) as ÉtablissementTerritorialMédicoSocial;

      const rechercheResult = await rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies, numeroFiness, 1);

      return { props: { établissementTerritorial, rechercheResult: rechercheResult, } };
    } else {
      return { notFound: true };
    }

  } catch (error) {
    if (error instanceof ÉtablissementTerritorialMédicoSocialNonTrouvée) {
      dependencies.logger.error(error.message);
      return { notFound: true };
    }
    throw error;
  }
}
