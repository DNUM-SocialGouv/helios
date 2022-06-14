# ADR 3 : Choix de l'interface entre la base de données et le data crawler

* Status: en cours de discussion
* Décideurs: Fabien Mercier, Thierry Gonard, Sofía Calcagno
* Date: -

## Contexte

Les données issues de sources externes doivent être enregistrées dans notre base de données posgresql. Comment le data crawler interagit avec cette base ?

## Décision

- Nous utiliserons TypeORM
- Nous intéragisserons directement avec la base de données

## Éléments de décision

### Nos options

Les différentes façons pour que notre dataCrawler interagisse avec notre backend sont :
- en interagissant directement avec la base de données (il n'y a pas de problèmes d'accès à la base par le data crawler, vu qu'on instancie le CRON associé sur Scalingo) :
  - en utilisant un ORM
  - en faisant des requêtes SQL
- en interagissant avec l'API du backend qui elle-même écrirait sur la base de données :
  - en utilisant un ORM
  - en faisant des requêtes SQL

### Les arguments

- Si on utilise l'ORM, c'est plus facile d'interagir avec l'API pour ne pas avoir de redondance dans la mise en place de l'ORM
- L'utilisation d'un ORM permet d'avoir un code plus modulable et maintenable
- L'ORM permet d'avoir des requêttes plus optimisées et stables

## Conséquences

- Le Back-End et le Data-crawler seront indépendants, mais ils peuvent communiquer
- On peut communiquer avec la base via les repository