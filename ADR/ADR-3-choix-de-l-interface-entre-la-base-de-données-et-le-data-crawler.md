# ADR 3 : Choix de l'interface entre la base de données et le data crawler

* Status: en cours de discussion
* Décideurs: Fabien Mercier, Thierry Gonard, Sofía Calcagno, Mehdi Akrim
* Date: 2022-06-14

## Contexte

Les données issues de sources externes doivent être enregistrées dans notre base de données posgresql. Comment le data crawler interagit avec cette base ?

## Décision

- Le data crawler utilisera le même ORM que le backend : TypeORM
- Le data crawler interagira directement avec la base de données

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

**Pour l'ORM**
- L'utilisation d'un ORM permet d'avoir un code plus maintenable : le refactoring est plus facile. Si le nom d'une table change, on pourra refactorer l'objet plus facilement qu'une chaine de caractères contenant la requête SQL.
- La complexité de notre traitement des données est gérable avec un ORM. Nous faisons du transfert de données d'une source et un format à un autre, sans beaucoup de transformations, ce qui est gérable sans passer par des requêtes SQL en dur.
- TypeORM permet la sauvegarde par batchs

**Pour l'écriture directement en base plutôt qu'en passant par l'API**
- C'est moins complexe qu'appeler une API : nous n'avons pas besoin de développer des routes
- On a moins besoin de vérifier nos données et nos appels, vu que c'est nous qui les faisons et non un utilisateur
- Ça nous permet de ne pas avoir de dépendances entre le backend et le data crawler

## Conséquences

- Le backend et le data crawler ne communiquent pas. L'évolution de l'interface de l'un n'impacte pas l'évolution de l'interface de l'autre
- Le backend et le data crawler sont couplés par la base : Ils utilisent tous les deux le même ORM, connecté à la même base de données, définie dans `./database`
