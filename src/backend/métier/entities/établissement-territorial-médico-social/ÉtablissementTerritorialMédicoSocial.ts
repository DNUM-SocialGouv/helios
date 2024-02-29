import { ÉtablissementTerritorialIdentité } from "../ÉtablissementTerritorialIdentité";
import { ÉtablissementTerritorialQualite } from "../ÉtablissementTerritorialQualite";
import { EntitéJuridiqueDeRattachement } from "./EntitéJuridiqueDeRattachement";
import { MonoÉtablissement } from "./MonoÉtablissement";
import { ÉtablissementTerritorialMédicoSocialActivité } from "./ÉtablissementTerritorialMédicoSocialActivité";
import { ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité } from "./ÉtablissementTerritorialMédicoSocialAutorisation";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "./ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from "./ÉtablissementTerritorialMédicoSocialRessourcesHumaines";

export type ÉtablissementTerritorialMédicoSocial = Readonly<{
  activités: ÉtablissementTerritorialMédicoSocialActivité[];
  autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité;
  budgetEtFinances: ÉtablissementTerritorialMédicoSocialBudgetEtFinances[];
  identité: ÉtablissementTerritorialIdentité & MonoÉtablissement & EntitéJuridiqueDeRattachement;
  ressourcesHumaines: ÉtablissementTerritorialMédicoSocialRessourcesHumaines[];
  qualite: ÉtablissementTerritorialQualite;
}>;
