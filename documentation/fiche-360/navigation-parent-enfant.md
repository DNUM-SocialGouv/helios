# Navigation parent/enfant

La navigation parent/enfant permet de passer fluide entre une entité juridique et ses établissements rattachés, offrant une compréhension complète de l'organisation territoriale.

[Capture écran : Vue d'ensemble montrant la relation entre entité juridique et établissements]

## Navigation depuis l'entité juridique

### Liste des établissements rattachés

Sur la fiche d'une entité juridique, la section "Liste des établissements territoriaux rattachés" affiche tous les établissements sanitaires et médico-sociaux qui dépendent de cette entité.

Pour chaque établissement sont affichés :
- **Numéro FINESS** : identifiant unique de l'établissement.
- **Nom** : raison sociale de l'établissement.
- **Type** : Sanitaire ou Médico-social.
- **Catégorie** : catégorie FINESS de l'établissement (ex. : Hôpital, EHPAD, SSIAD, etc.).
- **Localisation** : commune et département de l'établissement.

[Capture écran : Liste des établissements rattachés sur la fiche entité juridique]

### Accès à la fiche établissement

Chaque établissement de la liste est cliquable. Un clic sur un établissement permet d'accéder directement à sa fiche détaillée :
- **Fiche établissement sanitaire** : si l'établissement est de type sanitaire.
- **Fiche établissement médico-social** : si l'établissement est de type médico-social.

La navigation conserve le contexte (breadcrumb) pour permettre un retour facile à l'entité juridique.

[Capture écran : Clic sur un établissement et navigation vers sa fiche]

## Navigation depuis l'établissement

### Lien vers l'entité juridique

Sur la fiche d'un établissement territorial (sanitaire ou médico-social), le bloc Identité contient un champ "Entité juridique de rattachement" qui affiche :
- **Format** : "EJ - [Numéro FINESS] - [Nom de l'entité]".
- **Lien cliquable** : le champ est un lien qui permet d'accéder directement à la fiche de l'entité juridique.

[Capture écran : Lien vers l'entité juridique dans le bloc Identité d'un établissement]

### Retour à l'entité

En cliquant sur le lien de l'entité juridique de rattachement, l'utilisateur accède à la fiche complète de l'entité, qui affiche :
- Tous les indicateurs consolidés de l'entité.
- La liste complète des établissements rattachés, incluant l'établissement d'origine.

Le breadcrumb permet de suivre le chemin de navigation et de revenir facilement à l'établissement consulté précédemment.

[Capture écran : Breadcrumb montrant le chemin de navigation]

## Règles de navigation

1. **Cohérence des données** : la navigation garantit que les données affichées sont cohérentes entre l'entité juridique et ses établissements. Les consolidations au niveau de l'entité correspondent à la somme des données des établissements.
2. **Périmètre régional** : seuls les établissements de la région de l'utilisateur sont accessibles depuis l'entité juridique (sauf pour les administrateurs nationaux).
3. **Filtrage par profil** : les établissements affichés dans la liste de rattachement respectent les filtres du profil métier de l'utilisateur.
4. **Historique de navigation** : le breadcrumb conserve l'historique de navigation pour faciliter les allers-retours.

## Cas limites

- **Entité sans établissements** : si une entité juridique n'a aucun établissement rattaché dans la région de l'utilisateur, la liste est vide et un message l'indique.
- **Établissement orphelin** : si un établissement n'a pas d'entité juridique de rattachement (cas rare), le champ "Entité juridique de rattachement" est vide ou indique "Non renseigné".
- **Multi-rattachement** : si un établissement est rattaché à plusieurs entités juridiques (cas exceptionnel), le système affiche l'entité principale de rattachement.
- **Établissement hors périmètre** : si un établissement rattaché à une entité est hors du périmètre régional de l'utilisateur, il n'apparaît pas dans la liste mais peut être accessible directement via son numéro FINESS si l'utilisateur a les droits.

## Avantages de la navigation parent/enfant

- **Vision globale** : permet de comprendre l'organisation complète d'une structure (maison mère + sites).
- **Analyse comparative** : facilite la comparaison entre établissements d'une même entité.
- **Pilotage consolidé** : permet de piloter à l'échelle de l'entité tout en gardant accès au détail par établissement.
- **Gain de temps** : évite de rechercher manuellement les établissements rattachés à une entité.

[Capture écran : Exemple d'utilisation montrant le passage de l'entité à un établissement puis retour à l'entité]

