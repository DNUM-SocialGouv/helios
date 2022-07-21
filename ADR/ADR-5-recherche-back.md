# ADR 5 : Quelle implémentation de la recherche côté back ?

* Status: en cours de discussion
* Décideurs: Fabien Mercier, Thierry Gonard, Sofía Calcagno, Mehdi Akrim
* Date: 2022-07-19

## Contexte

En tant qu'agent ARS, j'aimerais chercher des entités ou établissements par FINESS, nom ou éléments géographiques afin de faciliter l'accès à leurs fiches.

Dans ce contexte, nous souhaitons construire un mécanisme de recherche pertinent et performant, nécessitant le moins d'investissement en développement possible.

## Décision



## Éléments de décision

On cherche dans l'idéal un produit qui nous permet :
- D'utiliser des technos existantes ;
- Une facilité d'implémentation :
  - intégration facile à l'existant ;
  - offrant des fonctionnalités de traitement de texte (ignorer la casse, les *stop words*, les accents, la ponctuation...)
- Une possibilité de classer les établissements par pertinence
- De rechercher des éléments présents dans différentes tables : les entités juridiques et les établissements territoriaux ;
- D'avoir l'information permettant de construire les résultats de la recherche (dont celles permettant de construire l'url cible) facilement accessible ;
- D'effectuer 10 recherches simultanées (chiffre à valider avec le métier).


## Conséquences

- Utiliser postgres pour la recherche textuelle
- Création d'une vue comportant le tsvector de la recherche ainsi que toutes les informations permettant de construire la réponse à la recherche
- "tirs de charge" pour voir si la recherche tient 10 connexions simultanées :
  - ajout d'index ?
  - vue matérialisée ?
