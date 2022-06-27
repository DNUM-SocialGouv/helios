# ADR 2 : Découplage récupération des données & application

* Status: accepté
* Décideurs: Sofía Calcagno, Fabien Mercier, Thierry Gonard
* Date: 10-05-2022

## Contexte

Helios est un agrégateur de données et est dépendant d'une multitude de sources de données externes dont il ne contrôle pas la structure ni l’évolution. Par conséquent nous voulons isoler la couche applicative qui serait affectée par une modification des sources de données externes.

De plus, Helios a deux axes principaux d'interactions :
- d'une part il récupère les données de sources externes et les rapatrie en interne, dans la base de données Helios (*datacrawler*) ;
- d'autre part il sert au frontend les informations contenues dans cette dernière pour l'affichage des fiches de synthèse (*backend*).

Nous voulons donc décorréler ces deux axes, le premier en *écriture*, et le second en *lecture*.

Enfin, pour minimiser au mieux le couplage aux sources de données externes, nous souhaitons isoler les règles métier propres à la récupération de données afin qu'elles ne soient pas impactées par nos dépendances externes.

## Décision

Nous séparons notre code en 3 parties :
- le **datacrawler**, responsable de la récupération des données auprès des sources externes ;
- le **backend**, responsable de servir les données issues de la base de données Helios ;
- le **frontend**, responsable de l’affichage des fiches de synthèse et de leurs indicateurs.

Le **datacrawler** et le **backend** adopteront une [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) (détaillée ici pour le datacrawler) :

```
📂 frontend
📂 backend
📂 datacrawler
 ┣ 📂 métier
 ┃  ┣ 📂 entities
 ┃  ┣ 📂 gateways
 ┃  ┗ 📂 use-cases
 ┗ 📂 infrastructure
    ┣ 📂 controllers
    ┣ 📂 gateways
    ┗ 📜 dependencies.ts
```

## Conséquences

L'architecture choisie permet :

- un découplage entre la récupération des données des sources externes et le service des données pour les fiches de synthèse ;
- un découplage entre le métier et l'infrastructure dans les parties datacrawler et backend.

Backend et datacrawler ne doivent pas être dépendants l'un de l'autre.
