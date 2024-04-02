import { ÉtablissementTerritorialIdentité } from "../ÉtablissementTerritorialIdentité";
import { ÉtablissementTerritorialQualite } from "../ÉtablissementTerritorialQualite";
import { EntitéJuridiqueDeRattachement } from "./EntitéJuridiqueDeRattachement";
import { ÉtablissementTerritorialSanitaireActivité } from "./ÉtablissementTerritorialSanitaireActivité";
import { ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from "./ÉtablissementTerritorialSanitaireAutorisation";

export type ÉtablissementTerritorialSanitaire = Readonly<{
  activités: ÉtablissementTerritorialSanitaireActivité[];
  autorisationsEtCapacités: ÉtablissementTerritorialSanitaireAutorisationEtCapacité;
  qualite: ÉtablissementTerritorialQualite,
  identité: ÉtablissementTerritorialIdentité & EntitéJuridiqueDeRattachement;
}>;
