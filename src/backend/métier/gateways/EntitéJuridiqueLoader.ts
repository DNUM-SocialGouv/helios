import { ActivitesSanitaireMensuel } from "../entities/ActivitesSanitaireMensuel";
import { AllocationRessource } from "../entities/AllocationRessource";
import { EntitéJuridiqueIdentité } from "../entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueActivités } from "../entities/entité-juridique/EntitéJuridiqueActivités";
import { EntitéJuridiqueAutorisationEtCapacitéLoader } from "../entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueBudgetFinance } from "../entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueDeRattachement } from "../entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement";

export interface EntitéJuridiqueLoader {
  chargeIdentité(numéroFiness: string): Promise<EntitéJuridiqueIdentité | EntitéJuridiqueNonTrouvée>;
  chargeRattachement(numéroFiness: string): Promise<EntitéJuridiqueDeRattachement>;
  chargeRattachementCategorieEstPriveNonLucratif(numéroFiness: string): Promise<boolean>;

  chargeActivités(numéroFiness: string): Promise<EntitéJuridiqueActivités[]>;
  chargeActivitésMensuel(numéroFiness: string): Promise<ActivitesSanitaireMensuel>;

  chargeBudgetFinance(numéroFiness: string): Promise<EntitéJuridiqueBudgetFinance[]>;
  chargeAutorisationsEtCapacités(numéroFiness: string): Promise<EntitéJuridiqueAutorisationEtCapacitéLoader>;

  chargeAllocationRessource(numéroFiness: string): Promise<AllocationRessource>;
}
