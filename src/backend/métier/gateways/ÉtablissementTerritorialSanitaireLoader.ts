import { AllocationRessource } from "../entities/AllocationRessource";
import { EntitéJuridiqueBudgetFinance } from "../entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { EtablissementTerritorialSanitaireActiviteMensuel } from "../entities/établissement-territorial-sanitaire/EtablissementTerritorialSanitaireActiviteMensuel";
import { ÉtablissementTerritorialSanitaireActivité } from "../entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import { ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from "../entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { ÉtablissementTerritorialIdentité } from "../entities/ÉtablissementTerritorialIdentité";
import { ÉtablissementTerritorialQualite } from "../entities/ÉtablissementTerritorialQualite";
import { ÉtablissementTerritorialSanitaireNonTrouvée } from "../entities/ÉtablissementTerritorialSanitaireNonTrouvée";

export interface ÉtablissementTerritorialSanitaireLoader {
  chargeBudgetFinance(numéroFinessÉtablissementTerritorialSanitaire: string): Promise<EntitéJuridiqueBudgetFinance[]>;
  chargeActivité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireActivité[]>;
  chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>;
  chargeIdentité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialSanitaireNonTrouvée>;
  chargeQualite(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialQualite>;
  chargeAllocationRessource(numéroFinessÉtablissementTerritorial: string): Promise<AllocationRessource>;
  chargeActivitéMensuel(numéroFinessÉtablissementTerritorial: string): Promise<EtablissementTerritorialSanitaireActiviteMensuel>;
}
