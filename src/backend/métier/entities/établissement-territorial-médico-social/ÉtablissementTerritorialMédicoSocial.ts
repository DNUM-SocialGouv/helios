import { EntiteJuridiqueDeRattachement } from "../entité-juridique/EntiteJuridiqueDeRattachement";
import { ÉtablissementTerritorialIdentité } from "../ÉtablissementTerritorialIdentité";
import { ÉtablissementTerritorialQualite } from "../ÉtablissementTerritorialQualite";
import { MonoÉtablissement } from "./MonoÉtablissement";
import { ÉtablissementTerritorialMédicoSocialActivité } from "./ÉtablissementTerritorialMédicoSocialActivité";
import { ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité } from "./ÉtablissementTerritorialMédicoSocialAutorisation";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "./ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from "./ÉtablissementTerritorialMédicoSocialRessourcesHumaines";

export type ÉtablissementTerritorialMédicoSocial = Readonly<{
  activités: ÉtablissementTerritorialMédicoSocialActivité[];
  autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité;
  budgetEtFinances: ÉtablissementTerritorialMédicoSocialBudgetEtFinances[];
  identité: ÉtablissementTerritorialIdentité & MonoÉtablissement & EntiteJuridiqueDeRattachement;
  ressourcesHumaines: ÉtablissementTerritorialMédicoSocialRessourcesHumaines[];
  qualite: ÉtablissementTerritorialQualite;
  autorisations: any;
}>;
