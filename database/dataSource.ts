import { DataSource, LoggerOptions } from "typeorm";

import { dotEnvConfig } from "../download_data_source/infrastructure/gateways/dot-env/dotEnvConfig";
import { NodeEnvironmentVariables } from "../download_data_source/infrastructure/gateways/environnement-variables/NodeEnvironmentVariables";
import { ConsoleLogger } from "../download_data_source/infrastructure/gateways/logger/ConsoleLogger";
import { EntitéJuridique1652626977208 } from "./migrations/1652626977208-EntitéJuridique";
import { ÉtablissementTerritorial1652627040870 } from "./migrations/1652627040870-ÉtablissementTerritorial";
import { DateMiseÀJourSource1652627053530 } from "./migrations/1652627053530-DateMiseÀJourSource";
import { AjoutDomaineÉtablissement1654002237462 } from "./migrations/1654002237462-AjoutDomaineÉtablissement";
import { AjoutActivitéMédicoSocial1656002701263 } from "./migrations/1656002701263-AjoutActivitéMédicoSocial";
import { AjoutActivitéSanitaire1657269955824 } from "./migrations/1657269955824-AjoutActivitéSanitaire";
import { AjoutNombrePassageUrgencesActivitéSanitaire1657616813991 } from "./migrations/1657616813991-AjoutPassageUrgencesActivitéSanitaire";
import { AjoutVueRecherche1658238839801 } from "./migrations/1658238839801-AjoutVueRecherche";
import { AjoutDépartementEtCommune1658418352668 } from "./migrations/1658418352668-AjoutDépartementEtCommune";
import { AjoutDatesMisesÀJourParFichier1658996326544 } from "./migrations/1658996326544-AjoutDatesMisesÀJourParFichier";
import { SupprimeTableDateMiseÀJourSource1659718559574 } from "./migrations/1659718559574-SupprimeTableDateMiseÀJourSource";
import { AjoutAutorisationsDesETMédicoSociaux1660654708747 } from "./migrations/1660654708747-AjoutAutorisationsDesETMédicoSociaux";
import { AjoutAutorisationsDesETSanitaires1661442115103 } from "./migrations/1661442115103-AjoutAutorisationsDesETSanitaires";
import { RenommeColonneÉquipementMatérielLourds1661875206711 } from "./migrations/1661875206711-RenommeColonneÉquipementMatérielLourds";
import { AjoutDesCapactiésDesAutorisationsSanitaires1662113899729 } from "./migrations/1662113899729-AjoutDesCapactiésDesAutorisationsSanitaires";
import { AjoutDesCapacitésPsy1662368876558 } from "./migrations/1662368876558-AjoutDesCapacitésPsy";
import { AjoutDesCommunesEtDépartementsDansLaRecherche1662644327376 } from "./migrations/1662644327376-AjoutDesCommunesEtDépartementsDansLaRecherche";
import { PaginationDeLaRecherche1662736499297 } from "./migrations/1662736499297-PaginationDeLaRecherche";
import { IndexationRaisonSocialeCourte1662997448422 } from "./migrations/1662997448422-IndexationRaisonSocialeCourte";
import { AjoutDuCpom1663057503529 } from "./migrations/1663057503529-AjoutDuCpom";
import { AjoutBudgetEtFinancesMédicoSocial1663593231271 } from "./migrations/1663593231271-AjoutBudgetEtFinancesMédicoSocial";
import { AjoutDesTauxPourLeBlocBudgetEtFinancesMédicoSocial1663852267673 } from "./migrations/1663852267673-AjoutDesTauxPourLeBlocBudgetEtFinancesMédicoSocial";
import { AjoutFichierSourceAnnErrdEj1664462123042 } from "./migrations/1664462123042-AjoutFichierSourceAnnErrdEj";
import { AjoutTableRessourcesHumainesMédicoSocial1666166794478 } from "./migrations/1666166794478-AjoutTableRessourcesHumainesMédicoSocial";
import { AjoutSiren1666796630419 } from "./migrations/1666796630419-AjoutSiren";
import { AjoutSiretEtMft1666798570971 } from "./migrations/1666798570971-AjoutSiretEtMft";
import { AjoutRaisonSocialeCourteAuxRésultatsDeRecherche1666969626322 } from "./migrations/1666969626322-AjoutRaisonSocialeCourteAuxRésultatsDeRecherche";
import { AjoutAnneeAutorisationSanitaire1673015716622 } from "./migrations/1673015716622-AjoutAnneeAutorisationSanitaire";
import { AjoutCategorisationEntiteJuridique1675329220245 } from "./migrations/1675329220245-AjoutCategorisationEntiteJuridique";
import { AjoutActiviteSanitaireEntiteJuridique1675695881364 } from "./migrations/1675695881364-AjoutActiviteSanitaireEntiteJuridique";
import { RenommerColonnePassageUrgenceActivitesEntiteJuridique1675867340170 } from "./migrations/1675867340170-RenommerColonnePassageUrgenceActivitesEntiteJuridique";
import { AjouterBlocBudgetFinanceEJ1677495763184 } from "./migrations/1677495763184-AjouterBlocBugetFinanceEJ";
import { AjouteHAD1680014929754 } from "./migrations/1680014929754-AjouteHAD";
import { AjoutCapacitesSanitaireEJ1680076022425 } from "./migrations/1680076022425-AjoutCapacitesSanitaireEJ";
import { AjoutTableUtilisateurRoleEtablissement1686646154737 } from "./migrations/1686646154737-AjoutTableUtilisateurRoleEtablissement";
import { ModificationTableInstitution1688376404752 } from "./migrations/1688376404752-ModificationTableInstitution";
import { AjoutTableFavori1691393817990 } from "./migrations/1691393817990-AjoutTableFavori";
import { AjoutTableSearchHistory1691400360927 } from "./migrations/1691400360927-AjoutTableSearchHistory";
import { AjoutRefDepartementRegion1694523233904 } from "./migrations/1694523233904-AjoutRefDepartementRegion";
import { AjoutRégionDansEntitéJuridique1694616724703 } from "./migrations/1694616724703-AjoutRégionDansEntitéJuridique";
import { AjoutRégionDansEtablissementTerritorial1694617579347 } from "./migrations/1694617579347-AjoutRégionDansEtablissementTerritorial";
import { AjoutProfilsDansUtilisateurs1696841163367 } from "./migrations/1696841163367-AjoutProfilsDansUtilisateurs";
import { AjouterSoftDeleteUtilisateur1701782042926 } from "./migrations/1701782042926-AjouterSoftDeleteUtilisateur";
import { UpdateInstitutionsTable1704363653168 } from "./migrations/1704363653168-update-institutions-table";
import { UpdateUsersLastConnexionDate1704366840880 } from "./migrations/1704366840880-UpdateUsersLastConnexionDate";
import { RemoveDuplicatedEmailAndMakeItUnique1704467337579 } from "./migrations/1704467337579-RemoveDuplicatedEmailAndMakeItUnique";
import { ModificationDesValeursDuChampRole1706794831872 } from "./migrations/1706794831872-ModificationDesValeursDuChampRole";
import { AjoutReclamationET1708440883632 } from "./migrations/1708440883632-AjoutReclamationEtablissementTerritorial";
import { AjoutFichierSourceSirec1708679781472 } from "./migrations/1708679781472-AjoutFichierSourceSirec";
import { AjoutEvenementsIndesirables1710326854362 } from "./migrations/1710326854362-AjoutEvenementsIndesirables";
import { AjoutDateOuverture1713452627276 } from "./migrations/1713452627276-AjoutDateOuverture";
import { ajoutTableProfil1795731844298 } from "./migrations/1795731844278-ajoutTableProfil";
import { updateProfileTable1796422585498 } from "./migrations/1796422585498-updateProfileTable";
import { AddCreatedByToProfileTable1796792910177 } from "./migrations/1796792910177-AddCreatedByToProfileTable";
import { ActivitéMédicoSocialModel } from "./models/ActivitéMédicoSocialModel";
import { ActivitéSanitaireEntitéJuridiqueModel } from "./models/ActivitéSanitaireEntitéJuridiqueModel";
import { ActivitéSanitaireModel } from "./models/ActivitéSanitaireModel";
import { AutorisationMédicoSocialModel } from "./models/AutorisationMédicoSocialModel";
import { AutorisationSanitaireModel } from "./models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "./models/AutreActivitéSanitaireModel";
import { BudgetEtFinancesEntiteJuridiqueModel } from "./models/BudgetEtFinancesEntiteJuridiqueModel";
import { BudgetEtFinancesMédicoSocialModel } from "./models/BudgetEtFinancesMédicoSocialModel";
import { CapacitesSanitaireEntiteJuridiqueModel } from "./models/CapacitesSanitaireEntiteJuridiqueModel";
import { CapacitéAutorisationSanitaireModel } from "./models/CapacitéAutorisationSanitaireModel";
import { CpomModel } from "./models/CpomModel";
import { DateMiseÀJourFichierSourceModel } from "./models/DateMiseÀJourFichierSourceModel";
import { EntitéJuridiqueModel } from "./models/EntitéJuridiqueModel";
import { EvenementIndesirableETModel } from "./models/EvenementIndesirableModel";
import { FavorisModel } from "./models/FavorisModel";
import { InstitutionModel } from "./models/InstitutionModel";
import { ProfilModel } from "./models/ProfilModel";
import { RechercheModel } from "./models/RechercheModel";
import { ReclamationETModel } from "./models/ReclamationETModel";
import { ReconnaissanceContractuelleSanitaireModel } from "./models/ReconnaissanceContractuelleSanitaireModel";
import { RefDepartementRegionModel } from "./models/RefDepartementRegionModel";
import { RessourcesHumainesMédicoSocialModel } from "./models/RessourcesHumainesMédicoSocialModel";
import { RoleModel } from "./models/RoleModel";
import { SearchHistoryModel } from "./models/SearchHistoryModel";
import { UtilisateurModel } from "./models/UtilisateurModel";
import { ÉquipementMatérielLourdSanitaireModel } from "./models/ÉquipementMatérielLourdSanitaireModel";
import { ÉtablissementTerritorialIdentitéModel } from "./models/ÉtablissementTerritorialIdentitéModel";

const logger = new ConsoleLogger();
dotEnvConfig();
const environmentVariables = new NodeEnvironmentVariables(logger);

export default new DataSource({
  entities: [
    ActivitéMédicoSocialModel,
    ActivitéSanitaireModel,
    AutorisationMédicoSocialModel,
    AutorisationSanitaireModel,
    AutreActivitéSanitaireModel,
    BudgetEtFinancesMédicoSocialModel,
    BudgetEtFinancesEntiteJuridiqueModel,
    CapacitéAutorisationSanitaireModel,
    CapacitesSanitaireEntiteJuridiqueModel,
    CpomModel,
    DateMiseÀJourFichierSourceModel,
    EntitéJuridiqueModel,
    FavorisModel,
    ÉquipementMatérielLourdSanitaireModel,
    ÉtablissementTerritorialIdentitéModel,
    RechercheModel,
    ReconnaissanceContractuelleSanitaireModel,
    RessourcesHumainesMédicoSocialModel,
    ActivitéSanitaireEntitéJuridiqueModel,
    UtilisateurModel,
    RoleModel,
    InstitutionModel,
    SearchHistoryModel,
    RefDepartementRegionModel,
    ProfilModel,
    ReclamationETModel,
    EvenementIndesirableETModel,
  ],
  logger: "debug",
  logging: [environmentVariables.ORM_DEBUG] as LoggerOptions,
  migrations: [
    EntitéJuridique1652626977208,
    ÉtablissementTerritorial1652627040870,
    DateMiseÀJourSource1652627053530,
    AjoutDomaineÉtablissement1654002237462,
    AjoutActivitéMédicoSocial1656002701263,
    AjoutActivitéSanitaire1657269955824,
    AjoutNombrePassageUrgencesActivitéSanitaire1657616813991,
    AjoutVueRecherche1658238839801,
    AjoutDépartementEtCommune1658418352668,
    AjoutDatesMisesÀJourParFichier1658996326544,
    SupprimeTableDateMiseÀJourSource1659718559574,
    AjoutAutorisationsDesETMédicoSociaux1660654708747,
    AjoutAutorisationsDesETSanitaires1661442115103,
    RenommeColonneÉquipementMatérielLourds1661875206711,
    AjoutDesCapactiésDesAutorisationsSanitaires1662113899729,
    AjoutDesCapacitésPsy1662368876558,
    AjoutDesCommunesEtDépartementsDansLaRecherche1662644327376,
    PaginationDeLaRecherche1662736499297,
    IndexationRaisonSocialeCourte1662997448422,
    AjoutDuCpom1663057503529,
    AjoutBudgetEtFinancesMédicoSocial1663593231271,
    AjoutDesTauxPourLeBlocBudgetEtFinancesMédicoSocial1663852267673,
    AjoutFichierSourceAnnErrdEj1664462123042,
    AjoutTableRessourcesHumainesMédicoSocial1666166794478,
    AjoutSiren1666796630419,
    AjoutSiretEtMft1666798570971,
    AjoutRaisonSocialeCourteAuxRésultatsDeRecherche1666969626322,
    AjoutAnneeAutorisationSanitaire1673015716622,
    AjoutCategorisationEntiteJuridique1675329220245,
    AjoutActiviteSanitaireEntiteJuridique1675695881364,
    RenommerColonnePassageUrgenceActivitesEntiteJuridique1675867340170,
    AjouterBlocBudgetFinanceEJ1677495763184,
    AjoutCapacitesSanitaireEJ1680076022425,
    AjouteHAD1680014929754,
    AjoutTableSearchHistory1691400360927,
    AjoutTableFavori1691393817990,
    AjoutTableUtilisateurRoleEtablissement1686646154737,
    ModificationTableInstitution1688376404752,
    AjoutRefDepartementRegion1694523233904,
    AjoutRégionDansEntitéJuridique1694616724703,
    AjoutRégionDansEtablissementTerritorial1694617579347,
    ajoutTableProfil1795731844298,
    AjoutProfilsDansUtilisateurs1696841163367,
    AjouterSoftDeleteUtilisateur1701782042926,
    updateProfileTable1796422585498,
    UpdateUsersLastConnexionDate1704366840880,
    UpdateInstitutionsTable1704363653168,
    RemoveDuplicatedEmailAndMakeItUnique1704467337579,
    ModificationDesValeursDuChampRole1706794831872,
    AddCreatedByToProfileTable1796792910177,
    AjoutReclamationET1708440883632,
    AjoutFichierSourceSirec1708679781472,
    AjoutEvenementsIndesirables1710326854362,
    AjoutDateOuverture1713452627276,
  ],
  type: "postgres",
  url: environmentVariables.DATABASE_URL,
});
