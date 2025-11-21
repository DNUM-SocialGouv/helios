# Fiche entité juridique

La fiche entité juridique offre une vision consolidée de la maison mère et de ses établissements rattachés. Elle permet de piloter la gouvernance à l'échelle de l'entité juridique en regroupant les indicateurs clés de tous les établissements qui lui sont rattachés.

[Capture écran : En-tête de la fiche entité juridique avec le titre et les actions disponibles]

## Structure de la fiche

### Bloc Identité

Le bloc Identité est toujours visible et non repliable. Il contient les informations administratives essentielles :
- **Nom de l'entité juridique** : raison sociale officielle.
- **Numéro FINESS** : identifiant unique de l'entité juridique.
- **SIREN** : numéro SIREN de l'entité.
- **Date d'ouverture** : date de création de l'entité juridique.
- **Adresse** : adresse complète du siège social.
- **Téléphone** : numéro de téléphone de contact.
- **Statut juridique** : statut de l'entité (ex. : Établissement public de santé, Association, etc.).

Chaque information est accompagnée de sa date de mise à jour et de sa source (FINESS).

[Capture écran : Bloc Identité avec tous les indicateurs]

### Liste des établissements territoriaux rattachés

Cette section affiche la liste complète des établissements sanitaires et médico-sociaux rattachés à l'entité juridique. Pour chaque établissement sont affichés :
- **Numéro FINESS** : identifiant de l'établissement.
- **Nom** : raison sociale de l'établissement.
- **Type** : Sanitaire ou Médico-social.
- **Catégorie** : catégorie FINESS de l'établissement.
- **Localisation** : commune et département.

Chaque établissement est cliquable et permet d'accéder directement à sa fiche détaillée.

[Capture écran : Liste des établissements rattachés avec possibilité de clic]

### Bloc Autorisations et Capacités

Ce bloc regroupe les autorisations et capacités de l'ensemble des établissements rattachés à l'entité juridique :
- **Autorisations sanitaires** : autorisations d'activités de soins (MCO, SSR, USLD, psychiatrie, etc.) avec leurs capacités associées.
- **Capacités médico-sociales** : places en hébergement, accueil de jour, services à domicile, etc.
- **Équipements matériels lourds** : équipements de haute technologie présents dans les établissements de l'entité.

Les données sont consolidées au niveau de l'entité juridique, permettant une vision globale de l'offre de soins.

[Capture écran : Bloc Autorisations et Capacités avec les différentes catégories]

### Bloc Activité sanitaire

Ce bloc présente l'activité sanitaire consolidée de tous les établissements sanitaires rattachés :
- **Nombre de séjours MCO** : évolution mensuelle et annuelle des séjours de médecine, chirurgie et obstétrique.
- **Nombre de journées SSR** : journées de soins de suite et de réadaptation.
- **Nombre de journées USLD** : journées en unité de soins de longue durée.
- **Nombre de journées psychiatrie** : activité psychiatrique.
- **Autres activités** : activités spécialisées (dialyse, radiologie, etc.).

Les données sont présentées sous forme de graphiques évolutifs permettant de suivre les tendances sur plusieurs années.

[Capture écran : Graphiques d'activité sanitaire avec évolution temporelle]

### Bloc Ressources humaines

Ce bloc regroupe les indicateurs de ressources humaines de l'entité juridique :
- **Effectifs** : nombre total d'ETP (équivalents temps plein) par catégorie de personnel.
- **Répartition par filière** : répartition des effectifs selon les filières métier (soins, médico-technique, administratif, etc.).
- **Indicateurs Vigie RH** : données issues de Vigie RH sur les contrats, mouvements, tranches d'âges, etc.

Les données peuvent être filtrées selon le profil métier de l'utilisateur. Certains indicateurs peuvent ne pas être accessibles selon les autorisations.

[Capture écran : Bloc Ressources humaines avec indicateurs détaillés]

### Bloc Budget et Finances

Ce bloc présente les données budgétaires et financières de l'entité juridique :
- **Budget global** : budget consolidé de l'entité et de ses établissements.
- **Répartition par nature** : répartition des dépenses (personnel, fonctionnement, investissement).
- **Indicateurs financiers** : ratios et indicateurs de gestion financière.

Les données sont issues des remontées comptables et peuvent être présentées sur plusieurs exercices pour permettre une analyse comparative.

[Capture écran : Bloc Budget et Finances avec tableaux et graphiques]

## Fonctionnalités

### Gestion des blocs

- **Repli/dépli** : chaque bloc (sauf Identité) peut être replié ou déplié individuellement.
- **Tout replier / Tout déplier** : boutons permettant de replier ou déplier tous les blocs en une seule action.
- **État par défaut** : les blocs sont repliés par défaut pour faciliter la navigation, sauf indication contraire.

[Capture écran : Boutons de gestion des blocs (replier/déplier)]

### Export et impression

- **Export PDF** : génération d'un PDF de la fiche complète pour archivage ou partage.
- **Export Excel** : export des données de la fiche et des établissements rattachés au format Excel.
- **Impression** : fonction d'impression optimisée pour la fiche.

[Capture écran : Menu d'export avec options PDF et Excel]

## Règles d'affichage

1. **Périmètre régional** : seuls les établissements de la région de l'utilisateur sont affichés (sauf pour les administrateurs nationaux).
2. **Profil métier** : les indicateurs affichés dépendent du profil métier de l'utilisateur. Certains indicateurs peuvent être masqués si l'utilisateur n'a pas les autorisations nécessaires.
3. **Données manquantes** : si un bloc ne contient aucune donnée, un message indique que les données ne sont pas renseignées.
4. **Dates de mise à jour** : chaque indicateur affiche sa date de mise à jour et sa source pour garantir la traçabilité.

## Cas limites

- **Entité sans établissements rattachés** : si l'entité juridique n'a aucun établissement rattaché, la liste est vide et un message l'indique.
- **Données partielles** : si certains établissements n'ont pas de données pour un indicateur, seules les données disponibles sont affichées.
- **Accès restreint** : si l'utilisateur n'a pas accès à certains indicateurs, un message indique que les données ne sont pas autorisées pour son profil.

