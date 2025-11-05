import { ActivitesSanitaireMensuel } from "../entities/ActivitesSanitaireMensuel";
import { AllocationRessource } from "../entities/AllocationRessource";
import { EntiteJuridiqueDeRattachement } from "../entities/entité-juridique/EntiteJuridiqueDeRattachement";
import { EntiteJuridiqueRessourcesHumaines } from "../entities/entité-juridique/EntiteJuridiqueRessourcesHumaines";
import { EntitéJuridiqueIdentité } from "../entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueActivités } from "../entities/entité-juridique/EntitéJuridiqueActivités";
import { EntitéJuridiqueAutorisationEtCapacitéLoader } from "../entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueBudgetFinance } from "../entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";

export interface EntitéJuridiqueLoader {
  chargeIdentité(numeroFiness: string): Promise<EntitéJuridiqueIdentité | EntitéJuridiqueNonTrouvée>;
  chargeRattachement(numeroFiness: string): Promise<EntiteJuridiqueDeRattachement>;
  chargeRattachementCategorieEstPriveNonLucratif(numeroFiness: string): Promise<boolean>;

  chargeActivités(numeroFiness: string): Promise<EntitéJuridiqueActivités[]>;
  chargeActivitésMensuel(numeroFiness: string): Promise<ActivitesSanitaireMensuel>;

  chargeBudgetFinance(numeroFiness: string): Promise<EntitéJuridiqueBudgetFinance[]>;
  chargeAutorisationsEtCapacités(numeroFiness: string): Promise<EntitéJuridiqueAutorisationEtCapacitéLoader>;

  chargeAllocationRessource(numeroFiness: string): Promise<AllocationRessource>;

  chargeRessourcesHumaines(numeroFiness: string): Promise<EntiteJuridiqueRessourcesHumaines[]>
}
