import { AllocationRessource } from "../AllocationRessource";
import { EntitéJuridiqueBudgetFinance } from "../entité-juridique/EntitéJuridiqueBudgetFinance";
import { ÉtablissementTerritorialIdentité } from "../ÉtablissementTerritorialIdentité";
import { ÉtablissementTerritorialQualite } from "../ÉtablissementTerritorialQualite";
import { EntitéJuridiqueDeRattachement } from "./EntitéJuridiqueDeRattachement";
import { EtablissementTerritorialSanitaireActiviteMensuel } from "./EtablissementTerritorialSanitaireActiviteMensuel";
import { ÉtablissementTerritorialSanitaireActivité } from "./ÉtablissementTerritorialSanitaireActivité";
import { ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from "./ÉtablissementTerritorialSanitaireAutorisation";

export type ÉtablissementTerritorialSanitaire = Readonly<{
  activités: ÉtablissementTerritorialSanitaireActivité[];
  activitésMensuels: EtablissementTerritorialSanitaireActiviteMensuel;
  autorisationsEtCapacités: ÉtablissementTerritorialSanitaireAutorisationEtCapacité;
  qualite: ÉtablissementTerritorialQualite,
  identité: ÉtablissementTerritorialIdentité & EntitéJuridiqueDeRattachement;
  budgetFinance: EntitéJuridiqueBudgetFinance[];
  allocationRessource: AllocationRessource;
  appartientAEtablissementsSantePrivesIntérêtsCollectif: boolean;
}>;
