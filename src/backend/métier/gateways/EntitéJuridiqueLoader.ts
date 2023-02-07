import { EntitéJuridiqueIdentité } from "../entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueActivités } from "../entities/entité-juridique/EntitéJuridiqueActivités";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueDeRattachement } from "../entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement";

export interface EntitéJuridiqueLoader {
  chargeIdentité(numéroFiness: string): Promise<EntitéJuridiqueIdentité | EntitéJuridiqueNonTrouvée>;
  chargeRattachement(numéroFiness: string): Promise<EntitéJuridiqueDeRattachement>;

  chargeActivités(numéroFiness: string): Promise<EntitéJuridiqueActivités[]>;
}
