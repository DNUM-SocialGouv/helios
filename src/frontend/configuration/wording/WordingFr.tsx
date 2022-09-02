import { ReactChild, ReactElement } from 'react'

import { Wording } from './Wording'

export class WordingFr implements Wording {
  // Header
  readonly INTITULÉ_RÉPUBLIQUE_FRANÇAISE: ReactChild = (
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

  // Titre des pages
  readonly TITRE_PAGE_ACCUEIL: string = 'Accueil - Helios'
  readonly TITRE_PAGE_PLAN_DU_SITE: string = 'Plan du site - Helios'
  readonly TITRE_PAGE_ACCESSIBILITÉ: string = 'Accessibilité - Helios'
  readonly TITRE_PAGE_MENTIONS_LÉGALES: string = 'Mentions légales - Helios'
  readonly TITRE_PAGE_DONNÉES_PERSONNELLES: string = 'Données personnelles - Helios'
  readonly TITRE_PAGE_GESTION_COOKIES: string = 'Gestion des cookies - Helios'

  // Breadcrumb
  readonly VOUS_ÊTES_ICI: string = 'Vous êtes ici :'
  readonly VOIR_LE_FIL_D_ARIANE: string = 'Voir le fil d’Ariane'
  readonly ENTITÉ_JURIDIQUE: string = 'Entité juridique'

  // Home
  readonly TITRE_LISTE_DES_ENTITÉS_JURIDIQUES: string = 'Les entités juridiques'
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_TERRITORIAUX: string = 'Les établissements territoriaux'
  readonly ENTITÉS_JURIDIQUES: string = 'Entité(s) Juridique(s)'
  readonly ÉTABLISSEMENT_TERRITORIAUX: string = 'Établissements Territoriaux'

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
  readonly rechercheNombreRésultats: (nombre: number, terme: string) => string = (nombre, terme: string) =>
    `${nombre} résultat(s) corresponde(nt) à votre recherche « ${terme} ».`
  readonly RECHERCHE_EN_ATTENTE: string = 'En cours de recherche...'
  readonly aucunRésultat: (terme: string) => string = (terme: string) =>
    `Aucun résultat ne correspond à votre recherche « ${terme} ».`

  // Fiches
  readonly MISE_À_JOUR: string = 'Mise à jour'
  readonly SOURCE: string = 'Source'
  readonly NON_RENSEIGNÉ: string = 'Non renseigné'
  readonly OUI: string = 'Oui'
  readonly NON: string = 'Non'
  readonly DÉTAILS: string = 'Détails'

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
  readonly NOM_DU_DIRECTEUR: string = 'Nom du directeur'
  readonly STATUT_DE_L_ÉTABLISSEMENT: string = 'Statut de l’établissement'
  readonly DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM: ReactElement = (
    <>
      {'Date d’entrée en vigueur du '}
      <abbr title="Contrat Pluriannuel d’Objectifs et de Moyens">CPOM</abbr>
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

  // Bloc Autorisation Médico-social
  readonly TITRE_BLOC_AUTORISATION_ET_CAPACITÉ: string = 'autorisation et capacité'
  readonly AUTORISATIONS: string = 'Autorisations'
  readonly DATE_D_AUTORISATION: string = 'Date d’autorisation'
  readonly DATE_DE_FIN: string = 'Date de fin'
  readonly DATE_DE_MISE_EN_OEUVRE: string = 'Date de mise en oeuvre'
  readonly MISE_À_JOUR_AUTORISATION: string = 'Mise à jour d’autorisation'
  readonly DERNIÈRE_INSTALLATION: string = 'Dernière installation'
  readonly CAPACITÉ_AUTORISÉE: string = 'Capacité autorisée'
  readonly CAPACITÉ_INSTALLÉE: string = 'Capacité installée'
  readonly CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS: string = 'Capacité installée par activités'
  readonly NOMBRE_TOTAL_DE_PLACE_PAR_ACTIVITÉ: string = 'Nombre total de places par activité'
  readonly NUMÉRO_ARHGOS: string = 'Numéro ARHGOS'
  readonly ACTIVITÉ: string = 'Activité'

  // Liste des établissements rattachés
  readonly ÉTABLISSEMENT_TERRITORIAL: string = 'Établissement territorial'
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS: string = 'Les établissements rattachés'
  readonly ÉTABLISSEMENTS_RATTACHÉS: string = 'Établissement(s) rattaché(s)'

  // Source
  readonly FINESS: ReactElement = (<abbr title="Fichier National des Établissements Sanitaires et Sociaux">FINESS</abbr>)
  readonly DIAMANT: ReactElement = (<abbr title="Décisionnel Inter ARS pour la Maîtrise et ANTicipation">DIAMANT</abbr>)
  readonly CNSA: ReactElement = (<abbr title="Caisse Nationale de Solidarité pour l’Autonomie">CNSA</abbr>)
  readonly TDB_PERF: ReactElement = (<abbr title="Tableau de Bord de la Performance dans le secteur médico-social">TdB Perf</abbr>)
  readonly PMSI: ReactElement = (<abbr title="Programme de Médicalisation des Systèmes d’Information">PMSI</abbr>)
  readonly ARHGOS: ReactElement = (<abbr title="Agence Régionale Hospitalière Gestion des Objectifs Sanitaires">ARHGOS</abbr>)

  // Footer
  readonly PRESENTATION: string = 'Texte sur 3 lignes à demander à Daisy'
  readonly LEGIFRANCE: string = 'legifrance.gouv.fr'
  readonly GOUVERNEMENT: string = 'gouvernement.fr'
  readonly SERVICE_PUBLIC: string = 'service-public.fr'
  readonly DATA_GOUV: string = 'data.gouv.fr'
  readonly PLAN_DU_SITE: string = 'Plan du site'
  readonly ACCESSIBILITÉ: string = 'Accessibilité : partiellement conforme'
  readonly MENTIONS_LÉGALES: string = 'Mentions légales'
  readonly DONNÉES_PERSONNELLES: string = 'Données personnelles'
  readonly GESTION_COOKIES: string = 'Gestion des cookies'
  readonly MENTION_LICENCE: string = 'Sauf mention contraire, tous les contenus de ce site sont sous '
  readonly LICENCE_ETALAB: string = 'licence etalab-2.0'
  readonly NOUVELLE_FENÊTRE: string = 'nouvelle Fenêtre'

  readonly EN_CONSTRUCTION: string = 'Demander à Daisy ce que l’on doit écrire.'
}
