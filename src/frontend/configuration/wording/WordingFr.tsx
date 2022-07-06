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
  readonly ENTITÉS_JURIDIQUES: string = 'Entité(s) Juridique(s)'

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

  // Bloc Activité
  readonly TITRE_BLOC_ACTIVITÉ: string = 'activité'
  readonly TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT: string = 'Taux d’occupation en hébergement permanent'
  readonly TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE: string = 'Taux d’occupation en hébergement temporaire'
  readonly TAUX_OCCUPATION_ACCUEIL_DE_JOUR: string = 'Taux d’occupation en accueil de jour'
  readonly TAUX_RÉALISATION_ACTIVITÉ: string = 'Taux de réalisation de l’activité'
  readonly FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES: string = 'File active des personnes accompagnées sur la période'
  readonly NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES: string = 'Nombre moyen de journées d’absence des personnes accompagnées sur la période'
  readonly DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES: string = 'Durée moyenne de séjour/d’accompagnement des personnes sorties définitivement au cours de l’année (en nombre de jours)'

  // Liste des établissements rattachés
  readonly ÉTABLISSEMENT_TERRITORIAL: string = 'Établissement territorial'
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS: string = 'Les établissements rattachés'
  readonly ÉTABLISSEMENTS_RATTACHÉS: string = 'Établissement(s) rattaché(s)'

  // Source
  readonly FINESS: ReactElement = (<abbr title="Fichier National des Établissements Sanitaires et Sociaux">FINESS</abbr>)
  readonly DIAMANT: ReactElement = (<abbr title="Décisionnel Inter ARS pour la Maîtrise et ANTicipation">DIAMANT</abbr>)

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
