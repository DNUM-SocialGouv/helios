import { ProfilModel } from "../../../../database/models/ProfilModel";
import { ParametresDeComparaison } from "../../métier/entities/ParametresDeComparaison";
import { ResultatDeComparaison } from "../../métier/entities/ResultatDeComparaison";
import { ComparaisonEtablissementsUseCase } from "../../métier/use-cases/ComparaisonEtablissementsUseCase";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { Dependencies } from "../dependencies";

export async function comparaisonEndpoint(
  dependencies: Dependencies,
  params: ParametresDeComparaison,
  codeProfiles: string[]
): Promise<ResultatDeComparaison> {
  try {
    const comparaisonEtablissementsUseCase = new ComparaisonEtablissementsUseCase(dependencies.comparaisonLoader);
    const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);
    const profiles = await loginUseCase.getUserProfiles(codeProfiles) as ProfilModel[];
    return await comparaisonEtablissementsUseCase.exécute(params, profiles);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
