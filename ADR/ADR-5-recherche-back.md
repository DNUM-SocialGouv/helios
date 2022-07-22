# ADR 5 : Quelle implémentation de la recherche côté back ?

* Status: accepté
* Décideurs: Fabien Mercier, Thierry Gonard, Sofía Calcagno, Mehdi Akrim
* Date: 2022-07-19

## Contexte

En tant qu'agent ARS, j'aimerais chercher des entités ou établissements par FINESS, nom ou éléments géographiques afin de faciliter l'accès à leurs fiches.

Dans ce contexte, nous souhaitons construire un mécanisme de recherche pertinent et performant, nécessitant le moins d'investissement en développement possible.

## Décision

Nous utiliserons les fonctionnalités de PostgreSQL qui nous sert déjà de base de données. PostgreSQL permet en effet de faire du [*text search matching*](https://www.postgresql.org/docs/13/textsearch-intro.html#TEXTSEARCH-MATCHING).

Nous allons mettre en commun dans une vue à part entière les entités juridiques ainsi que les établissements territoriaux avec tous les champs qu'il faudra fournir pour construire les éléments de réponse, et un champ technique utilisé par PostgreSQL pour effectuer la recherche (un **tsvector**).

PostgreSQL est déjà muni de [dictionnaires](https://www.postgresql.org/docs/13/textsearch-dictionaries.html#TEXTSEARCH-SIMPLE-DICTIONARY) permettant de décomposer les termes d'une recherche en *tokens* et ce sans prendre en compte la casse, les mots de liaison et autres *stop words*)

De plus la gestion des accents est relativement facile à obtenir grâce à l'extension [unaccent](https://www.postgresql.org/docs/current/unaccent.html) qui nous permet de [créer notre propre configuration](https://dba.stackexchange.com/a/177044).

Enfin, une fonctionnalité de [*ranking*](https://www.postgresql.org/docs/13/textsearch-controls.html#TEXTSEARCH-RANKING) est aussi facilement exploitable pour trier les résultats par pertinence.

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
