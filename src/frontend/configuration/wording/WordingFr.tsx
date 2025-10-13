import { ReactElement } from "react";

import { Wording } from "./Wording";

export class WordingFr implements Wording {
  // Abréviations
  readonly CPOM_TITLE: string = "Contrat Pluriannuel d’Objectifs et de Moyens";
  readonly CPOM: ReactElement = (<abbr title={this.CPOM_TITLE}>CPOM</abbr>);
  readonly ASR_TITLE: string = "Activités Soumises à Reconnaissance contractuelle";
  readonly ASR: ReactElement = (<abbr title={this.ASR_TITLE}>ASR</abbr>);

  // Commun
  readonly CANCEL: string = "Annuler";
  readonly SEND_EMAIL: string = "Confirmer la demande de renouvellement";
  readonly RESEND_EMAIL: string = "Envoyer à nouveau";
  readonly BACK_TO_CONNEXION: string = "Retour à la page de connexion";
  readonly APPLY: string = "Appliquer";

  // Messages d'erreur
  readonly MISSING_EMAIL: string = "Veuillez renseigner le champ courriel";
  readonly EMAIL_NOT_VALID: string = "Veuillez saisir une adresse email valide";
  readonly SOMETHING_WENT_WRONG: string = "Votre action n’a pas été prise en compte. Veuillez réessayer ultérieurement.";
  readonly INVALID_REQUEST: string = "veuillez vérifier vos données";
  readonly INVALID_USER: string = "Compte non inscrit sur Helios";

  // Header
  readonly INTITULÉ_RÉPUBLIQUE_FRANÇAISE: ReactElement = (
    <>
      République
      <br />
      Française
    </>
  );
  readonly ACCUEIL: string = "Accueil";
  readonly MENU: string = "Menu";
  readonly DÉCONNEXION: string = "Se déconnecter";
  readonly FERMER: string = "Fermer";
  readonly TITRE_DU_SITE: string = "Helios";

  // Titre des pages
  readonly TITRE_PAGE_ACCUEIL: string = "Accueil - Helios";
  readonly TITRE_PAGE_CONNEXION: string = "Connexion - Helios";
  readonly TITRE_PAGE_PLAN_DU_SITE: string = "Plan du site - Helios";
  readonly TITRE_PAGE_ACCESSIBILITÉ: string = "Accessibilité - Helios";
  readonly TITRE_PAGE_MENTIONS_LÉGALES: string = "Mentions légales - Helios";
  readonly TITRE_PAGE_DONNÉES_PERSONNELLES: string = "Données personnelles - Helios";
  readonly TITRE_PAGE_GESTION_COOKIES: string = "Gestion des cookies - Helios";
  readonly TITRE_PAGE_INACCESSIBLE: string = "Accès refusé - Helios";
  readonly TITRE_PAGE_ECO_CONCEPTION: string = "Eco-Conception - Helios";

  // Breadcrumb
  readonly VOUS_ÊTES_ICI: string = "Vous êtes ici :";
  readonly VOIR_LE_FIL_D_ARIANE: string = "Voir le fil d’Ariane";
  readonly ENTITÉ_JURIDIQUE: string = "Entité juridique";
  readonly régionBreadcrumb: (placeholder: string) => string = (placeholder: string) => `Région ${placeholder}`;

  // Home
  readonly TITRE_LISTE_DES_ENTITÉS_JURIDIQUES: string = "Les entités juridiques";
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_TERRITORIAUX: string = "Les établissements territoriaux";
  readonly ENTITÉS_JURIDIQUES: string = "Entité(s) Juridique(s)";
  readonly ÉTABLISSEMENT_TERRITORIAUX: string = "Établissements Territoriaux";
  readonly SITE_EN_CONSTRUCTION: string = "Le site est dans sa phase pilote : il est toujours en construction et va évoluer régulièrement.";

  // Inscription
  readonly REGISTRATION_PAGE_TITLE: string = "Demande d'accès à Helios";
  readonly SEND: string = "Envoyer";
  readonly REGISTRARTION_SUCCESS_MESSAGE: string = "Un courriel a été envoyé à votre adresse email.";
  readonly EMAIL_ALREADY_USED: string = "L'adresse mail saisie est déjà rattachée à un compte. Si vous avez oublié votre mot de passe, cliquez ";
  readonly NOT_AUTORIZED_EMAIL: string = "L'adresse mail saisie ne peut pas être utilisée avec cette institution";
  // Connexion
  readonly CONNEXION_IDENTIFIANT: string = "Identifiant *";
  readonly CONNEXION_MOT_DE_PASSE: string = "Mot de passe *";
  readonly CONNEXION_MOT_DE_PASSE_OUBLIE: string = "Vous n'avez pas de compte ? ";
  readonly FORGET_PASSEWORD: string = "Mot de passe oublié ?";
  readonly CONNEXION_LIBELLE: string = "Connexion";
  readonly FORGET_PASSEWORD_MESSAGE: string = "Merci de saisir votre adresse mail afin de définir un nouveau mot de passe";

  // Recherche
  readonly RECHERCHE_DESCRIPTION: ReactElement = (
    <>
      Accédez rapidement et simplement à la fiche de synthèse d’un établissement géographique
      <br />
      ou d’une entité juridique.
    </>
  );
  readonly RECHERCHE_PLACEHOLDER: string = "Rechercher un numéro FINESS ou le nom d’un établissement";
  readonly RECHERCHE_LABEL: string = "Rechercher";
  readonly RÉSULTAT_DE_RECHERCHE: string = "Résultat de recherche";
  readonly rechercheNombreRésultats: (nombre: number, terme: string) => string = (nombre, terme: string) =>
    `${nombre} résultat(s) correspond(ent) à votre recherche « ${terme} ».`;
  readonly RECHERCHE_EN_ATTENTE: string = "En cours de recherche...";
  readonly aucunRésultat: (terme: string) => string = (terme: string) => `Aucun résultat ne correspond à votre recherche « ${terme} ».`;
  readonly ERREUR_TECHNIQUE: string =
    "Veuillez nous excuser, nous venons de rencontrer une erreur technique. Nous vous invitons à effectuer une nouvelle recherche plus tard.";
  readonly VOIR_PLUS_RÉSULTATS: string = "Voir plus de résultats";
  readonly RECHERCHE_TITRE: string = "";
  readonly BACK_TO_SEARCH: string = "Retour aux résultats de la recherche";
  readonly RESULTAT_RECHERCHE_AVANCEE_TEXT: string = "Les établissements apparaîtront ici.";
  readonly AUCUN_RESULTAT_RECHERCHE_AVANCEE_TEXT: string = "Aucun résultat ne correspond à votre recherche";

  // Recherche avancée
  readonly RECHERCHE_AVANCEE_LABEL: string = "Recherche Avancée";
  readonly ZONE_GEOGRAPHIQUE: string = "Zone géographique";
  readonly STRUCTURE: string = "Structure";
  readonly CATEGORIES_FINESS: string = "Catégorie FINESS";
  readonly CATEGORIES_FINESS_TITLE: string = "Catégories d'établissement";
  readonly CAPACITE: string = "Capacité MS";
  readonly ACTIVITE_SAN: string = "Activité SAN";
  readonly RECHERCHE_AVANCEE_TEXT: string = "Sélectionnez des indicateurs et recherchez.";
  readonly TOUT_EFFACER: string = "Tout effacer";

  // Cartographie
  readonly CARTOGRAPHIE: string = "Cartographie";
  readonly OFFRE_SANTÉ_PAR_REGION: string = "Offre de santé par région";
  readonly CARTOGRAPHIE_DESCRIPTION: string = "Visualisez l’offre de santé d’une région en retrouvant tous les établissements de votre choix.";

  readonly COOKIES_ATLASSANTÉ: string =
    "Pour afficher la carte, nous vous invitons à activer les cookies Atlasanté et à favoriser le navigateur Microsoft Edge.";

  // Région
  readonly régionAtlasSanté: (placeholder: string) => string = (placeholder: string) => `Carte de ${placeholder}`;

  // Fiches
  readonly miseÀJour: (date: string) => string = (date: string): string => `Mise à jour : ${date}`;
  readonly miseÀJourEtSource: (date: string, source: ReactElement) => ReactElement = (date: string, source: ReactElement): ReactElement => (
    <>
      {this.miseÀJour(date)}
      {" - "}
      Source : {source}
    </>
  );
  readonly NON_RENSEIGNÉ: string = "Non renseigné";
  readonly OUI: string = "Oui";
  readonly NON: string = "Non";
  readonly DÉTAILS: string = "Détails";
  readonly TÉLÉCHARGER_EN_PDF: string = "Télécharger en PDF";
  readonly EXPORT_ET_RATTACHES: string = "Exporter les ET rattachés";

  // Info bulle
  readonly ÉLÉMENTS_DE_COMPRÉHENSION: string = "Éléments de compréhension";
  readonly FRÉQUENCE: string = "Fréquence";
  readonly MODE_DE_CALCUL: string = "Mode de calcul";
  readonly SOURCES: string = "Sources";
  readonly INFOS_COMPLÉMENTAIRES: string = "Informations complémentaires";

  // Indicateurs
  readonly AFFICHER_LA_TRANSCRIPTION: string = "Afficher la transcription";
  readonly TITRE_TRANSCRIPTION: string = "Transcription du graphique";
  readonly ANNÉE: string = "Année";
  readonly MOIS: string = "Mois";
  readonly INDICATEURS_VIDES: string = "Aucune donnée pour cet établissement.";
  readonly AUCUNE_DONNÉE_RENSEIGNÉE: string = "Aucune donnée pour les années suivantes :";
  readonly AUCUNE_DONNÉE_RENSEIGNÉE_MENSUEL: string = "Aucune donnée renseignée à partir de :";
  readonly AUCUNE_DONNÉE_RENSEIGNÉE_INDICATEURS: string = "Aucune donnée pour les indicateurs suivants :";
  readonly VALEURS_INFERIEUR_A_5_CACHÉS: string = "Pour respecter le RGPD, les valeurs inférieures ou égales à 5 sont remplacées par la mention “1 à 5”.";
  readonly PLACEHOLDER_VALEUR_INFERIEUR_A_5: string = "1 à 5";

  // Catégorisation
  readonly PRIVÉ_LUCRATIF = "PRIVÉ LUCRATIF";
  readonly PRIVÉ_NON_LUCRATIF = "PRIVÉ NON LUCRATIF";
  readonly PUBLIC = "PUBLIC";
  readonly PERSONNE_MORALE_DROIT_ÉTRANGER = "PERSONNE MORALE DE DROIT ÉTRANGER";

  // Bloc Identité
  readonly TITRE_BLOC_IDENTITÉ: string = "fiche d’identité";
  readonly NOM_DE_L_ÉTABLISSEMENT: string = "Nom de l’établissement";
  readonly DATE_D_OUVERTURE: string = "Date d’ouverture";
  readonly NUMÉRO_FINESS: string = "Numéro FINESS";
  readonly SIREN: string = "SIREN";
  readonly SIRET: string = "SIRET";
  readonly ADRESSE: string = "Adresse";
  readonly TÉLÉPHONE: string = "Téléphone";
  readonly TÉLÉPHONE_ET_EMAIL: string = "Téléphone et e-mail";
  readonly STATUT_JURIDIQUE: string = "Statut juridique";
  readonly STATUT_JURIDIQUE_EJ: string = "Statut juridique de l’EJ";
  readonly DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM: ReactElement = (
    <>
      {"Date d’entrée en vigueur du "}
      {this.CPOM}
    </>
  );
  readonly ENTITÉ_JURIDIQUE_DE_RATTACHEMENT: string = "Entité juridique de rattachement";
  readonly CATÉGORIE_DE_L_ÉTABLISSEMENT: string = "Catégorie de l’établissement";
  readonly MODE_DE_TARIFICATION: string = "Mode de tarification";
  readonly MONO_ÉTABLISSEMENT: string = "Mono-établissement";
  readonly ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE: string = "Établissement Principal/Secondaire";
  readonly PRINCIPAL: string = "Principal";
  readonly SECONDAIRE: string = "Secondaire";
  readonly SITE_INTERNET: string = "Site internet";

  // Bloc Activité Médico-Social
  readonly TITRE_BLOC_ACTIVITÉ: string = "activité";
  readonly TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT: string = "Taux d’occupation en hébergement permanent";
  readonly TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE: string = "Taux d’occupation en hébergement temporaire";
  readonly TAUX_OCCUPATION_ACCUEIL_DE_JOUR: string = "Taux d’occupation en accueil de jour";
  readonly TAUX_RÉALISATION_ACTIVITÉ: string = "Taux de réalisation de l’activité";
  readonly FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES: string = "File active des personnes accompagnées sur la période";
  readonly NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES: string = "Nombre moyen de journées d’absence des personnes accompagnées sur la période";
  readonly DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES: string =
    "Durée moyenne de séjour/d’accompagnement des personnes sorties définitivement au cours de l’année (en nombre de jours)";
  readonly NOMBRE_DE_PASSAGES_AUX_URGENCES: string = "Nombre de passages aux urgences";
  readonly TAUX_OCCUPATION_EXTERNAT: string = "Taux d’occupation externat ";
  readonly TAUX_OCCUPATION_SEMI_INTERNAT: string = " Taux d’occupation semi-internat";
  readonly TAUX_OCCUPATION_INTERNAT: string = "Taux d’occupation internat ";
  readonly TAUX_OCCUPATION_AUTRE: string = "Taux d'occupation Autre 1, 2 et 3";
  readonly TAUX_OCCUPATION_SEANCES: string = "Taux d'occupation séances";

  // Bloc Activité Sanitaire
  readonly NOMBRE_DE_SÉJOUR_MCO: string = "Nombre de séjours Médecine, Chirurgie et Obstétrique en Hospitalisation Complète et Hospitalisation Partielle";
  readonly TOTAL_HOSPITALISATION_MÉDECINE: string = "Total Hospitalisation Médecine";
  readonly TOTAL_HOSPITALISATION_CHIRURGIE: string = "Total Hospitalisation Chirurgie";
  readonly TOTAL_HOSPITALISATION_OBSTÉTRIQUE: string = "Total Hospitalisation Obstétrique";
  readonly HOSPITALISATION_PARTIELLE_MÉDECINE: string = "Hospitalisation Partielle Médecine";
  readonly HOSPITALISATION_COMPLÈTE_MÉDECINE: string = "Hospitalisation Complète Médecine";
  readonly HOSPITALISATION_PARTIELLE_CHIRURGIE: string = "Hospitalisation Partielle Chirurgie";
  readonly HOSPITALISATION_COMPLÈTE_CHIRURGIE: string = "Hospitalisation Complète Chirurgie";
  readonly HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE: string = "Hospitalisation Partielle Obstétrique";
  readonly HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE: string = "Hospitalisation Complète Obstétrique";
  readonly TOTAL_HOSPITALISATION_SSR: string = "Total Hospitalisation SSR";
  readonly TOTAL_HOSPITALISATION_PSY: string = "Total Hospitalisation PSY";
  readonly NOMBRE_DE_JOURNÉES_PSY_ET_SSR: string = "Nombre de journées PSY et SSR en Hospitalisation Complète et Hospitalisation Partielle";
  readonly HOSPITALISATION_PARTIELLE_SSR: string = "Hospitalisation Partielle SSR";
  readonly HOSPITALISATION_COMPLÈTE_SSR: string = "Hospitalisation Complète SSR";
  readonly HOSPITALISATION_PARTIELLE_PSY: string = "Hospitalisation Partielle PSY";
  readonly HOSPITALISATION_COMPLÈTE_PSY: string = "Hospitalisation Complète PSY";
  readonly NOMBRE_DE_HAD: string = "Nombre de Séjours HAD";
  readonly NOMBRE_DE_JOURNEES_USLD: string = "Nombre de journées USLD";
  readonly ANNUEL: string = "Annuel";
  readonly MENSUEL: string = "Mensuel";
  readonly TRIMESTRIEL: string = "Trimestriel";

  // Bloc Autorisation
  readonly TITRE_BLOC_AUTORISATION_ET_CAPACITÉ: string = "capacité et autorisation";
  readonly AUTORISATIONS_SANITAIRE: string = "Autorisations de soins";
  readonly AUTORISATIONS_MS: string = "Autorisations sociales et médico-sociales";
  readonly AUTORISATIONS_ACTIVITES: string = "Autorisations d'activité de soins";
  readonly DATE_D_AUTORISATION: string = "Date d’autorisation";
  readonly CAPACITÉ_AUTORISÉE: string = "Capacité autorisée";

  // Bloc Qualité
  readonly TITRE_BLOC_QUALITE: string = "qualité";
  readonly RECLAMATIONS: string = "Réclamations";

  readonly MOTIF_DES_RECLAMATIONS: string = "Motif des réclamations";
  readonly NOMBRE_TOTAL_RECLAMATIONS: string = "Nombre total de réclamations concernées";
  readonly NOMBRE_RECLAMATIONS_EN_ENCOURS: string = "Nombre de réclamations en cours concernées";
  readonly NOMBRE_RECLAMATIONS_CLOTUREES: string = "Nombre de réclamations clôturées concernées";

  readonly MOTIF_10: string = "Hôtellerie-locaux-restauration";
  readonly MOTIF_11: string = "Problème d'organisation ou de fonctionnement de l'établissement ou du service";
  readonly MOTIF_12: string = "Problème de qualité des soins médicaux";
  readonly MOTIF_13: string = "Problème de qualité des soins paramédicaux";
  readonly MOTIF_14: string = "Recherche d'établissement ou d'un professionnel";
  readonly MOTIF_15: string = "Mise en cause attitude des professionnels";
  readonly MOTIF_16: string = "Informations et droits des usagers";
  readonly MOTIF_17: string = "Facturation et honoraires";
  readonly MOTIF_18: string = "Santé-environnementale";
  readonly MOTIF_19: string = "Activités d'esthétique réglementées";
  readonly MOTIF_155: string = "À renseigner";
  readonly MOTIF_156: string = "COVID-19";

  readonly INSPECTIONS_CONTROLES: string = "Inspections / Contrôles";

  readonly EVENEMENTS_INDESIRABLES: string = "Evènements indésirables";
  readonly EVENEMENTS_INDESIRABLES_NON_RENSEIGNES: string =
    "Evènements indésirables. ⚠ L'absence de signalement d'événements indésirables nuit à la prise de mesures correctives appropriées.";
  readonly EVENTS_TOTAL_NUMBER: string = "Nombre total d'évènements:";
  readonly EVENEMENTS_ASSOCIE_AUX_SOINS: string = "Evènements indésirables/graves associés aux soins";
  readonly EVENEMENTS_DANS_ET: string = "Evènements/incidents dans un établissement ou organisme";

  readonly DATE_REELLE_DE_VISITE: string = "Date réelle de visite";
  readonly DATE_REELLE_DE_RAPPORT: string = "Date réelle de rapport";
  readonly TYPE_DE_PLANIFICATION: string = "Type de planification";
  readonly MODALITE_DE_LA_MISSION: string = "Modalité de la mission";
  readonly TYPE_DE_MISSION: string = "Type de mission";
  readonly AFFICHER_PLUS: string = "Aficher plus";
  readonly AFFICHER_MOINS: string = "Afficher moins";

  // Bloc Autorisation médico-social
  readonly MISE_À_JOUR_AUTORISATION: string = "Mise à jour d’autorisation";
  readonly DERNIÈRE_INSTALLATION: string = "Dernière installation";
  readonly CAPACITÉ_INSTALLÉE: string = "Capacité installée";
  readonly CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS: string = "Capacité installée par activités médico-sociales";
  readonly NOMBRE_TOTAL_DE_PLACE: string = "Nombre total de places";
  readonly ACTIVITÉ: string = "Activité";

  // Bloc Autorisation Sanitaire
  readonly AUTRES_ACTIVITÉS: string = "Autres activités";
  readonly AUTRES_ACTIVITÉS_SAN: string = "Autres activités de soins";
  readonly CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS_SANITAIRE: string = "Capacité installée par activités sanitaires";
  readonly RECONNAISSANCES_CONTRACTUELLES: string = "Reconnaissances contractuelles";
  readonly ÉQUIPEMENTS_MATÉRIELS_LOURDS: string = "Équipements matériels lourds";
  readonly DATE_DE_FIN: string = "Date de fin";
  readonly DATE_DE_MISE_EN_OEUVRE: string = "Date de mise en oeuvre";
  readonly DATE_D_EFFET_ASR: ReactElement = (
    <>
      Date d’effet de l’
      {this.ASR}
      &nbsp;
    </>
  );
  readonly DATE_D_EFFET_CPOM: ReactElement = (
    <>
      Date d’effet du&nbsp;
      {this.CPOM}
      &nbsp;
    </>
  );
  readonly DATE_DE_FIN_CPOM: ReactElement = (
    <>
      Date de fin du&nbsp;
      {this.CPOM}
      &nbsp;
    </>
  );
  readonly NUMÉRO_CPOM: ReactElement = (
    <>
      Numéro de&nbsp;
      {this.CPOM}
      &nbsp;
    </>
  );
  readonly NUMÉRO_ARHGOS: string = "Numéro ARHGOS";
  readonly ACTIVITÉS: string = "Activités";
  readonly CHIRURGIE: string = "Chirurgie";
  readonly MÉDECINE: string = "Médecine";
  readonly OBSTÉTRIQUE: string = "Obstétrique";
  readonly SSR: string = "SSR";
  readonly USLD: string = "USLD";
  readonly PSYCHIATRIE: string = "Psychiatrie";
  readonly LITS: string = "Lits";
  readonly PLACES: string = "Places";

  // Bloc budget et finances
  readonly TITRE_BLOC_BUDGET_ET_FINANCES: string = "budget et finances";
  readonly MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE: string = "Montant de la contribution aux frais de siège et/ou de groupement";
  readonly MONTANT: string = "Montant";
  readonly TAUX_DE_VÉTUSTÉ_CONSTRUCTION: string = "Taux de vétusté construction";
  readonly RÉSULTAT_NET_COMPTABLE: string = "Résultat net comptable";
  readonly RATIO_DEPENDANCE_FINANCIERE: string = "Ratio de dépendance financière";
  readonly COMPTE_DE_RÉSULTAT_ERRD: string = "Compte de résultat ERRD";
  readonly COMPTE_DE_RÉSULTAT_CA: string = "Compte de résultat CA";
  readonly TITRE_BUDGÉTAIRE: string = "Titre budgétaire";
  readonly RECETTES: string = "Recettes";
  readonly DÉPENSES: string = "Dépenses";
  readonly CHARGES: string = "Charges";
  readonly PRODUITS: string = "Produits";
  readonly TOTAL: string = "Total";
  readonly GROUPE_I: string = "Groupe I";
  readonly GROUPE_II: string = "Groupe II";
  readonly GROUPE_III: string = "Groupe III";
  readonly TAUX_DE_CAF: string = "Taux de CAF";
  readonly FONDS_DE_ROULEMENT_NET_GLOBAL: string = "Fond de roulement net global";

  // Bloc Buget Finance Entite Juridique
  readonly TITRE_I: string = "Titre I";
  readonly TITRE_II: string = "Titre II";
  readonly TITRE_III: string = "Titre III";
  readonly TITRE_IV: string = "Titre IV";
  readonly ALLOCATION_DE_RESSOURCES: string = "Allocation de ressources";

  readonly POURCENTAGE: string = "Pourcentage";
  readonly REPARTITION_DES_ENVELOPPES: string = "Répartition des enveloppes";
  readonly REPARTITION_DES_SOUS_ENVELOPPES: string = "Répartition des sous-enveloppes";
  readonly REPARTITION_DES_MODES_DELEGATION: string = "Modes de délégation:";
  readonly COMPTE_DE_RÉSULTAT: string = "Compte de résultat";
  readonly COMPTE_DE_RÉSULTAT_CF: string = "Compte de résultat (CF)";
  readonly PRODUITS_PRINCIPAUX: string = "Produits principaux";
  readonly PRODUITS_ANNEXES: string = "Produits annexes";
  readonly CHARGES_ANNEXES: string = "Charges annexes";
  readonly CHARGES_PRINCIPALES: string = "Charges principales";
  readonly BUDGET_PRINCIPAL: string = "Budget Principal";
  readonly BUDGET_ANNEXE: string = "Budgets Annexes";

  readonly DAF: string = "DAF";
  readonly DOTATIONS_ACTIVITÉ: string = "Dotations activités";
  readonly DOTATIONS_DE_SOINS_USLD: string = "Dotations de soins USLD";
  readonly DOTATIONS_URGENCES: string = "Dotations urgences";
  readonly FIR: string = "FIR";
  readonly FORFAITS: string = "Forfaits";
  readonly MIGAC: string = "MIGAC";
  readonly ODMCO: string = "ODMCO";
  readonly ODSV: string = "ODSV";
  readonly OGD_PA: string = "OGD PA";
  readonly OGD_PH: string = "OGD PH";
  readonly OBJECTIF_QUANTIFIÉ_NATIONAL: string = "Objectif Quantifié National";

  // Bloc ressources humaines
  readonly TITRE_BLOC_RESSOURCES_HUMAINES: string = "Ressources humaines";
  readonly NOMBRE_D_ETP_TOTAL_RÉALISÉ: ReactElement = (
    <>
      Nombre d’<abbr title="Équivalent Temps Plein">ETP</abbr> Total réalisé
    </>
  );
  readonly NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION: string = "Nombre d’ETP Total réalisé";
  readonly NOMBRE_D_ETP_PM: string = "Nombre d’ETP PM"
  readonly NOMBRE_D_ETP_PNM: string = "Nombre d’ETP PNM"
  readonly TAUX_DE_ROTATION_DU_PERSONNEL: string = "Taux de rotation du personnel sur effectifs réels";
  readonly TAUX_D_ABSENTÉISME: string = "Taux d’absentéisme";
  readonly TAUX_D_ABSENTÉISME_HORS_FORMATION: (taux: string, enErreur: boolean, tauxNul: boolean) => ReactElement = (
    taux: string,
    enErreur: boolean,
    tauxNul: boolean
  ) => (
    <p>
      Taux hors formation = <span className={enErreur ? "fr-text--bold fr-text-default--error" : "fr-text--bold"}>{taux}</span>
      {!tauxNul && ", dont"}
    </p>
  );
  readonly TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_COURTE_DURÉE: string = "Pour maladie ordinaire / de courte durée";
  readonly TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_MOYENNE_DURÉE: string = "Pour maladie de moyenne durée";
  readonly TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_LONGUE_DURÉE: string = "Pour maladie de longue durée";
  readonly TAUX_D_ABSENTÉISME_POUR_MATERNITÉ_PATERNITÉ: string = "Pour maternité / paternité";
  readonly TAUX_D_ABSENTÉISME_POUR_CONGÉS_SPÉCIAUX: string = "Pour congés spéciaux dont les congés sans solde (hors congés payés)";
  readonly TAUX_D_ABSENTÉISME_POUR_MALADIE_PROFESSIONNELLE: string = "Pour accident du travail / maladie professionnelle";
  readonly MOTIF_DU_TAUX_D_ABSENTÉISME: string = "Type";
  readonly JOURS_ABSENTEISME_PM: string = "Jour d’absentéisme PM"
  readonly JOURS_ABSENTEISME_PNM: string = "Jour d’absentéisme PNM"
  readonly TAUX: string = "Taux";
  readonly NOMBRE_DE_CDD_DE_REMPLACEMENT: ReactElement = (
    <>
      Nombre de <abbr title="Contrat à Durée Déterminée">CDD</abbr> de remplacement
    </>
  );
  readonly NOMBRE_DE_CDD_DE_REMPLACEMENT_SANS_ABRÉVIATION: string = "Nombre de CDD de remplacement";
  readonly TAUX_D_ETP_VACANTS_AU_31_12: string = "Taux d’ETP vacants au 31/12";
  readonly TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES: string = "Taux de prestations externes sur les prestations directes";
  readonly DEPENSES_INTERIM_PM: string = "Dépenses d’intérim PM"

  // Liste des établissements rattachés
  readonly ÉTABLISSEMENT_TERRITORIAL: string = "Établissement territorial";
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS: string = "Les établissements rattachés";
  readonly ÉTABLISSEMENTS_RATTACHÉS: string = "établissement(s) rattaché(s)";
  readonly DOMAINE_MEDICAUX_SOCIAL: string = "Social et médico-social";
  readonly DOMAINE_SANITAIRE: string = "Sanitaire";
  readonly AUCUN_ÉTABLISSEMENTS_RATTACHÉS: string = "Aucun établissement rattaché";
  readonly VOIR_TOUS_LES_ET: string = "Voir tous les établissements rattachés";
  readonly VOIR_MOINS_ET: string = "Voir moins d'établissements rattachés";

  // Sources longues
  readonly FINESS_TITLE: string = "Fichier National des Établissements Sanitaires et Sociaux";
  readonly DIAMANT_TITLE: string = "Décisionnel Inter ARS pour la Maîtrise et ANTicipation";
  readonly CNSA_TITLE: string = "Caisse Nationale de Solidarité pour l’Autonomie";
  readonly ANCRE_TITLE: string = "Application Nationale Compte financier Rapport infra-annuel Eprd";
  readonly HAPI_TITLE: string = "HArmonisation et Partage d'Information (Autres champs)";
  readonly TDB_PERF_TITLE: string = "Tableau de Bord de la Performance dans le secteur médico-social";
  readonly PMSI_TITLE: string = "Programme de Médicalisation des Systèmes d’Information";
  readonly ARHGOS_TITLE: string = "Agence Régionale Hospitalière Gestion des Objectifs Sanitaires";
  readonly SAE_TITLE: string = "Statistique Annuelle des Établissements de santé";
  readonly RPU_TITLE: string = "Résumé de Passage aux Urgences";
  readonly SIREC_TITLE: string = "Système d'Information Réclamations (SI REC)";
  readonly SIVSS_TITLE: string = "Système d'Information de Veille et de Sécurité Sanitaire (SI VSS)";
  readonly SIICEA_TITLE: string = "Système d'Information pour les Inspections Contrôles Evaluations et Audits (SIICEA)";
  readonly VIGIE_RH_TITLE: string = "texte ... (VIGIE RH)";

  // Sources courtes
  readonly FINESS: ReactElement = (<abbr title={this.FINESS_TITLE}>FINESS</abbr>);
  readonly DIAMANT: ReactElement = (<abbr title={this.DIAMANT_TITLE}>DIAMANT</abbr>);
  readonly CNSA: ReactElement = (<abbr title={this.CNSA_TITLE}>CNSA</abbr>);
  readonly ANCRE: ReactElement = (<abbr title={this.ANCRE_TITLE}>ANCRE</abbr>);
  readonly HAPI: ReactElement = (<abbr title={this.HAPI_TITLE}>HAPI</abbr>);
  readonly TDB_PERF: ReactElement = (<abbr title={this.TDB_PERF_TITLE}>TdB Perf</abbr>);
  readonly PMSI: ReactElement = (<abbr title={this.PMSI_TITLE}>PMSI</abbr>);
  readonly ARHGOS: ReactElement = (<abbr title={this.ARHGOS_TITLE}>ARHGOS</abbr>);
  readonly SAE: ReactElement = (<abbr title={this.SAE_TITLE}>SAE</abbr>);
  readonly RPU: ReactElement = (<abbr title={this.RPU_TITLE}>RPU</abbr>);
  readonly SIREC: ReactElement = (<abbr title={this.SIREC_TITLE}>SIREC</abbr>);
  readonly SIVSS: ReactElement = (<abbr title={this.SIVSS_TITLE}>SIVSS</abbr>);
  readonly SIICEA: ReactElement = (<abbr title={this.SIICEA_TITLE}>SIICEA</abbr>);
  readonly VIGIE_RH: ReactElement = (<abbr title={this.VIGIE_RH_TITLE}>VIGIE RH</abbr>);

  // Inaccessible
  readonly ACCÈS_REFUSÉ: string = "Accès refusé";

  // Erreur
  readonly PAGE_NON_TROUVÉE_404: string = "Page non trouvée";
  readonly CODE_ERREUR_404: string = "Erreur 404";
  readonly SOUS_TITRE_ERREUR_404: string = "La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.";
  readonly DESCRIPTION_ERREUR_404: ReactElement = (
    <>
      Si vous avez tapé l’adresse web dans le navigateur, vérifiez qu’elle est correcte. La page n’est peut-être plus disponible.
      <br />
      Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d’accueil, ou effectuer une recherche avec notre moteur de recherche en haut de
      page.
      <br />
      Si vous avez besoin d’une aide, merci de nous contacter.
    </>
  );
  readonly ERREUR_INATTENDUE_500: string = "Erreur inattendue";
  readonly CODE_ERREUR_500: string = "Erreur 500";
  readonly SOUS_TITRE_ERREUR_500: string = "Désolé, le service rencontre un problème. Nous travaillons pour le résoudre le plus rapidement possible.";
  readonly DESCRIPTION_ERREUR_500: ReactElement = (
    <>
      Essayez de rafraîchir la page ou bien ressayez plus tard.
      <br />
      Si vous avez besoin d’une aide, merci de nous contacter.
    </>
  );

  // Footer
  readonly LEGIFRANCE: string = "legifrance.gouv.fr";
  readonly GOUVERNEMENT: string = "gouvernement.fr";
  readonly SERVICE_PUBLIC: string = "service-public.fr";
  readonly DATA_GOUV: string = "data.gouv.fr";
  readonly ACCESSIBILITÉ: string = "Accessibilité";
  readonly NON_CONFORME: string = "non conforme";
  readonly MENTIONS_LÉGALES: string = "Mentions légales";
  readonly DONNÉES_PERSONNELLES: string = "Données personnelles";
  readonly NOUS_CONTACTER: string = "Nous contacter";
  readonly MENTION_LICENCE: string = "Sauf mention contraire, tous les contenus de ce site sont sous ";
  readonly LICENCE_ETALAB: string = "licence etalab-2.0";
  readonly NOUVELLE_FENÊTRE: string = "nouvelle Fenêtre";
  readonly ECO_CONCEPTION: string = "Eco-Conception";
  readonly COOKIES: string = "Gestion des Cookies";

  // Accessibilité
  readonly AUDIT_EN_COURS: string = "Audit en cours de réalisation.";

  // Données personnelles
  readonly FINALITÉ_ET_FONDEMENT_DU_TRAITEMENT: string = "Finalité et fondement du traitement";
  readonly PROTECTION_DES_DONNÉES_PERSONNELLES: string = "Vos droits en matière de données personnelles";

  // Mentions légales
  readonly ÉDITEUR_DU_SITE: string = "Éditeur du site";
  readonly PROPRIÉTÉ_INTELLECTUELLE: string = "Propriété intellectuelle";
  readonly LIMITES_DE_RESPONSABILITÉ: string = "Limites de responsabilité";

  readonly EN_CONSTRUCTION: string = "Demander à Daisy ce que l’on doit écrire.";

  // Comparaison
  readonly COMPARAISON: string = "Comparaison";
  readonly AJOUTER_DES_ETABLISSEMENTS: string = "+ Ajouter des établissements";
  readonly COMPARAISON_AUCUN_FINESS: string = "Veuillez ajouter des établissements dans la sélection de la comparaison depuis la recherche.";
  readonly ALERTE_TYPE_DIFFERENT_TITRE: string = "Message d'information";
  readonly ALERTE_TYPE_DIFFERENT_CORPS: string = "Votre sélection comprend plus de 30 000 établissements. Réduisez votre sélection pour lancer la comparaison.";
  // Favoris
  readonly FAVORIS_LIST: string = "Mes listes";
  readonly FAVORIS_LIST_TITLE: string = "Liste de favoris";
  readonly ACTIONS: string = "Actions";
  readonly COMPARER: string = "Comparer";
  readonly SUPPRIMER_DE_LA_LISTE: string = "Supprimer de ma liste";
  readonly EXPORTER: string = "Exporter";
  readonly DANS_FAVORIS: string = "Dans les favoris";
  readonly NON_FAVORIS: string = "Pas dans les favoris";
  readonly IMPORTER_UNE_LISTE: string = "Importer une liste";
  readonly IMPORTER_DES_ETABLISSEMENTS: string = "Importer une liste";


  // Etoile des Favoris
  readonly ETOILE_ETAB_DANS_LISTE: string = "Gèrer les listes de l'établissement";
  readonly ETOILE_ETAB_PAS_DANS_LISTE: string = "Ajouter cet établissement à mes listes";
  readonly ETOILE_MES_LISTES: string = "Mes listes";
  readonly ETOILE_NOUVELLE_LISTE_LABEL: string = "Nouvelle liste";
  readonly ETOILE_NOUVELLE_LISTE_BOUTON: string = "+ Nouvelle liste";
  readonly ETOILE_MAX_LISTE_ATTEINT: string = "Votre liste ne peut pas être créée. Vous avez atteint le nombre maximum de 10 listes.";
  readonly ETOILE_ERREUR_MODIF_ETAB: string = "Votre enregistrement n’a pas été pris en compte, veuillez réessayer.";

  // Nouveau Favoris
  readonly LIST_ACTION_FAVORIS_SUCCESS_MESSAGE: (list: string) => string = (list: string) => `Vos établissements ont été ajoutés avec succès à la liste ${list}.`;

  // Import d'une liste de finess dans une liste de Favoris
  readonly IMPORT_LIST_FINESS_ERROR_MESSAGE: (nbError: number) => string = (nbError: number) => {
    if (nbError > 1) {
      return `Aucun résultat pour les ${nbError} numéros FINESS indiqués en rouge. Veuillez vérifier votre saisie.`;
    } else {
      return "Aucun résultat pour le numéro FINESS indiqué en rouge. Veuillez vérifier votre saisie.";
    }
  };
  readonly IMPORT_LIST_SELECTOR: string = "Importer dans une nouvelle liste ou une liste existante";
  readonly IMPORT_MAX_LISTE_ATTEINT: string = "Votre liste ne peut pas être créée. Vous avez atteint le nombre maximum de 10 listes.";
  readonly IMPORT_NOUVELLE_LISTE_BOUTON: string = "+ Nouvelle liste";
  readonly IMPORT_SUCCESS_TITLE: string = "Succès";
  readonly IMPORT_SUCESS_MESSAGE: string = "Les modifications ont bien été enregistrées";
  readonly IMPORT_LIST_ERREUR_IMPORT: string = "Votre enregistrement n’a pas été pris en compte, veuillez réessayer.";
  readonly IMPORT_LIST_FINESS_HEADER: string = "N° Finess";
  readonly IMPORT_LIST_RS_HEADER: string = "Raison sociale";
  readonly IMPORT_LIST_TEXT_PLACEHOLDER: string = "Le numéro FINESS est composé de 9 caractères alphanumérique. Veuillez saisir un numéro par ligne sans espace, ni ponctuation.";
  readonly IMPORT_LIST_TITLE: string = "Importer des établissements";
  readonly IMPORT_LIST_CANCEL_LABEL: string = "Annuler";
  readonly IMPORT_LIST_OK_VALIDATE_LABEL: string = "Valider";
  readonly IMPORT_LIST_OK_VERIFY_LABEL: string = "Vérifier";
  readonly IMPORT_LIST_OK_IMPORT_LABEL: string = "Importer";


  // Mot de passe oublié
  readonly MOT_PASSE_OUBLIE_TITRE: string = "Vous avez oublié votre mot de passe ?";
  readonly MOT_PASSE_OUBLIE_LABEL: string = "Courriel";
  readonly MOT_PASSE_OUBLIE_SUCCESS_MESSAGE: string = "Un courriel a été envoyé à ";

  // Changement de mot de passe
  readonly CHANGEMENT_MOT_PASSE_TITRE: string = "Mot de passe";
  readonly CHANGEMENT_MOT_PASSE_DESCRIPTION: string = "Pour modifier votre mot de passe actuel, merci de renseigner les champs suivants";
  readonly OLD_MOT_DE_PASSE: string = "Ancien mot de passe";
  readonly OLD_MOT_DE_PASSE_REINITIALISATION: string = "Mot de passe précédemment utilisé. Merci de renseigner un nouveau mot de passe unique.";
  readonly MOT_DE_PASSE: string = "Nouveau mot de passe";
  readonly CONFIRMER_MOT_DE_PASSE: string = "Confirmation mot de passe";
  readonly CONFIRM_CHANGE_PASSWORD: string = "Confirmer la demande de réinitialisation";
  readonly CONFIRM_CREATE_PASSWORD: string = "Confirmer la demande de création";
  readonly INVALID_PASSWORD_MESSAGE: string = "Mot de passe invalide. Le mot de passe doit être composé d'au moins 12 caractères dont: 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1 caractère spécial parmi !@#$%^&* .";

  // Historique de recherche
  readonly HISTORIQUE_DE_RECHERECHE_TITRE: string = "Historique des derniers établissements consultés";
  readonly ETABLISSEMENT_CONSULTE: string = "Etablissements consultés";
  readonly DATE: string = "Date";
  readonly CONFIRM_UPDATE_PASSWORD: string = "Confirmer la modification du mot de passe";
  readonly REINITIALISATION_MOT_PASSE_TITRE: string = "Réinitialisation de votre mot de passe";
  readonly CREATION_MOT_PASSE_TITRE: string = "Création de votre mot de passe";
  readonly REINITIALISATION_MOT_PASSE_DESCRIPTION: string = "Merci de renseigner votre nouveau mot de passe";
  readonly DIFFERENT_MOT_PASSE: string = "Le mot de passe doit être différent du mot de passe actuel";
  readonly WRONG_OLD_MOT_DE_PASSE: string = "Ancien mot de passe erroné";

  readonly PARAMETRAGE_TITRE: string = "Paramétrage";
  readonly PARAMETRAGE_AUTORISATIONS_TITRE: string = "Paramétrage des autorisations";
  readonly PARAMETRAGE_AIDE_TITRE: string = "Paramétrage de l'aide";
  readonly PARAMETRAGE_EJ_TAB: string = "Entité juridique";
  readonly PARAMETRAGE_ET_MS_TAB: string = "Établissement médico-social";
  readonly PARAMETRAGE_ET_SAN_TAB: string = "Établissement sanitaire";
  readonly PARAMETRAGE_INSTITUTION: string = "Institution";
  readonly PARAMETRAGE_AUTRE_REGION: string = "Autre région";
  readonly PARAMETRAGE_NEW_PROFILE: string = "Ajouter une autorisation";
  readonly CREATED_BY: string = "Créée par";
  readonly CREATION_DATE: string = "Date de création";
  readonly PROFILE_CODE: string = "Code";
  readonly PROFILE_TITLE: string = "Libellé de l'autorisation";
  readonly VOUS_NAVEZ_AUCUN_PROFIL: string = "Vous n'avez aucun profil";
  readonly PROJECT_TEAM: string = "Équipe projet";

  //  Profile page
  readonly USER_PROFILE: string = "Mes informations";
  readonly MON_COMPTE: string = "Mon compte";
  readonly FIRSTNAME: string = "Prénom";
  readonly LASTNAME: string = "Nom";
  readonly EMAIL: string = "Email";
  readonly ORGANIZATION: string = "Institution";
  readonly ROLE: string = "Rôle";
  readonly SUPER_ADMIN: string = "Administrateur national";
  readonly ADMIN_REGIONAL: string = "Administrateur régional";
  readonly ADMINISTRATION_CENTRALE: string = "Administration centrale";
  readonly USER: string = "Utilisateur";
  readonly PROFILE: string = "Autorisation";

  // Utilisateur page
  readonly STATUS: string = "Status";
  readonly MODIFICATION_DATE: string = "Date de modification";
  readonly AUCUN_ELEMENT_TROUVE: string = "Aucun élément trouvé";
  readonly ROLE_: string = "Rôle";
  readonly PAGE_UTILISATEUR_TITRE: string = "Liste des utilisateurs";
  readonly INSTITUTION: string = "Institution";
  readonly PAGE_EDIT_UTILISATEUR_TITRE: string = "Modifier utilisateur";
  readonly ADMIN_PAGE: string = "Console d’administration";

  //Blocs
  readonly TOUT_REPLIER: string = "Tout replier";
  readonly TOUT_DEPLIER: string = "Tout déplier";

  //Filtre recherche avancée
  //--Filtre Structure
  readonly ENTITES_JURIDIQUES: string = "Entités Juridiques";
  readonly ETABLISSEMENTS_SANITAIRES: string = "Etablissements Sanitaires";
  readonly ETABLISSEMENTS_SOCIAUX_MEDICO_SOCIAUX: string = "Etablissements Sociaux et Médico-Sociaux";
  readonly STATUT_JURIDIQUE_PUBLIC: string = "PUBLIC";
  readonly STATUT_JURIDIQUE_PRIVE_LUCRATIF: string = "PRIVÉ LUCRATIF";
  readonly STATUT_JURIDIQUE_PRIVE_NON_LUCRATIF: string = "PRIVÉ NON LUCRATIF";
  //--Filtre capacité
  readonly CAPACITE_INITIALE: string = "Capacité installée (en places)";
  readonly ETABLISSEMENT_PUBLIC_HANDICAP: string = "Etablissements pour Publics en Situation de Handicap";
  readonly ETABLISSEMENT_PERSONNE_AGEES: string = "Etablissements pour Personnes Agées";
  readonly CAPACITE_INSTALLEE_EN_PLACE: string = "(capacité installée en places)";
  readonly TITRE_CAPACITE_PERSONNES_SITUATION_HANDICAP: string = "Détails liés aux Etablissements pour public en situation de handicap";
  readonly TITRE_CAPACITE_PERSONNES_AGEES: string = "Détails liés aux Etablissements pour personnes âgées";
  // Bouton de selection de tous les rechercheNombreRésultats
  readonly TOUT_SELECTIONNER: string = "Tout sélectionner";
  readonly TOUT_DESELECTIONNER: string = "Tout désélectionner";
  // Filtre Activité SAN
  readonly FA_MCO: string = "Médecine Chirurgie Obstétrique";
  readonly FA_PSY: string = "Psychiatrie";
  readonly FA_SSR: string = "Soins de Suite et de Réadaptation";
  readonly FA_USLD: string = "Unité de Soins Longue Durée";
  readonly FA_SEJOURS_ANN: string = "(nombre de séjours - annuel)";
  readonly FA_JOURS_ANN: string = "(nombre de jours - annuel)";
  //Comparaison
  readonly TITRE_AJOUTER_DES_ETABLISSEMENTS: string = "Ajouter un ou plusieurs établissements";
  readonly LIBELLE_AJOUTER_DES_ETABLISSEMENTS: string = "A partir d'une recherche";
  readonly LIBELLE_AJOUTER_DES_ETABLISSEMENTS_LISTE: string = "A partir d'une liste existante";

  //Page d’une liste de favoris
  readonly LISTE_DE_FAVORIS = "Liste de favoris";
  readonly LISTE_NON_TROUVÉE = "Liste non trouvée";
  //Callout page d'acceuil
  readonly NOUVEAU: string = "NOUVEAU";
  readonly NOUVELLES_FONCTIONNALITÉS: string = "Nouvelles fonctionnalités disponibles";

  //Vigie RH
  readonly INDICATEURS_HELIOS_BLOC_TITLE: string = "Indicateurs issus du TdB Performance et de la CNSA";
  readonly INDICATEURS_VIGIERH_BLOC_TITLE: string = "Indicateurs issus de la Déclaration Sociale Nominative";
  readonly PYRAMIDE_DES_AGES: string = "Pyramide des âges";
  readonly TRANCHE_AGE: string = "Tranche d'âge";
  readonly EFFECTIF_FEMMES: string = "Effectif des femmes";
  readonly EFFECTIF_FEMMES_REF: string = "Effectif de référence des femmes";
  readonly EFFECTIF_HOMMES: string = "Effectif des hommes";
  readonly EFFECTIFS: string = "Effectifs";
  readonly EFFECTIFS_TOTAUX: string = "Total";
  readonly VIGIE_RH_CATEGORIE: string = "Catégorie";
  readonly EFFECTIF_HOMMES_REF: string = "Effectif de référence des hommes";
  readonly DEPARTS_EMBAUCHES: string = "Départs / Embauches";
  readonly DEPARTS: string = "Départs";
  readonly EMBAUCHES: string = "Embauches";
  readonly DEPARTS_REF: string = "Moyenne des départs";
  readonly EMBAUCHES_REF: string = "Moyenne des embauches";
  readonly MOYENNE_REF: string = "Moyenne des établissements similaires";
  readonly TAUX_ROTATION: string = "Taux de Rotation";
  readonly REPARTITION_EFFECTIFS: string = "Répartition des effectifs";
  readonly TAUX_ROTATION_REFERENCE: string = "Taux de Rotation de référence";
  readonly TOP_TAUX_ROTATION_TITLE: string = "Mouvements de personnel";

  readonly MOIS_ANNEES: string = "Mois / Années";
  readonly NOUVELLES_FONCTIONNALITÉS_TEXT: string = "La comparaison évolue!";
  readonly NOUVELLES_FONCTIONNALITÉS_TEXT_2: string = " La fonctionnalité est disponible pour toutes les catégories d'établissements.";

}


