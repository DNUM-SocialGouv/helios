import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheEndpoints";
import { récupèreLEntitéJuridiqueEndpoint } from "../../backend/infrastructure/controllers/récupèreLEntitéJuridiqueEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { EntitéJuridique } from "../../backend/métier/entities/entité-juridique/EntitéJuridique";
import { ÉtablissementTerritorialRattaché } from "../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { EntitéJuridiqueNonTrouvée } from "../../backend/métier/entities/EntitéJuridiqueNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { ActivitésMensuelViewModel } from "../../frontend/ui/entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { EntitéJuridiqueViewModel } from "../../frontend/ui/entité-juridique/EntitéJuridiqueViewModel";
import { EtablissementsTerritoriauxRattachésViewModel } from "../../frontend/ui/entité-juridique/liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";
import { PageEntitéJuridique } from "../../frontend/ui/entité-juridique/PageEntitéJuridique";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { useSearchHistory } from "../../frontend/ui/search-history/useSearchHistory";
import { useEffect } from "react";
import { saveSearchHistoryEndpoint } from "../../backend/infrastructure/controllers/saveSearchHistoryEndpoint";

type RouterProps = Readonly<{
  entitéJuridique: EntitéJuridique;
  établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[];
  rechercheResult: any;
  autorisations: any;
}>;



export default function Router({ rechercheResult, entitéJuridique, établissementsTerritoriauxRattachés, autorisations }: RouterProps) {
  const { wording, paths } = useDependencies();
  const { saveSearchHistory } = useSearchHistory();

  if (!établissementsTerritoriauxRattachés || !entitéJuridique) return null;

  const entitéJuridiqueViewModel = new EntitéJuridiqueViewModel(entitéJuridique, wording, autorisations);
  const entitéJuridiqueActivitéMensuelleViewModel = new ActivitésMensuelViewModel(entitéJuridique.activitésMensuels, wording);
  const établissementsTerritoriauxRattachéesViewModel = new EtablissementsTerritoriauxRattachésViewModel(établissementsTerritoriauxRattachés, wording);
  const rechercheViewModel = new RechercheViewModel(rechercheResult.résultats[0], paths);

  return (
    <>
      {rechercheViewModel ? (
        <PageEntitéJuridique
          entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}
          entitéJuridiqueViewModel={entitéJuridiqueViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachéesViewModel}
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

    if (context.params && context.params["numeroFiness"]) {
      const numeroFiness = context.params["numeroFiness"] as string;
      const entitéJuridiqueEndpoint = (await récupèreLEntitéJuridiqueEndpoint(dependencies, numeroFiness, codeRegion, codeProfiles)) as RouterProps;
      const rechercheResult = await rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies, numeroFiness, 1);

      saveSearchHistoryEndpoint(dependencies,rechercheResult.résultats[0]?.raisonSocialeCourte,session?.user.idUser!,rechercheResult.résultats[0]?.numéroFiness,rechercheResult.résultats[0]?.type);

      return {
        props: {
          entitéJuridique: entitéJuridiqueEndpoint.entitéJuridique,
          établissementsTerritoriauxRattachés: entitéJuridiqueEndpoint.établissementsTerritoriauxRattachés,
          rechercheResult: rechercheResult,
          autorisations: entitéJuridiqueEndpoint.autorisations
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    if (error instanceof EntitéJuridiqueNonTrouvée) {
      dependencies.logger.error(error.message);
      return {
        notFound: true,
      };
    }
    throw error;
  }

}
