import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheEndpoints";
import { récupèreLÉtablissementTerritorialSanitaireEndpoint } from "../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialSanitaireEndpoint";
import { saveSearchHistoryEndpoint } from "../../backend/infrastructure/controllers/saveSearchHistoryEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { ÉtablissementTerritorialSanitaire } from "../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireNonTrouvée } from "../../backend/métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { ActivitesMensuelViewModel } from "../../frontend/ui/entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { PageÉtablissementTerritorialSanitaire } from "../../frontend/ui/établissement-territorial-sanitaire/PageÉtablissementTerritorialSanitaire";
import { EtablissementTerritorialSanitaireViewModel } from "../../frontend/ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel";
import { ETB_SANITAIRE } from "../../frontend/utils/constantes";

type RouterProps = Readonly<{
  établissementTerritorial: ÉtablissementTerritorialSanitaire;
  rechercheResult: any;
  autorisations: any;
}>;

export default function Router({ rechercheResult, établissementTerritorial, autorisations }: RouterProps) {
  const { paths, wording } = useDependencies();

  if (!établissementTerritorial) return null;

  const établissementTerritorialSanitaireViewModel = new EtablissementTerritorialSanitaireViewModel(établissementTerritorial, wording, paths, autorisations);
  const activitéMensuelleViewModel = new ActivitesMensuelViewModel(établissementTerritorial.activitésMensuels, wording);

  const rechercheViewModel = new RechercheViewModel(rechercheResult.résultats[0], paths);

  return (
    <>
      {rechercheViewModel ? (
        <PageÉtablissementTerritorialSanitaire
          activitéMensuelleViewModel={activitéMensuelleViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
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
      const etablissementTerritorial = (await récupèreLÉtablissementTerritorialSanitaireEndpoint(
        dependencies,
        numeroFiness,
        codeRegion,
        codeProfiles
      ));

      const rechercheResult = await rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies, numeroFiness, 1);

      saveSearchHistoryEndpoint(dependencies, etablissementTerritorial.identité.raisonSocialeCourte.value, session?.user.idUser!,
        etablissementTerritorial.identité.numéroFinessÉtablissementTerritorial.value, ETB_SANITAIRE);

      return {
        props: {
          établissementTerritorial: JSON.parse(JSON.stringify(etablissementTerritorial)),
          rechercheResult: rechercheResult,
          autorisations: etablissementTerritorial.autorisations
        },
      };
    } else {
      return { notFound: true };
    }
  } catch (error) {
    if (error instanceof ÉtablissementTerritorialSanitaireNonTrouvée) {
      dependencies.logger.error(error.message);
      return { notFound: true };
    }
    throw error;
  }
}
