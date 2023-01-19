import { GetStaticPathsResult, GetStaticPropsResult } from "next";

import { récupèreLEntitéJuridiqueEndpoint } from "../../backend/infrastructure/controllers/récupèreLEntitéJuridiqueEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { DomaineÉtablissementTerritorial } from "../../backend/métier/entities/DomaineÉtablissementTerritorial";
import { EntitéJuridique } from "../../backend/métier/entities/entité-juridique/EntitéJuridique";
import { ÉtablissementTerritorialRattaché } from "../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { EntitéJuridiqueNonTrouvée } from "../../backend/métier/entities/EntitéJuridiqueNonTrouvée";
import { Wording } from "../../frontend/configuration/wording/Wording";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import { EntitéJuridiqueViewModel } from "../../frontend/ui/entité-juridique/EntitéJuridiqueViewModel";
import { ÉtablissementTerritorialRattachéViewModel } from "../../frontend/ui/entité-juridique/liste-des-établissements/ÉtablissementTerritorialRattachéViewModel";
import { PageEntitéJuridique } from "../../frontend/ui/entité-juridique/PageEntitéJuridique";

type RouterProps = Readonly<{
  entitéJuridique: EntitéJuridique;
  établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[];
}>;

export class EtablissementsTerritoriauxRattachésViewModel {
  private établissementTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[];
  constructor(établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[], wording: Wording) {
    this.établissementTerritoriauxRattachésViewModels = établissementsTerritoriauxRattachés.map(
      (établissement) => new ÉtablissementTerritorialRattachéViewModel(établissement, wording)
    );
  }

  public get nombreEtablissements(): number {
    return this.établissementTerritoriauxRattachésViewModels.length;
  }

  public get établissementSanitaires(): ÉtablissementTerritorialRattachéViewModel[] {
    return this.établissementTerritoriauxRattachésViewModels.filter((établissement) => établissement.domaine === DomaineÉtablissementTerritorial.SANITAIRE);
  }

  public get établissementMedicauxSociaux(): ÉtablissementTerritorialRattachéViewModel[] {
    return this.établissementTerritoriauxRattachésViewModels.filter((établissement) => établissement.domaine === DomaineÉtablissementTerritorial.MÉDICO_SOCIAL);
  }
}

export default function Router({ entitéJuridique, établissementsTerritoriauxRattachés }: RouterProps) {
  const { wording } = useDependencies();

  if (!établissementsTerritoriauxRattachés || !entitéJuridique) return null;

  const entitéJuridiqueViewModel = new EntitéJuridiqueViewModel(entitéJuridique, wording);
  const etVM = new EtablissementsTerritoriauxRattachésViewModel(établissementsTerritoriauxRattachés, wording);
  return <PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} établissementsTerritoriauxRattachésViewModels={etVM} />;
}

export function getStaticPaths(): GetStaticPathsResult {
  return {
    fallback: "blocking",
    paths: [],
  };
}

export async function getStaticProps({ params }: { params: { numeroFiness: string } }): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const { environmentVariables } = dependencies;
    const entitéJuridiqueEndpoint = (await récupèreLEntitéJuridiqueEndpoint(dependencies, params.numeroFiness)) as RouterProps;

    return {
      props: {
        entitéJuridique: entitéJuridiqueEndpoint.entitéJuridique,
        établissementsTerritoriauxRattachés: entitéJuridiqueEndpoint.établissementsTerritoriauxRattachés,
      },
      revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE),
    };
  } catch (error) {
    if (error instanceof EntitéJuridiqueNonTrouvée) {
      dependencies.logger.error(error.message);
      return {
        notFound: true,
        revalidate: 1,
      };
    }
    throw error;
  }
}
