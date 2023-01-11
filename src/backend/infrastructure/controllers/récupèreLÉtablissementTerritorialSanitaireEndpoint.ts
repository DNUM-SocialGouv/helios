import { ÉtablissementTerritorialSanitaire } from "../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { RécupèreLÉtablissementTerritorialSanitaireUseCase } from "../../métier/use-cases/RécupèreLÉtablissementTerritorialSanitaireUseCase";
import { Dependencies } from "../dependencies";

export async function récupèreLÉtablissementTerritorialSanitaireEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialSanitaire: string
): Promise<ÉtablissementTerritorialSanitaire> {
  const récupèreLÉtablissementTerritorialSanitaireUseCase = new RécupèreLÉtablissementTerritorialSanitaireUseCase(
    dependencies.établissementTerritorialSanitaireLoader,
    dependencies.entitéJuridiqueLoader
  );

  return await récupèreLÉtablissementTerritorialSanitaireUseCase.exécute(numéroFinessÉtablissementTerritorialSanitaire);
}
