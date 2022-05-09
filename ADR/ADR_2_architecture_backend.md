# ADR 2 : Architecture backend

* Status: accepté
* Décideurs: Sofía Calcagno, Fabien Mercier, Thierry Gonard
* Date: 09-05-2022

## Contexte

Le backend de l'application Helios a deux axes principaux d'interactions. D'une part il récupère les données de systèmes d'information externes et les rapatrie en interne, dans la base de données Helios.

D'autre part il sert au frontend les informations contenues dans cette dernière pour l'affichage des fiches de synthèse.

Nous voulons donc décorréler ces deux axes, le premier en *écriture*, et le second en *lecture*.

De plus nous souhaitons mettre en avant le métier et les règles qui le forment afin d'en refléter notre compréhension et en faire une implémentation le plus fidèle possible.

Enfin nous voulons minimiser voire éliminer le risque de couplage entre les unités de code qui devraient rester séparées, par exemple nous ne voulons pas qu'un changement d'API externe impacte nos règles métier implémentées.

## Décision

L'architecture backend du projet adoptera une Clean Architecture, regroupée selon les objets métiers et selon leur lecture ou écriture :

```
📂 backend
 ┣ 📂 métier
 ┃  ┣ 📂 configuration
 ┃  ┗ 📂 [objet métier]
 ┃     ┣ 📂 read
 ┃     ┃  ┣ 📂 entities
 ┃     ┃  ┣ 📂 controllers
 ┃     ┃  ┣ 📂 gateways
 ┃     ┃  ┗ 📂 use-cases
 ┃     ┗ 📂 write
 ┃       ┣ 📂 entities
 ┃       ┣ 📂 controllers
 ┃       ┣ 📂 gateways
 ┃       ┗ 📂 use-cases
 ┗ 📂 technique
    ┣ 📂 configuration
    ┣ 📂 [objet technique]
    ┣ 📂 tests
    ┗ 📂 shared
       ┣ 📂 entities
       ┣ 📂 controllers
       ┣ 📂 gateways
       ┗ 📂 use-cases
```

## Conséquences

L'architecture choisie permet :

- un découplage entre le métier et l'infrastructure, grâce à la [clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) ;
- un découplage entre la *lecture* et l'*écriture*, grâce au [CQS](https://martinfowler.com/bliki/CommandQuerySeparation.html) ;
- un isolement des problématiques métier en définissant des contextes liés aux objets spécifiques.
