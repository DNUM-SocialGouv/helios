import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheEndpoints";
import { récupèreLÉtablissementTerritorialSanitaireEndpoint } from "../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialSanitaireEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { ÉtablissementTerritorialSanitaire } from "../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireNonTrouvée } from "../../backend/métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { PageÉtablissementTerritorialSanitaire } from "../../frontend/ui/établissement-territorial-sanitaire/PageÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireViewModel } from "../../frontend/ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel";

type RouterProps = Readonly<{
  établissementTerritorial: ÉtablissementTerritorialSanitaire;
  rechercheResult: any;
}>;

export default function Router({ rechercheResult, établissementTerritorial }: RouterProps) {
  const { paths, wording } = useDependencies();

  if (!établissementTerritorial) return null;

  const établissementTerritorialSanitaireViewModel = new ÉtablissementTerritorialSanitaireViewModel(établissementTerritorial, wording, paths);
  const rechercheViewModel = new RechercheViewModel(rechercheResult.résultats[0], paths);

  return (
    <>
      {rechercheViewModel ? (
        <PageÉtablissementTerritorialSanitaire
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
    const codeRegion = session?.user.codeRegion as string;
    const codeProfiles = session?.user.codeProfiles as string[];

    if (context.params && context.params["numeroFiness"]) {
      const numeroFiness = context.params["numeroFiness"] as string;
      const établissementTerritorial = (await récupèreLÉtablissementTerritorialSanitaireEndpoint(
        dependencies,
        numeroFiness,
        codeRegion,
        codeProfiles
      )) as ÉtablissementTerritorialSanitaire;
      const rechercheResult = await rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies, numeroFiness, 1);
      return { props: { établissementTerritorial, rechercheResult: rechercheResult } };
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
