import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheEndpoints";
import { récupèreLÉtablissementTerritorialMédicoSocialEndpoint } from "../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialMédicoSocialEndpoint";
import { saveSearchHistoryEndpoint } from "../../backend/infrastructure/controllers/saveSearchHistoryEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { ÉtablissementTerritorialMédicoSocial } from "../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from "../../backend/métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { PageÉtablissementTerritorialMédicoSocial } from "../../frontend/ui/établissement-territorial-médico-social/PageÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialViewModel } from "../../frontend/ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel";
import { ETB_MEDICO_SOCIAL } from "../../frontend/utils/constantes";

type RouterProps = Readonly<{
  établissementTerritorial: ÉtablissementTerritorialMédicoSocial;
  rechercheResult: any;
  autorisations: any;
}>;

export default function Router({ rechercheResult, établissementTerritorial, autorisations }: RouterProps) {
  const { paths, wording } = useDependencies();

  if (!établissementTerritorial) return null;

  const établissementTerritorialViewModel = new ÉtablissementTerritorialMédicoSocialViewModel(établissementTerritorial, wording, paths, autorisations);
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
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const session = await getSession(context);
    const codeRegion = session?.user.codeRegion as unknown as string;
    const codeProfiles = session?.user.codeProfiles as string[];

    if (context.params?.["numeroFiness"]) {
      const numeroFiness = context.params["numeroFiness"] as string;

      const etablissementTerritorial = (await récupèreLÉtablissementTerritorialMédicoSocialEndpoint(
        dependencies,
        numeroFiness,
        codeRegion,
        codeProfiles
      ));

      const rechercheResult = await rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies, numeroFiness, 1);

      saveSearchHistoryEndpoint(dependencies, etablissementTerritorial.identité.raisonSocialeCourte.value, session?.user.idUser!,
        etablissementTerritorial.identité.numéroFinessÉtablissementTerritorial.value, ETB_MEDICO_SOCIAL);

      return { props: { établissementTerritorial: etablissementTerritorial, rechercheResult: rechercheResult, autorisations: etablissementTerritorial.autorisations } };
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
