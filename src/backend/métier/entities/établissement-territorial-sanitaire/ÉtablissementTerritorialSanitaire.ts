import { ActivitesSanitaireMensuel } from "../ActivitesSanitaireMensuel";
import { AllocationRessource } from "../AllocationRessource";
import { EntitéJuridiqueBudgetFinance } from "../entité-juridique/EntitéJuridiqueBudgetFinance";
import { ÉtablissementTerritorialIdentité } from "../ÉtablissementTerritorialIdentité";
import { ÉtablissementTerritorialQualite } from "../ÉtablissementTerritorialQualite";
import { EntitéJuridiqueDeRattachement } from "./EntitéJuridiqueDeRattachement";
import { ÉtablissementTerritorialSanitaireActivité } from "./ÉtablissementTerritorialSanitaireActivité";
import { ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from "./ÉtablissementTerritorialSanitaireAutorisation";

export type ÉtablissementTerritorialSanitaire = Readonly<{
  activités: ÉtablissementTerritorialSanitaireActivité[];
  activitésMensuels: ActivitesSanitaireMensuel;
  autorisationsEtCapacités: ÉtablissementTerritorialSanitaireAutorisationEtCapacité;
  qualite: ÉtablissementTerritorialQualite,
  identité: ÉtablissementTerritorialIdentité & EntitéJuridiqueDeRattachement;
  budgetFinance: EntitéJuridiqueBudgetFinance[];
  allocationRessource: AllocationRessource;
  appartientAEtablissementsSantePrivesIntérêtsCollectif: boolean;
  autorisations: any;
}>;
