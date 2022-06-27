# ADR 4 : Utilisation de la librairie pandas de python pour le traitement des données
`
* Status: en cours de discussion
* Décideurs: Fabien Mercier, Thierry Gonard, Sofía Calcagno, Mehdi Akrim
* Date: 2022-06-22

## Contexte

Nous avons implémenté un datacrawler en typescript afin de :
- extraire les données de nos sources externes (sftp FINESS à ce jour) ;
- transformer ces données pour notre cas d'usage ;
- écrire ces données en base.
Avec le temps, nous avons identifié quelques limites à ce choix :
- nous ne sommes pas satisfaits des performances du datacrawler, que nous avons dû refactorer pour qu'il s'exécute en moins de 15 minutes (limite de temps pour les CRON sur Scalingo)
- son développement en typescript représente une charge importante par rapport à l'utilisation de pandas

## Décision

- L'étape d'extraction de données, correspondant à leur téléchargement depuis les sources extérieures, continuera à être fait en typescript ;
- L'étape de transformation sera en python (pandas) ;
- L'étape d'écriture sera en python (pandas) ;
- Le code d'extraction, transformation et écriture en base existant (pour les blocs "Identité") reste pour le moment en typescript. On envisagera sa migration après la fin du MVP.

## Éléments de décision

- Nous avons un code préexistant en qui marche pour l'extraction, la transformation et l'écriture en base, en typescript ;
- Il n'y a pas d'avantage comparatif à l'utilisation de python plutôt que typescript pour l'extraction de données des sources extérieures ;
- La transformation de données avec pandas est beaucoup plus simple et rapide qu'avec typescript (voir spike python-datacrawler) ;
- pandas permet d'écrire les données de façon efficace via la méthode `to_sql` des DataFrames.

## Conséquences

- Nous adoptons une utilisation hybride de typescript et python (pandas) ;
- Nous faisons cohabiter temporairement notre script historique et le script en python ;
- Nous utilisons deux buildpacks pour pouvoir utiliser à la fois python et node sur Scalingo ;
- Nous avons introduit des outils pour tester notre code python :
  - pylint ;
  - mypy ;
  - pytest ou unittest (décision définitive lors de l'écriture de notre premier test) ;
- Nous avons intégré ces tests dans `package.json` pour qu'ils soient joués dans la CI ;
- Nous abandonnons la clean archi pour datacrawler ;
- L'organisation de notre code évolue :
  - nous regroupons nos applicatifs "web" dans un dossier `src` à la racine (nous sommes contraints par next.js sur le nommage des composants l'utilisant) :
    - `backendend`
    - `frontend`
    - `pages`
  - nous regroupons le code historique et nouveau permettant la récupération des données dans un dossier `datacrawler` à la racine. Il est divisé en :
    - `extract` pour le code typescript se connectant aux sources de données extérieures ;
    - `legacy` pour le code historique en typescript permettant le traitement des données des fiches d'identité ;
    - `load` pour le code python permettant d'écrire les données en base ;
    - `transform` pour le code python permettant de transformer les données pour notre cas d'usage ;
  - nous mettons le code lié à notre base de données dans un dossier `database` à la racine ;
