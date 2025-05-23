import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheEndpoints";
import { récupèreLEntitéJuridiqueEndpoint } from "../../backend/infrastructure/controllers/récupèreLEntitéJuridiqueEndpoint";
import { saveSearchHistoryEndpoint } from "../../backend/infrastructure/controllers/saveSearchHistoryEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { EntitéJuridique } from "../../backend/métier/entities/entité-juridique/EntitéJuridique";
import { ÉtablissementTerritorialRattaché } from "../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { EntitéJuridiqueNonTrouvée } from "../../backend/métier/entities/EntitéJuridiqueNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { ActivitésMensuelViewModel } from "../../frontend/ui/entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { EntiteJuridiqueViewModel } from "../../frontend/ui/entité-juridique/EntitéJuridiqueViewModel";
import { EtablissementsTerritoriauxRattachésViewModel } from "../../frontend/ui/entité-juridique/liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";
import { PageEntitéJuridique } from "../../frontend/ui/entité-juridique/PageEntitéJuridique";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { ETB_ENTITE_JURIDIQUE } from "../../frontend/utils/constantes";

type RouterProps = Readonly<{
  entitéJuridique: EntitéJuridique;
  établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[];
  rechercheResult: any;
  autorisations: any;
}>;



export default function Router({ rechercheResult, entitéJuridique, établissementsTerritoriauxRattachés, autorisations }: RouterProps) {
  const { wording, paths } = useDependencies();

  if (!établissementsTerritoriauxRattachés || !entitéJuridique) return null;

  const entitéJuridiqueViewModel = new EntiteJuridiqueViewModel(entitéJuridique, wording, autorisations);
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
      saveSearchHistoryEndpoint(dependencies, entitéJuridiqueEndpoint.entitéJuridique?.raisonSocialeCourte.value, session?.user.idUser!,
        entitéJuridiqueEndpoint.entitéJuridique.numéroFinessEntitéJuridique.value, ETB_ENTITE_JURIDIQUE);

      saveSearchHistoryEndpoint(dependencies,entitéJuridiqueEndpoint.entitéJuridique?.raisonSocialeCourte.value,session?.user.idUser!,
        entitéJuridiqueEndpoint.entitéJuridique.numéroFinessEntitéJuridique.value,ETB_ENTITE_JURIDIQUE);

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
