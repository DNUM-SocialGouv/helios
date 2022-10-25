import { ReactElement } from 'react'

import { Wording } from './Wording'

export class WordingFr implements Wording {
  // Abréviations
  readonly CPOM_TITLE: string = 'Contrat Pluriannuel d’Objectifs et de Moyens'
  readonly CPOM: ReactElement = (<abbr title={this.CPOM_TITLE}>CPOM</abbr>)
  readonly ASR_TITLE: string = 'Activités Soumises à Reconnaissance contractuelle'
  readonly ASR: ReactElement = (<abbr title={this.ASR_TITLE}>ASR</abbr>)

  // Header
  readonly INTITULÉ_RÉPUBLIQUE_FRANÇAISE: ReactElement = (
    <>
      République
      <br />
      Française
    </>
  )
  readonly ACCUEIL: string = 'Accueil'
  readonly MENU: string = 'Menu'
  readonly DÉCONNEXION: string = 'Déconnexion'
  readonly FERMER: string = 'Fermer'
  readonly TITRE_DU_SITE: string = 'Fiche de synthèse - Helios'

  // Titre des pages
  readonly TITRE_PAGE_ACCUEIL: string = 'Accueil - Helios'
  readonly TITRE_PAGE_PLAN_DU_SITE: string = 'Plan du site - Helios'
  readonly TITRE_PAGE_ACCESSIBILITÉ: string = 'Accessibilité - Helios'
  readonly TITRE_PAGE_MENTIONS_LÉGALES: string = 'Mentions légales - Helios'
  readonly TITRE_PAGE_DONNÉES_PERSONNELLES: string = 'Données personnelles - Helios'
  readonly TITRE_PAGE_GESTION_COOKIES: string = 'Gestion des cookies - Helios'
  readonly TITRE_PAGE_INACCESSIBLE: string = 'Accès refusé - Helios'

  // Breadcrumb
  readonly VOUS_ÊTES_ICI: string = 'Vous êtes ici :'
  readonly VOIR_LE_FIL_D_ARIANE: string = 'Voir le fil d’Ariane'
  readonly ENTITÉ_JURIDIQUE: string = 'Entité juridique'
  readonly régionBreadcrumb: (placeholder: string) => string = (placeholder: string) => `Région ${placeholder}`

  // Home
  readonly TITRE_LISTE_DES_ENTITÉS_JURIDIQUES: string = 'Les entités juridiques'
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_TERRITORIAUX: string = 'Les établissements territoriaux'
  readonly ENTITÉS_JURIDIQUES: string = 'Entité(s) Juridique(s)'
  readonly ÉTABLISSEMENT_TERRITORIAUX: string = 'Établissements Territoriaux'
  readonly SITE_EN_CONSTRUCTION: string = 'Le site est dans sa phase pilote : il est toujours en construction et va évoluer régulièrement.'

  // Recherche
  readonly RECHERCHE_TITRE: string = 'Bienvenue sur Helios !'
  readonly RECHERCHE_DESCRIPTION: ReactElement = (
    <>
      Accédez rapidement et simplement à la fiche de synthèse d’un établissement géographique
      <br />
      ou d’une entité juridique.
    </>
  )
  readonly RECHERCHE_PLACEHOLDER: string = 'Rechercher un numéro FINESS ou le nom d’un établissement'
  readonly RECHERCHE_LABEL: string = 'Rechercher'
  readonly RÉSULTAT_DE_RECHERCHE: string = 'Résultat de recherche'
  readonly rechercheNombreRésultats: (nombre: number, terme: string) => string = (nombre, terme: string) =>
    `${nombre} résultat(s) correspond(ent) à votre recherche « ${terme} ».`
  readonly RECHERCHE_EN_ATTENTE: string = 'En cours de recherche...'
  readonly aucunRésultat: (terme: string) => string = (terme: string) =>
    `Aucun résultat ne correspond à votre recherche « ${terme} ».`
  readonly ERREUR_TECHNIQUE: string = 'Veuillez nous excuser, nous venons de rencontrer une erreur technique. Nous vous invitons à effectuer une nouvelle recherche plus tard.'
  readonly VOIR_PLUS_RÉSULTATS: string = 'Voir plus de résultats'

  // Cartographie
  readonly CARTOGRAPHIE: string = 'Cartographie'
  readonly OFFRE_SANTÉ_PAR_REGION: string = 'Offre de santé par région'
  readonly CARTOGRAPHIE_DESCRIPTION: string = 'Visualisez l’offre de santé d’une région en retrouvant tous les établissements de votre choix.'

  // Région
  readonly régionAtlasSanté: (placeholder: string) => string = (placeholder: string) => `Carte de ${placeholder}`

  // Fiches
  readonly miseÀJour: (date: string) => string = (date: string): string => `Mise à jour : ${date}`
  readonly miseÀJourEtSource: (date: string, source: ReactElement) => ReactElement = (date: string, source: ReactElement): ReactElement => <>
    {this.miseÀJour(date)}
    {' - '}
    Source :
    {' '}
    {source}
  </>
  readonly NON_RENSEIGNÉ: string = 'Non renseigné'
  readonly OUI: string = 'Oui'
  readonly NON: string = 'Non'
  readonly DÉTAILS: string = 'Détails'
  readonly TÉLÉCHARGER_EN_PDF: string = 'Télécharger en PDF'

  // Info bulle
  readonly ÉLÉMENTS_DE_COMPRÉHENSION: string = 'Éléments de compréhension'
  readonly FRÉQUENCE: string = 'Fréquence'
  readonly MODE_DE_CALCUL: string = 'Mode de calcul'
  readonly SOURCES: string = 'Sources'
  readonly INFOS_COMPLÉMENTAIRES: string = 'Informations complémentaires'

  // Indicateurs
  readonly AFFICHER_LA_TRANSCRIPTION: string = 'Afficher la transcription'
  readonly ANNÉE: string = 'Année'
  readonly INDICATEURS_VIDES: string = 'Aucune donnée pour cet établissement.'
  readonly AUCUNE_DONNÉE_RENSEIGNÉE: string = 'Aucune donnée renseignée pour les années suivantes :'

  // Bloc Identité
  readonly TITRE_BLOC_IDENTITÉ: string = 'fiche d’identité'
  readonly NOM_DE_L_ÉTABLISSEMENT: string = 'Nom de l’établissement'
  readonly NUMÉRO_FINESS: string = 'Numéro FINESS'
  readonly ADRESSE: string = 'Adresse'
  readonly TÉLÉPHONE: string = 'Téléphone'
  readonly TÉLÉPHONE_ET_EMAIL: string = 'Téléphone et e-mail'
  readonly STATUT_JURIDIQUE: string = 'Statut juridique'
  readonly STATUT_JURIDIQUE_EJ: string = 'Statut juridique de l’EJ'
  readonly DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM: ReactElement = (
    <>
      {'Date d’entrée en vigueur du '}
      {this.CPOM}
    </>
  )
  readonly ENTITÉ_JURIDIQUE_DE_RATTACHEMENT: string = 'Entité juridique de rattachement'
  readonly CATÉGORIE_DE_L_ÉTABLISSEMENT: string = 'Catégorie de l’établissement'
  readonly MONO_ÉTABLISSEMENT: string = 'Mono-établissement'
  readonly ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE: string = 'Établissement Principal/Secondaire'
  readonly PRINCIPAL: string = 'Principal'
  readonly SECONDAIRE: string = 'Secondaire'
  readonly SITE_INTERNET: string = 'Site internet'

  // Bloc Activité Médico-Social
  readonly TITRE_BLOC_ACTIVITÉ: string = 'activité'
  readonly TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT: string = 'Taux d’occupation en hébergement permanent'
  readonly TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE: string = 'Taux d’occupation en hébergement temporaire'
  readonly TAUX_OCCUPATION_ACCUEIL_DE_JOUR: string = 'Taux d’occupation en accueil de jour'
  readonly TAUX_RÉALISATION_ACTIVITÉ: string = 'Taux de réalisation de l’activité'
  readonly FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES: string = 'File active des personnes accompagnées sur la période'
  readonly NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES: string = 'Nombre moyen de journées d’absence des personnes accompagnées sur la période'
  readonly DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES: string = 'Durée moyenne de séjour/d’accompagnement des personnes sorties définitivement au cours de l’année (en nombre de jours)'
  readonly NOMBRE_DE_PASSAGES_AUX_URGENCES: string = 'Nombre de passages aux urgences'

  // Bloc Activité Sanitaire
  readonly NOMBRE_DE_SÉJOUR_MCO: string = 'Nombre de séjours Médecine, Chirurgie et Obstétrique en Hospitalisation Complète et Hospitalisation Partielle par année (si applicable)'
  readonly TOTAL_HOSPITALISATION_MÉDECINE: string = 'Total Hospitalisation Médecine'
  readonly TOTAL_HOSPITALISATION_CHIRURGIE: string = 'Total Hospitalisation Chirurgie'
  readonly TOTAL_HOSPITALISATION_OBSTÉTRIQUE: string = 'Total Hospitalisation Obstétrique'
  readonly HOSPITALISATION_PARTIELLE_MÉDECINE: string = 'Hospitalisation Partielle Médecine'
  readonly HOSPITALISATION_COMPLÈTE_MÉDECINE: string = 'Hospitalisation Complète Médecine'
  readonly HOSPITALISATION_PARTIELLE_CHIRURGIE: string = 'Hospitalisation Partielle Chirurgie'
  readonly HOSPITALISATION_COMPLÈTE_CHIRURGIE: string = 'Hospitalisation Complète Chirurgie'
  readonly HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE: string = 'Hospitalisation Partielle Obstétrique'
  readonly HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE: string = 'Hospitalisation Complète Obstétrique'
  readonly TOTAL_HOSPITALISATION_SSR: string = 'Total Hospitalisation SSR'
  readonly TOTAL_HOSPITALISATION_PSY: string = 'Total Hospitalisation PSY'
  readonly NOMBRE_DE_JOURNÉES_PSY_ET_SSR: string = 'Nombre de journées PSY et SSR en Hospitalisation Complète et Hospitalisation Partielle par année (si applicable)'
  readonly HOSPITALISATION_PARTIELLE_SSR: string = 'Hospitalisation Partielle SSR'
  readonly HOSPITALISATION_COMPLÈTE_SSR: string = 'Hospitalisation Complète SSR'
  readonly HOSPITALISATION_PARTIELLE_PSY: string = 'Hospitalisation Partielle PSY'
  readonly HOSPITALISATION_COMPLÈTE_PSY: string = 'Hospitalisation Complète PSY'

  // Bloc Autorisation
  readonly TITRE_BLOC_AUTORISATION_ET_CAPACITÉ: string = 'autorisation et capacité'
  readonly AUTORISATIONS: string = 'Autorisations'
  readonly DATE_D_AUTORISATION: string = 'Date d’autorisation'
  readonly CAPACITÉ_AUTORISÉE: string = 'Capacité autorisée'

  // Bloc Autorisation médico-social
  readonly MISE_À_JOUR_AUTORISATION: string = 'Mise à jour d’autorisation'
  readonly DERNIÈRE_INSTALLATION: string = 'Dernière installation'
  readonly CAPACITÉ_INSTALLÉE: string = 'Capacité installée'
  readonly CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS: string = 'Capacité installée par activités'
  readonly NOMBRE_TOTAL_DE_PLACE: string = 'Nombre total de places'
  readonly ACTIVITÉ: string = 'Activité'

  // Bloc Autorisation Sanitaire
  readonly AUTRES_ACTIVITÉS: string = 'Autres activités'
  readonly RECONNAISSANCES_CONTRACTUELLES: string = 'Reconnaissances contractuelles'
  readonly ÉQUIPEMENTS_MATÉRIELS_LOURDS: string = 'Équipements matériels lourds'
  readonly DATE_DE_FIN: string = 'Date de fin'
  readonly DATE_DE_MISE_EN_OEUVRE: string = 'Date de mise en oeuvre'
  readonly DATE_D_EFFET_ASR: ReactElement = (
    <>
      Date d’effet de l’
      {this.ASR}
      &nbsp;
    </>)
  readonly DATE_D_EFFET_CPOM: ReactElement = (<>
    Date d’effet du&nbsp;
    {this.CPOM}
    &nbsp;
  </>)
  readonly DATE_DE_FIN_CPOM: ReactElement = (<>
    Date de fin du&nbsp;
    {this.CPOM}
    &nbsp;
  </>)
  readonly NUMÉRO_CPOM: ReactElement = (<>
    Numéro de&nbsp;
    {this.CPOM}
    &nbsp;
  </>)
  readonly NUMÉRO_ARHGOS: string = 'Numéro ARHGOS'
  readonly ACTIVITÉS: string = 'Activités'
  readonly CHIRURGIE: string = 'Chirurgie'
  readonly MÉDECINE: string = 'Médecine'
  readonly OBSTÉTRIQUE: string = 'Obstétrique'
  readonly SSR: string = 'SSR'
  readonly USLD: string = 'USLD'
  readonly PSYCHIATRIE: string = 'Psychiatrie'
  readonly LITS: string = 'Lits'
  readonly PLACES: string = 'Places'

  // Bloc budget et finances
  readonly TITRE_BLOC_BUDGET_ET_FINANCES: string = 'budget & finances'
  readonly MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE: string = 'Montant de la contribution aux frais de siège et/ou de groupement'
  readonly MONTANT: string = 'Montant'
  readonly TAUX_DE_VÉTUSTÉ_CONSTRUCTION: string = 'Taux de vétusté construction'
  readonly RÉSULTAT_NET_COMPTABLE: string = 'Résultat net comptable'
  readonly COMPTE_DE_RÉSULTAT_ERRD: string = 'Compte de résultat ERRD'
  readonly COMPTE_DE_RÉSULTAT_CA: string = 'Compte de résultat CA'
  readonly TITRE_BUDGÉTAIRE: string = 'Titre budgétaire'
  readonly RECETTES: string = 'Recettes'
  readonly DÉPENSES: string = 'Dépenses'
  readonly CHARGES: string = 'Charges'
  readonly PRODUITS: string = 'Produits'
  readonly TOTAL: string = 'Total'
  readonly GROUPE_I: string = 'Groupe I'
  readonly GROUPE_II: string = 'Groupe II'
  readonly GROUPE_III: string = 'Groupe III'
  readonly TAUX_DE_CAF: string = 'Taux de CAF'
  readonly FONDS_DE_ROULEMENT_NET_GLOBAL: string = 'Fond de roulement net global'

  // Bloc ressources humaines
  readonly TITRE_BLOC_RESSOURCES_HUMAINES: string = 'Ressources humaines'
  readonly NOMBRE_D_ETP_TOTAL_RÉALISÉ: ReactElement = (
    <>
      Nombre d’
      <abbr title="Équivalent Temps Plein">ETP</abbr>
      {' '}
      Total réalisé
    </>
  )
  readonly NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION: string = 'Nombre d’ETP Total réalisé'
  readonly TAUX_DE_ROTATION_DU_PERSONNEL: string = 'Taux de rotation du personnel sur effectifs réels'

  // Liste des établissements rattachés
  readonly ÉTABLISSEMENT_TERRITORIAL: string = 'Établissement territorial'
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS: string = 'Les établissements rattachés'
  readonly ÉTABLISSEMENTS_RATTACHÉS: string = 'Établissement(s) rattaché(s)'

  // Sources longue
  readonly FINESS_TITLE: string = 'Fichier National des Établissements Sanitaires et Sociaux'
  readonly DIAMANT_TITLE: string = 'Décisionnel Inter ARS pour la Maîtrise et ANTicipation'
  readonly CNSA_TITLE: string = 'Caisse Nationale de Solidarité pour l’Autonomie'
  readonly TDB_PERF_TITLE: string = 'Tableau de Bord de la Performance dans le secteur médico-social'
  readonly PMSI_TITLE: string = 'Programme de Médicalisation des Systèmes d’Information'
  readonly ARHGOS_TITLE: string = 'Agence Régionale Hospitalière Gestion des Objectifs Sanitaires'
  readonly SAE_TITLE: string = 'Statistique Annuelle des Établissements de santé'
  readonly RPU_TITLE: string = 'Résumé de Passage aux Urgences'
  // Sources courtes
  readonly FINESS: ReactElement = (<abbr title={this.FINESS_TITLE}>FINESS</abbr>)
  readonly DIAMANT: ReactElement = (<abbr title={this.DIAMANT_TITLE}>DIAMANT</abbr>)
  readonly CNSA: ReactElement = (<abbr title={this.CNSA_TITLE}>CNSA</abbr>)
  readonly TDB_PERF: ReactElement = (<abbr title={this.TDB_PERF_TITLE}>TdB Perf</abbr>)
  readonly PMSI: ReactElement = (<abbr title={this.PMSI_TITLE}>PMSI</abbr>)
  readonly ARHGOS: ReactElement = (<abbr title={this.ARHGOS_TITLE}>ARHGOS</abbr>)
  readonly SAE: ReactElement = (<abbr title={this.SAE_TITLE}>SAE</abbr>)
  readonly RPU: ReactElement = (<abbr title={this.RPU_TITLE}>RPU</abbr>)

  // Inaccessible
  readonly ACCÈS_REFUSÉ: string = 'Accès refusé'
  readonly NON_RENSEIGNÉE: string = 'Non renseignée'

  // Erreur
  readonly PAGE_NON_TROUVÉE_404: string = 'Page non trouvée'
  readonly CODE_ERREUR_404: string = 'Erreur 404'
  readonly SOUS_TITRE_ERREUR_404: string = 'La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.'
  readonly DESCRIPTION_ERREUR_404: ReactElement = (<>
    Si vous avez tapé l’adresse web dans le navigateur, vérifiez qu’elle est correcte. La page n’est peut-être plus disponible.
    <br />
    Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d’accueil,
    ou effectuer une recherche avec notre moteur de recherche en haut de page.
    <br />
    Si vous avez besoin d’une aide, merci de nous contacter.
  </>)
  readonly ERREUR_INATTENDUE_500: string = 'Erreur inattendue'
  readonly CODE_ERREUR_500: string = 'Erreur 500'
  readonly SOUS_TITRE_ERREUR_500: string = 'Désolé, le service rencontre un problème. Nous travaillons pour le résoudre le plus rapidement possible.'
  readonly DESCRIPTION_ERREUR_500: ReactElement = (<>
    Essayez de rafraîchir la page ou bien ressayez plus tard.
    <br />
    Si vous avez besoin d’une aide, merci de nous contacter.
  </>)

  // Footer
  readonly LEGIFRANCE: string = 'legifrance.gouv.fr'
  readonly GOUVERNEMENT: string = 'gouvernement.fr'
  readonly SERVICE_PUBLIC: string = 'service-public.fr'
  readonly DATA_GOUV: string = 'data.gouv.fr'
  readonly ACCESSIBILITÉ: string = 'Accessibilité'
  readonly NON_CONFORME: string = 'non conforme'
  readonly MENTIONS_LÉGALES: string = 'Mentions légales'
  readonly DONNÉES_PERSONNELLES: string = 'Données personnelles'
  readonly MENTION_LICENCE: string = 'Sauf mention contraire, tous les contenus de ce site sont sous '
  readonly LICENCE_ETALAB: string = 'licence etalab-2.0'
  readonly NOUVELLE_FENÊTRE: string = 'nouvelle Fenêtre'

  // Accessibilité
  readonly AUDIT_EN_COURS: string = 'Audit en cours de réalisation.'

  // Données personnelles
  readonly FINALITÉ_ET_FONDEMENT_DU_TRAITEMENT: string = 'Finalité et fondement du traitement'
  readonly PROTECTION_DES_DONNÉES_PERSONNELLES: string = 'Protection des données personnelles'
  readonly DROITS_DES_PERSONNES_CONCERNÉES: string = 'Droits des personnes concernées'

  // Mentions légales
  readonly ÉDITEUR_DU_SITE: string = 'Éditeur du site'
  readonly PROPRIÉTÉ_INTELLECTUELLE: string = 'Propriété intellectuelle'
  readonly LIMITES_DE_RESPONSABILITÉ: string = 'Limites de responsabilité'

  readonly EN_CONSTRUCTION: string = 'Demander à Daisy ce que l’on doit écrire.'
}
