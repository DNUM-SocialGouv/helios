import { ÉtablissementTerritorialSanitaireActivité } from "../entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import { ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from "../entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { ÉtablissementTerritorialIdentité } from "../entities/ÉtablissementTerritorialIdentité";
import { ÉtablissementTerritorialQualite } from "../entities/ÉtablissementTerritorialQualite";
import { ÉtablissementTerritorialSanitaireNonTrouvée } from "../entities/ÉtablissementTerritorialSanitaireNonTrouvée";

export interface ÉtablissementTerritorialSanitaireLoader {
  chargeActivité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireActivité[]>;
  chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>;
  chargeIdentité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialSanitaireNonTrouvée>;
  chargeQualite(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialQualite>;
}
