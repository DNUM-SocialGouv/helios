import { ActivitesSanitaireMensuel } from "../ActivitesSanitaireMensuel";
import { AllocationRessource } from "../AllocationRessource";
import { EntiteJuridiqueDeRattachement } from "../entité-juridique/EntiteJuridiqueDeRattachement";
import { EntitéJuridiqueBudgetFinance } from "../entité-juridique/EntitéJuridiqueBudgetFinance";
import { ÉtablissementTerritorialIdentité } from "../ÉtablissementTerritorialIdentité";
import { ÉtablissementTerritorialQualite } from "../ÉtablissementTerritorialQualite";
import { EtablissementTerritorialSanitaireRH } from "./EtablissementTerritorialSanitaireRH";
import { ÉtablissementTerritorialSanitaireActivité } from "./ÉtablissementTerritorialSanitaireActivité";
import { ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from "./ÉtablissementTerritorialSanitaireAutorisation";

export type ÉtablissementTerritorialSanitaire = Readonly<{
  activités: ÉtablissementTerritorialSanitaireActivité[];
  activitésMensuels: ActivitesSanitaireMensuel;
  autorisationsEtCapacités: ÉtablissementTerritorialSanitaireAutorisationEtCapacité;
  qualite: ÉtablissementTerritorialQualite,
  identité: ÉtablissementTerritorialIdentité & EntiteJuridiqueDeRattachement;
  budgetFinance: EntitéJuridiqueBudgetFinance[];
  allocationRessource: AllocationRessource;
  appartientAEtablissementsSantePrivesIntérêtsCollectif: boolean;
  autorisations: any;
  ressourcesHumaines: EtablissementTerritorialSanitaireRH[];
}>;
