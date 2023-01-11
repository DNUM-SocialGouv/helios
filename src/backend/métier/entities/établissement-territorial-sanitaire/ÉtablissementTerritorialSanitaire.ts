import { ÉtablissementTerritorialIdentité } from "../ÉtablissementTerritorialIdentité";
import { EntitéJuridiqueDeRattachement } from "./EntitéJuridiqueDeRattachement";
import { ÉtablissementTerritorialSanitaireActivité } from "./ÉtablissementTerritorialSanitaireActivité";
import { ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from "./ÉtablissementTerritorialSanitaireAutorisation";

export type ÉtablissementTerritorialSanitaire = Readonly<{
  activités: ÉtablissementTerritorialSanitaireActivité[];
  autorisationsEtCapacités: ÉtablissementTerritorialSanitaireAutorisationEtCapacité;
  identité: ÉtablissementTerritorialIdentité & EntitéJuridiqueDeRattachement;
}>;
