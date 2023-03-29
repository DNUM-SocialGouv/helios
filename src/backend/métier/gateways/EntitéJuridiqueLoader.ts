import { EntitéJuridiqueIdentité } from "../entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueActivités } from "../entities/entité-juridique/EntitéJuridiqueActivités";
import { EntitéJuridiqueAutorisationEtCapacité } from "../entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueBudgetFinance } from "../entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueDeRattachement } from "../entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement";

export interface EntitéJuridiqueLoader {
  chargeIdentité(numéroFiness: string): Promise<EntitéJuridiqueIdentité | EntitéJuridiqueNonTrouvée>;
  chargeRattachement(numéroFiness: string): Promise<EntitéJuridiqueDeRattachement>;

  chargeActivités(numéroFiness: string): Promise<EntitéJuridiqueActivités[]>;

  chargeBudgetFinance(numéroFiness: string): Promise<EntitéJuridiqueBudgetFinance[]>;
  chargeAutorisationsEtCapacités(numéroFiness: string): Promise<EntitéJuridiqueAutorisationEtCapacité>;
}
