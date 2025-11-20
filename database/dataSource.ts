import { DataSource, LoggerOptions } from "typeorm";


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
import { ajoutTableProfil1695731844298 } from "./migrations/1695731844298-ajoutTableProfil";
import { AjoutProfilsDansUtilisateurs1696841163367 } from "./migrations/1696841163367-AjoutProfilsDansUtilisateurs";
import { AjouterSoftDeleteUtilisateur1701782042926 } from "./migrations/1701782042926-AjouterSoftDeleteUtilisateur";
import { UpdateInstitutionsTable1704363653168 } from "./migrations/1704363653168-update-institutions-table";
import { UpdateUsersLastConnexionDate1704366840880 } from "./migrations/1704366840880-UpdateUsersLastConnexionDate";
import { RemoveDuplicatedEmailAndMakeItUnique1704467337579 } from "./migrations/1704467337579-RemoveDuplicatedEmailAndMakeItUnique";
import { ModificationDesValeursDuChampRole1706794831872 } from "./migrations/1706794831872-ModificationDesValeursDuChampRole";
import { AjoutReclamationET1708440883632 } from "./migrations/1708440883632-AjoutReclamationEtablissementTerritorial";
import { AjoutFichierSourceSirec1708679781472 } from "./migrations/1708679781472-AjoutFichierSourceSirec";
import { AjoutEvenementsIndesirables1710326854362 } from "./migrations/1710326854362-AjoutEvenementsIndesirables";
import { AjoutTableInspectionsControles1712743083892 } from "./migrations/1712743083892-AjoutTableInspectionsControles";
import { AjoutDateOuverture1713452627276 } from "./migrations/1713452627276-AjoutDateOuverture";
import { AjouterTableBudgetEtFinancesSanitaire1714055066913 } from "./migrations/1714055066913-AjouterTableBudget_et_finances_sanitaire";
import { AjoutTableAllocationRessource1718010452960 } from "./migrations/1718010452960-ajoutTableAllocationRessource";
import { AjoutTableAllocationRessourceET1718177983190 } from "./migrations/1718177983190-AjoutTableAllocationRessourceET";
import { AjoutActiviteSanitaireMensuel1719306882823 } from "./migrations/1719306882823-AjoutActiviteSanitaireMensuel";
import { AjoutActiviteSanitaireMensuelEntiteJuridique1719927727129 } from "./migrations/1719927727129-AjoutActiviteSanitaireMensuelEntiteJuridique";
import { AjoutRoleAdministrationCentrale1720186540616 } from "./migrations/1720186540616-AjoutRoleAdministrationCentrale";
import { AjoutInstitutionAdministrationCentrale1720187617872 } from "./migrations/1720187617872-AjoutInstitutionAdministrationCentrale";
import { AjoutOrdreRole1720428140655 } from "./migrations/1720428140655-AjoutOrdreRole";
import { SupprimeColonneMoisDeTableAllocationRessource1723542249780 } from "./migrations/1723542249780-supprimeColonneMoisDeTableAllocationRessource";
import { AjoutDeStatutJuridiqueDansLaRecherche1728314215381 } from "./migrations/1728314215381-ajoutDeStatutJuridiqueDansLaRecherche";
import { AjoutClassificationEtablissementTerritorial1728465089456 } from "./migrations/1728465089456-AjoutClassificationEtablissementTerritorial";
import { AjoutClassificationDansLaRecherche1728914554142 } from "./migrations/1728914554142-AjoutClassificationDansLaRecherche";
import { AjoutCodeRegionDansLaRecherche1730971588532 } from "./migrations/1730971588532-AjoutCodeRegionDansLaRecherche";
import { AjoutRattachementRecherche1732629322484 } from "./migrations/1732629322484-AjoutRattachementRecherche";
import { AjoutListEtEtsList1736865415982 } from "./migrations/1736865415982-AjoutListEtEtsList";
import { MettreAJourTableActiviteMedicoSocial1741861364859 } from "./migrations/1741861364859-MettreAJourTableActiviteMedicoSocial";
import { ClefEtrangereListEts1743596937227 } from "./migrations/1743596937227-ClefEtrangereListEts";
import { AjoutNombreJourneeUSLDActivitesSanitaires1745321952709 } from "./migrations/1745321952709-AjoutNombreJourneeUSLDActivitesSanitaires";
import { ReferentielCategoriesFiness1747831401347 } from "./migrations/1747831401347-ReferentielCategoriesFiness";
import { AjoutCategorieRecherche1748009262073 } from "./migrations/1748009262073-AjoutCategorieRecherche";
import { AjoutLaColonneDomaineAuReferentielCategories1748332500947 } from "./migrations/1748332500947-ajoutLaColonneDomaineAuReferentielCategories";
import { AjoutLibelleCategorieALaRecherche1754309418981 } from "./migrations/1754309418981-AjoutLibelleCategorieALaRecherche";
import { AjoutNomenclatureAMM1755003914846 } from "./migrations/1755003914846-ajoutNomenclatureAMM";
import { AjoutTableAutorisationsSanitairesAMM1755849074192 } from "./migrations/1755849074192-ajoutTableAutorisationsSanitairesAMM";
import { AjoutDonneesMensuellesPsy1756720758341 } from "./migrations/1756720758341-AjoutDonneesMensuellesPsy";
import { AjoutTableRessourcesHumainesEJ1757946729822 } from "./migrations/1757946729822-AjoutTableRessourcesHumainesEJ";
import { ModificationValeurProfilAjoutBlocRhEj1758098318274 } from "./migrations/1758098318274-ModificationValeurProfilAjoutBlocRhEj";
import { ModificationTableRessourcesHumainesEJ1758551051552 } from "./migrations/1758551051552-ModificationTableRessourcesHumainesEJ";
import { ModificationProfilJoursAbsPnmRhEj1758555147382 } from "./migrations/1758555147382-ModificationProfilJoursAbsPnmRhEj";
import { AjoutTableRessourcesHumainesETSAN1758618772544 } from "./migrations/1758618772544-AjoutTableRessourcesHumainesETSAN";
import { ModificationProfilRessourcesHumainesETSAN1758618803617 } from "./migrations/1758618803617-ModificationProfilRessourcesHumainesETSAN";
import { AjoutTableParametrageJson1759416645736 } from "./migrations/1759416645736-AjoutTableParametrageJson";
import { AjoutDmsActiviteMensuel1759826053430 } from "./migrations/1759826053430-AjoutDmsActiviteMensuel"
import { AjoutDmsActiviteSanitaire1759845977685 } from "./migrations/1759845977685-AjoutDmsActiviteSanitaire"
import { AjoutColonneDepartsPrematuresCdi1761819265202 } from "./migrations/1761819265202-AjoutColonneDepartsPrematuresCdi";
import { AjoutDureeMoyenneSejourDansLesProfils1762435683856 } from "./migrations/1762435683856-AjoutDureeMoyenneSejourDansLesProfils";
import { updateProfileTable1796422585498 } from "./migrations/1796422585498-updateProfileTable";
import { AddCreatedByToProfileTable1796792910177 } from "./migrations/1796792910177-AddCreatedByToProfileTable";
import { ModificationValeurProfil1797341938070 } from "./migrations/1797341938070-modificationValeurProfil";
import { AjoutBudgetEtFinanceAProfilETSanitaire1797688226682 } from "./migrations/1797688226682-AjoutBudgetEtFinanceAProfilETSanitaire";
import { AjoutAllocationDeRessourcesToBudgetEtFinance1798688226682 } from "./migrations/1798688226682-AjoutAllocationDeRessourcesToBudgetEtFinance";
import { AjoutDesOccupationsDansLesProfils1799478704013 } from "./migrations/1799478704013-AjoutDesOccupationsDansLesProfils";
import { AjoutLesJourneesUsldDansLesProfils1799501916707 } from "./migrations/1799501916707-AjoutLesJourneesUsldDansLesProfils";
import { AjoutVigieRhContrat1738320902145 } from "./migrations/vigie_rh/1738320902145-AjoutVigieRhContrat";
import { AjoutVigieRhProfessionFiliere1738328763147 } from "./migrations/vigie_rh/1738328763147-AjoutVigieRhProfessionFiliere";
import { AjoutVigieRhProfessionGroupe1738328796095 } from "./migrations/vigie_rh/1738328796095-AjoutVigieRhProfessionGroupe";
import { AjoutEnumFichierDateMiseAjour1739804255435 } from "./migrations/vigie_rh/1739804255435-AjoutEnumFichierDateMiseAjour";
import { AjoutEnumFichierDateMiseAjourReferentiel1739960328134 } from "./migrations/vigie_rh/1739960328134-AjoutEnumFichierDateMiseAjourReferentiel";
import { AjoutTableVigieRhPyramide1739979832918 } from "./migrations/vigie_rh/1739979832918-AjoutTableVigieRhPyramide";
import { AjoutTableVigieRhMouvementsRH1757337280336 } from "./migrations/vigie_rh/1757337280336-AjoutTableVigieRhMouvementsRH";
import { AjoutTableVigieRhMouvementsTrimestriels1757662996841 } from "./migrations/vigie_rh/1757662996841-AjoutTableVigieRhMouvementsTrimestriels";
import { SuppressionQuarterDeVigieRhProfessionFiliere1758014111419 } from "./migrations/vigie_rh/1758014111419-SuppressionQuarterDeVigieRhProfessionFiliere";
import { SupressionColonneEffectifDePyramideAges1758270710076 } from "./migrations/vigie_rh/1758270710076-supressionColonneEffectifDePyramideAges";
import { SuppressionEffectifEtabDeVigieRhProfessionFiliere1758292560238 } from "./migrations/vigie_rh/1758292560238-SuppressionEffectifEtabDeVigieRhProfessionFiliere";
import { AjoutTableVigieRhDureeCdd1759821521368 } from "./migrations/vigie_rh/1759821521368-AjoutTableVigieRhDureeCdd";
import { AjoutMotifsRupturesContrats1760516962957 } from "./migrations/vigie_rh/1760516962957-AjoutMotifsRupturesContrats";
import { VigierhNatureContratsTables1760966102359 } from "./migrations/vigie_rh/1760966102359-vigierhNatureContratsTables";
import { ModificationTableProfession21762263346352 } from "./migrations/vigie_rh/1762263346352-ModificationsTablesProfessions";
import { SupressionTableVigierhContrat1763372516438 } from "./migrations/vigie_rh/1763372516438-SupressionTableVigierhContrat";
import { AjoutReferentielTypeContrat1738227384991 } from "./migrations/vigie_rh/referentiels/1738227384991-AjoutReferentielTypeContrat";
import { AjoutReferentielProfessionFiliere1738328597314 } from "./migrations/vigie_rh/referentiels/1738328597314-AjoutReferentielProfessionFiliere";
import { AjoutReferentielProfessionGroupe1738328713502 } from "./migrations/vigie_rh/referentiels/1738328713502-AjoutReferentielProfessionGroupe";
import { AjoutReferentielMasque1738593046415 } from "./migrations/vigie_rh/referentiels/1738593046415-AjoutReferentielMasque";
import { AjoutReferentielQualite1738593074489 } from "./migrations/vigie_rh/referentiels/1738593074489-AjoutReferentielQualite";
import { AjoutReferentielRedressement1738593097578 } from "./migrations/vigie_rh/referentiels/1738593097578-AjoutReferentielRedressement";
import { AjoutReferentielTrancheAge1739874041081 } from "./migrations/vigie_rh/referentiels/1739874041081-ajoutReferentielTrancheAge";
import { AjoutTableVigieRhRefDureeCdd1759821492361 } from "./migrations/vigie_rh/referentiels/1759821492361-AjoutTableVigieRhRefDureeCdd";
import { AjoutReferentielMotifsRupturesContrats1760516933359 } from "./migrations/vigie_rh/referentiels/1760516933359-AjoutReferentielMotifsRupturesContrats";
import { ActiviteSanitaireMensuelEntiteJuridiqueModel } from "./models/ActiviteSanitaireMensuelEntiteJuridiqueModel";
import { ActiviteSanitaireMensuelModel } from "./models/ActiviteSanitaireMensuelModel";
import { ActivitéMédicoSocialModel } from "./models/ActivitéMédicoSocialModel";
import { ActivitéSanitaireEntitéJuridiqueModel } from "./models/ActivitéSanitaireEntitéJuridiqueModel";
import { ActivitéSanitaireModel } from "./models/ActivitéSanitaireModel";
import { AllocationRessourceETModel } from "./models/AllocationRessourceETModel";
import { AllocationRessourceModel } from "./models/AllocationRessourceModel";
import { AutorisationMédicoSocialModel } from "./models/AutorisationMédicoSocialModel";
import { AutorisationSanitaireModel } from "./models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "./models/AutreActivitéSanitaireModel";
import { BudgetEtFinancesEntiteJuridiqueModel } from "./models/BudgetEtFinancesEntiteJuridiqueModel";
import { BudgetEtFinancesMédicoSocialModel } from "./models/BudgetEtFinancesMédicoSocialModel";
import { BudgetEtFinancesSanitaireModel } from "./models/BudgetEtFinancesSanitaireModel";
import { CapacitesSanitaireEntiteJuridiqueModel } from "./models/CapacitesSanitaireEntiteJuridiqueModel";
import { CapacitéAutorisationSanitaireModel } from "./models/CapacitéAutorisationSanitaireModel";
import { CategoriesFinessModel } from "./models/CategoriesFinessModel";
import { CpomModel } from "./models/CpomModel";
import { DateMiseÀJourFichierSourceModel } from "./models/DateMiseÀJourFichierSourceModel";
import { EntitéJuridiqueModel } from "./models/EntitéJuridiqueModel";
import { EvenementIndesirableETModel } from "./models/EvenementIndesirableModel";
import { FavorisModel } from "./models/FavorisModel";
import { InspectionsControlesETModel } from "./models/InspectionsModel";
import { InstitutionModel } from "./models/InstitutionModel";
import { ParametrageJsonModel } from "./models/ParametrageJsonModel";
import { ProfilModel } from "./models/ProfilModel";
import { RechercheModel } from "./models/RechercheModel";
import { ReclamationETModel } from "./models/ReclamationETModel";
import { ReconnaissanceContractuelleSanitaireModel } from "./models/ReconnaissanceContractuelleSanitaireModel";
import { RefDepartementRegionModel } from "./models/RefDepartementRegionModel";
import { RessourcesHumainesEntiteJuridiqueModel } from "./models/RessourcesHumainesEntiteJuridiqueModel";
import { RessourcesHumainesEtablissementSanitaireModel } from "./models/RessourcesHumainesEtablissementSanitaireModel";
import { RessourcesHumainesMédicoSocialModel } from "./models/RessourcesHumainesMédicoSocialModel";
import { RoleModel } from "./models/RoleModel";
import { SearchHistoryModel } from "./models/SearchHistoryModel";
import { UserListEtablissementModel } from "./models/UserListEtablissementModel";
import { UserListModel } from "./models/UserListModel";
import { UtilisateurModel } from "./models/UtilisateurModel";
import { VigieRhRefDureeCddModel } from "./models/vigie_rh/referentiel/VigieRhRefDureeCddModel";
import { VigieRhRefMasqueModel } from "./models/vigie_rh/referentiel/VigieRhRefMasqueModel";
import { VigieRhRefMotifRuptutreContratModel } from "./models/vigie_rh/referentiel/VigieRhRefMotifRuptureContratModel";
import { VigieRhRefNatureContrat } from "./models/vigie_rh/referentiel/VigieRhRefNatureContratsModel";
import { VigieRhRefProfessionFiliereModel } from "./models/vigie_rh/referentiel/VigieRhRefProfessionFiliereModel";
import { VigieRhRefProfessionGroupeModel } from "./models/vigie_rh/referentiel/VigieRhRefProfessionGroupeModel";
import { VigieRhRefQualiteModel } from "./models/vigie_rh/referentiel/VigieRhRefQualiteModel";
import { VigieRhRefRedressementModel } from "./models/vigie_rh/referentiel/VigieRhRefRedressementModel";
import { VigieRhRefTrancheAgeModel } from "./models/vigie_rh/referentiel/VigieRhRefTrancheAgeModel";
import { VigieRhDureesCDDModel } from "./models/vigie_rh/VigieRHDureesCDDModel";
import { VigieRhMotifRuptutreContratModel } from "./models/vigie_rh/VigieRhMotifRuptutreContratModel";
import { VigieRhMouvementsModel } from "./models/vigie_rh/VigieRhMouvementsModel";
import { VigieRhMouvementsTrimestrielsModel } from "./models/vigie_rh/VigieRhMouvementsTrimestrielsModel";
import { VigieRhNatureContratsAnnuelModel } from "./models/vigie_rh/VigieRhNatureContratsAnnuelModel";
import { VigieRhNatureContratsTrimestrielModel } from "./models/vigie_rh/VigieRhNatureContratsTrimestrielModel";
import { VigieRhProfessionFiliereModel } from "./models/vigie_rh/VigieRhProfessionFiliereModel";
import { VigieRhProfessionGroupeModel } from "./models/vigie_rh/VigieRhProfessionGroupeModel";
import { VigieRhPyramideAgesModel } from "./models/vigie_rh/VigieRHPyramideAgeModel";
import { ÉquipementMatérielLourdSanitaireModel } from "./models/ÉquipementMatérielLourdSanitaireModel";
import { ÉtablissementTerritorialIdentitéModel } from "./models/ÉtablissementTerritorialIdentitéModel";
import { dotEnvConfig } from "../download_data_source/infrastructure/gateways/dot-env/dotEnvConfig";
import { NodeEnvironmentVariables } from "../download_data_source/infrastructure/gateways/environnement-variables/NodeEnvironmentVariables";
import { ConsoleLogger } from "../download_data_source/infrastructure/gateways/logger/ConsoleLogger";

const logger = new ConsoleLogger();
dotEnvConfig();
const environmentVariables = new NodeEnvironmentVariables(logger);

const datasource = new DataSource({
  entities: [
    ActivitéMédicoSocialModel,
    ActivitéSanitaireModel,
    AutorisationMédicoSocialModel,
    AutorisationSanitaireModel,
    AutreActivitéSanitaireModel,
    BudgetEtFinancesMédicoSocialModel,
    BudgetEtFinancesSanitaireModel,
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
    RessourcesHumainesEntiteJuridiqueModel,
    RessourcesHumainesEtablissementSanitaireModel,
    RessourcesHumainesMédicoSocialModel,
    ActivitéSanitaireEntitéJuridiqueModel,
    UtilisateurModel,
    RoleModel,
    InstitutionModel,
    SearchHistoryModel,
    RefDepartementRegionModel,
    ProfilModel,
    ParametrageJsonModel,
    ReclamationETModel,
    EvenementIndesirableETModel,
    InspectionsControlesETModel,
    AllocationRessourceModel,
    AllocationRessourceETModel,
    ActiviteSanitaireMensuelModel,
    ActiviteSanitaireMensuelEntiteJuridiqueModel,
    UserListModel,
    UserListEtablissementModel,
    VigieRhRefProfessionFiliereModel,
    VigieRhRefProfessionGroupeModel,
    VigieRhRefMasqueModel,
    VigieRhRefQualiteModel,
    VigieRhRefRedressementModel,
    VigieRhProfessionFiliereModel,
    VigieRhProfessionGroupeModel,
    VigieRhRefTrancheAgeModel,
    VigieRhPyramideAgesModel,
    VigieRhMouvementsModel,
    VigieRhMouvementsTrimestrielsModel,
    CategoriesFinessModel,
    AutorisationSanitaireModel,
    VigieRhDureesCDDModel,
    VigieRhRefDureeCddModel,
    VigieRhMotifRuptutreContratModel,
    VigieRhRefMotifRuptutreContratModel,
    VigieRhRefNatureContrat,
    VigieRhNatureContratsAnnuelModel,
    VigieRhNatureContratsTrimestrielModel
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
    AjoutRoleAdministrationCentrale1720186540616,
    AjoutInstitutionAdministrationCentrale1720187617872,
    AjoutOrdreRole1720428140655,
    AjoutTableUtilisateurRoleEtablissement1686646154737,
    ModificationTableInstitution1688376404752,
    AjoutRefDepartementRegion1694523233904,
    AjoutRégionDansEntitéJuridique1694616724703,
    AjoutRégionDansEtablissementTerritorial1694617579347,
    ajoutTableProfil1695731844298,
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
    AjoutTableInspectionsControles1712743083892,
    ModificationValeurProfil1797341938070,
    AjoutTableAllocationRessource1718010452960,
    AjoutTableAllocationRessourceET1718177983190,
    AjouterTableBudgetEtFinancesSanitaire1714055066913,
    AjoutBudgetEtFinanceAProfilETSanitaire1797688226682,
    AjoutAllocationDeRessourcesToBudgetEtFinance1798688226682,
    SupprimeColonneMoisDeTableAllocationRessource1723542249780,
    AjoutActiviteSanitaireMensuel1719306882823,
    AjoutActiviteSanitaireMensuelEntiteJuridique1719927727129,
    AjoutDeStatutJuridiqueDansLaRecherche1728314215381,
    AjoutClassificationEtablissementTerritorial1728465089456,
    AjoutClassificationDansLaRecherche1728914554142,
    AjoutCodeRegionDansLaRecherche1730971588532,
    AjoutRattachementRecherche1732629322484,
    AjoutListEtEtsList1736865415982,
    AjoutVigieRhContrat1738320902145,
    AjoutVigieRhProfessionFiliere1738328763147,
    SuppressionQuarterDeVigieRhProfessionFiliere1758014111419,
    SuppressionEffectifEtabDeVigieRhProfessionFiliere1758292560238,
    AjoutVigieRhProfessionGroupe1738328796095,
    AjoutReferentielTypeContrat1738227384991,
    AjoutReferentielProfessionFiliere1738328597314,
    AjoutReferentielProfessionGroupe1738328713502,
    AjoutReferentielMasque1738593046415,
    AjoutReferentielQualite1738593074489,
    AjoutReferentielRedressement1738593097578,
    AjoutReferentielTrancheAge1739874041081,
    AjoutEnumFichierDateMiseAjour1739804255435,
    AjoutTableVigieRhPyramide1739979832918,
    AjoutEnumFichierDateMiseAjourReferentiel1739960328134,
    MettreAJourTableActiviteMedicoSocial1741861364859,
    AjoutDesOccupationsDansLesProfils1799478704013,
    ClefEtrangereListEts1743596937227,
    AjoutNombreJourneeUSLDActivitesSanitaires1745321952709,
    AjoutLesJourneesUsldDansLesProfils1799501916707,
    ReferentielCategoriesFiness1747831401347,
    AjoutCategorieRecherche1748009262073,
    AjoutLaColonneDomaineAuReferentielCategories1748332500947,
    AjoutLibelleCategorieALaRecherche1754309418981,
    AjoutNomenclatureAMM1755003914846,
    AjoutTableAutorisationsSanitairesAMM1755849074192,
    AjoutDonneesMensuellesPsy1756720758341,
    AjoutTableVigieRhMouvementsRH1757337280336,
    AjoutTableVigieRhMouvementsTrimestriels1757662996841,
    SupressionColonneEffectifDePyramideAges1758270710076,
    AjoutTableRessourcesHumainesEJ1757946729822,
    ModificationValeurProfilAjoutBlocRhEj1758098318274,
    ModificationTableRessourcesHumainesEJ1758551051552,
    ModificationProfilJoursAbsPnmRhEj1758555147382,
    AjoutTableRessourcesHumainesETSAN1758618772544,
    ModificationProfilRessourcesHumainesETSAN1758618803617,
    AjoutTableParametrageJson1759416645736,
    AjoutReferentielMotifsRupturesContrats1760516933359,
    AjoutMotifsRupturesContrats1760516962957,
    AjoutTableVigieRhDureeCdd1759821521368,
    AjoutTableVigieRhRefDureeCdd1759821492361,
    VigierhNatureContratsTables1760966102359,
    AjoutColonneDepartsPrematuresCdi1761819265202,
    AjoutDmsActiviteMensuel1759826053430,
    AjoutDmsActiviteSanitaire1759845977685,
    AjoutDureeMoyenneSejourDansLesProfils1762435683856,
    ModificationTableProfession21762263346352,
    SupressionTableVigierhContrat1763372516438
  ],
  type: "postgres",
  url: environmentVariables.DATABASE_URL,
});

export default datasource;
