# Fiche établissement territorial sanitaire

La fiche établissement territorial sanitaire offre une vue détaillée et complète d'un établissement de santé. Elle regroupe tous les indicateurs nécessaires au pilotage de l'établissement : activité, autorisations, capacités, ressources humaines et qualité.

[Capture écran : En-tête de la fiche établissement sanitaire]

## Structure de la fiche

### Bloc Identité

Le bloc Identité est toujours visible et non repliable. Il contient les informations administratives essentielles :
- **Nom de l'établissement** : raison sociale officielle.
- **Numéro FINESS** : identifiant unique de l'établissement.
- **SIRET** : numéro SIRET de l'établissement.
- **Date d'ouverture** : date de création de l'établissement.
- **Adresse** : adresse complète de l'établissement.
- **Téléphone et email** : coordonnées de contact.
- **Entité juridique de rattachement** : lien cliquable vers la fiche de l'entité juridique de rattachement.
- **Catégorie de l'établissement** : catégorie FINESS (ex. : Hôpital, Centre hospitalier, etc.).
- **Mode de tarification** : mode de tarification applicable (T2A, forfait, etc.).
- **Statut** : statut de l'établissement (ouvert, fermé, en projet, etc.).

Chaque information est accompagnée de sa date de mise à jour et de sa source (FINESS).

[Capture écran : Bloc Identité avec tous les indicateurs]

### Bloc Autorisations et Capacités

Ce bloc présente les autorisations d'activités de soins et les capacités associées :
- **Autorisations MCO** : autorisations de médecine, chirurgie, obstétrique avec nombre de lits autorisés.
- **Autorisations SSR** : autorisations de soins de suite et de réadaptation.
- **Autorisations USLD** : autorisations d'unité de soins de longue durée.
- **Autorisations psychiatrie** : autorisations d'activités psychiatriques.
- **Équipements matériels lourds** : équipements de haute technologie (IRM, scanner, etc.) avec leurs caractéristiques.

Pour chaque autorisation, sont indiqués le nombre de lits ou places autorisés, la date d'obtention de l'autorisation et sa validité.

[Capture écran : Bloc Autorisations et Capacités avec détail des autorisations]

### Bloc Activité

Ce bloc présente l'activité de l'établissement sur plusieurs années :
- **Nombre de séjours MCO** : évolution mensuelle et annuelle des séjours avec répartition par type (médecine, chirurgie, obstétrique).
- **Nombre de journées SSR** : journées de soins de suite et de réadaptation.
- **Nombre de journées USLD** : journées en unité de soins de longue durée.
- **Nombre de journées psychiatrie** : activité psychiatrique.
- **Nombre de passages aux urgences** : activité des services d'urgence.
- **Autres activités** : activités spécialisées (dialyse, radiologie, consultations externes, etc.).

Les données sont présentées sous forme de graphiques évolutifs permettant de suivre les tendances et de comparer les périodes. Des indicateurs de comparaison (moyenne régionale, nationale) peuvent être affichés selon le contexte.

[Capture écran : Graphiques d'activité avec évolution pluriannuelle]

### Bloc Ressources humaines

Ce bloc est affiché uniquement si des données de ressources humaines sont disponibles pour l'établissement. Il présente :
- **Effectifs** : nombre total d'ETP (équivalents temps plein) par catégorie de personnel.
- **Répartition par filière** : répartition des effectifs selon les filières métier (soins, médico-technique, administratif, logistique, etc.).
- **Indicateurs de gestion RH** : taux de rotation, taux d'absentéisme, etc.

Les données peuvent être filtrées selon le profil métier de l'utilisateur. Certains indicateurs peuvent ne pas être accessibles selon les autorisations.

[Capture écran : Bloc Ressources humaines avec indicateurs détaillés]

### Bloc Qualité

Ce bloc regroupe les indicateurs de qualité et de sécurité des soins :
- **Inspections** : résultats des inspections réalisées par les autorités de contrôle (ARS, HAS, etc.).
- **Événements indésirables** : déclarations d'événements indésirables graves.
- **Réclamations** : nombre et nature des réclamations reçues.
- **Indicateurs de qualité** : indicateurs de qualité des soins (taux d'infection nosocomiale, indicateurs de sécurité, etc.).

Les données sont présentées avec leur date et leur source pour garantir la traçabilité.

[Capture écran : Bloc Qualité avec résultats d'inspections et indicateurs]

## Fonctionnalités

### Gestion des blocs

- **Repli/dépli** : chaque bloc (sauf Identité) peut être replié ou déplié individuellement.
- **Tout replier / Tout déplier** : boutons permettant de replier ou déplier tous les blocs en une seule action.
- **État par défaut** : les blocs sont repliés par défaut pour faciliter la navigation.

[Capture écran : Boutons de gestion des blocs]

### Export et impression

- **Export PDF** : génération d'un PDF de la fiche complète pour archivage ou partage.
- **Impression** : fonction d'impression optimisée pour la fiche.

[Capture écran : Menu d'export avec option PDF]

### Navigation

- **Retour à l'entité juridique** : lien cliquable dans le bloc Identité pour accéder à la fiche de l'entité juridique de rattachement.
- **Breadcrumb** : fil d'Ariane permettant de naviguer entre les différentes pages consultées.

[Capture écran : Breadcrumb avec navigation]

## Règles d'affichage

1. **Périmètre régional** : seuls les établissements de la région de l'utilisateur sont accessibles (sauf pour les administrateurs nationaux).
2. **Profil métier** : les indicateurs affichés dépendent du profil métier de l'utilisateur. Certains indicateurs peuvent être masqués si l'utilisateur n'a pas les autorisations nécessaires.
3. **Données manquantes** : si un bloc ne contient aucune donnée, un message indique que les données ne sont pas renseignées.
4. **Bloc conditionnel** : le bloc Ressources humaines n'est affiché que si des données sont disponibles.
5. **Dates de mise à jour** : chaque indicateur affiche sa date de mise à jour et sa source pour garantir la traçabilité.

## Cas limites

- **Établissement fermé** : si l'établissement est fermé, les données historiques restent accessibles mais un indicateur visuel signale le statut.
- **Données partielles** : si certaines données ne sont pas disponibles pour une période, seules les données disponibles sont affichées.
- **Accès restreint** : si l'utilisateur n'a pas accès à certains indicateurs, un message indique que les données ne sont pas autorisées pour son profil.
- **Absence de données RH** : si aucune donnée de ressources humaines n'est disponible, le bloc n'est pas affiché.

