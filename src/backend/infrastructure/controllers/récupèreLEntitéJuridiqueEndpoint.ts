import { EntitéJuridique } from "../../métier/entities/entité-juridique/EntitéJuridique";
import { ÉtablissementTerritorialRattaché } from "../../métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { RécupèreLEntitéJuridiqueUseCase } from "../../métier/use-cases/RécupèreLEntitéJuridiqueUseCase";
import { RécupèreLesÉtablissementsTerritoriauxRattachésUseCase } from "../../métier/use-cases/RécupèreLesÉtablissementsTerritoriauxRattachésÀLEntitéJuridiqueUseCase";
import { filterEntiteJuridique } from "../../profileFiltersHelper";
import { Dependencies } from "../dependencies";

type EntitéJuridiqueEndpoint = Readonly<{
  entitéJuridique: EntitéJuridique;
  établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[];
}>;

export async function récupèreLEntitéJuridiqueEndpoint(dependencies: Dependencies, numéroFiness: string): Promise<EntitéJuridiqueEndpoint> {
  const profilEJ = {
    'identité': {
      'habilité': 'ok',
      'nom': 'ok',
      'numéroFiness': 'ok',
      'siret': 'ok',
      'adresse': 'ok',
      'télEtEmail': 'ok',
      'statut_EJ': 'ok',
    },
    'autorisationsEtCapacités': {
      'habilité': 'ok',
      'capacités': 'ok',
      'autorisationsActivités': 'ok',
      'autresActivités': 'ok',
      'reconnaissanceContractuelleActivités': 'ok',
      'equipementMaterielLourdsActivités': 'ok',
    },
    'activités': {
      'habilité': 'ok',
      'nombreSéjours': 'ok',
      'nombreJournées': 'ok',
      'nombrePassage': 'ok',
      'nombreSéjoursHad': 'ok',
    },
    'budgetEtFinance': {
      'habilité': 'ok',
      'compteRésultats': 'no',
      'résultatNetComptable': 'ok',
      'tauxDeCafNette': 'no',
      'ratioDépendanceFinancière': 'ok',
    },
  }

  const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(dependencies.entitéJuridiqueLoader);
  const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFiness);

  const filtredEntitéJuridique = filterEntiteJuridique(entitéJuridique, profilEJ);

  const récupèreLesÉtablissementsTerritoriauxRattachésUseCase = new RécupèreLesÉtablissementsTerritoriauxRattachésUseCase(
    dependencies.établissementTerritorialRattachéLoader
  );
  const établissementsTerritoriauxRattachés = await récupèreLesÉtablissementsTerritoriauxRattachésUseCase.exécute(numéroFiness);

  return {
    entitéJuridique: filtredEntitéJuridique,
    établissementsTerritoriauxRattachés,
  };
}
