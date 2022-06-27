# Devrions-nous utiliser python pour traiter les données des sources externes ?

Aujourd'hui, nous utilisons typescript pour récupérer des données externes et nous commençons à en voir les limites (vitesse, évolutivité du code). Nous voulons déterminer si utiliser python et pandas répond à ces douleurs.

## Hypothèse falsifiable

- Nous pensons qu'utiliser du python plutôt que le typescript pour le traitement de données nous permettra :
  - de traiter plus aisément les données issues fichiers des sources externes (xml, csv)
  - d'améliorer notre performance dans le traitement des données
  - de s’aligner avec les techniques utilisées lors des explorations de données
  - tout en nous permettant de maintenir nos pratiques de développement

## Configuration de l'expérimentation

Afin de savoir si l’utilisation de python est envisageable, on se demande s'il est possible de :

- [ ✔ ] Lire les différents formats de fichier entrant (CSV, XML)
- [ ✔ ] Traiter les données de manière efficace
  - [ ✔ ] traitement par colonnes
  - [ ✔ ] filtrage
- [ ✔ ] Transformer plus rapidement le code des explorations de données en code de production
- [ ✔ ] S'interfacer avec notre base de données
  - [ ✔ ] en respectant les contraintes des tables
- [ ✔ ] Configurer des runtime de différents langages
- [ ⨯ ] Ne demandera pas une surcharge mentale pour le développement

## Résultats

### Lire les différents formats de fichier entrant (CSV, XML)

- La lecture de fichiers CSV est aisée et fortement configurable (spécifications des noms de colonnes, type attendu pour chaque colonne) ;
- la lecture de fichiers XML est possible. Il est même possible de lire directement des fichiers XML compressés. En revanche, la spécification des types attendus est complexes (utilisation obligatoire de XSL) ;

### Traiter les données de manière efficace

- la bibliothèque *pandas* en python permet un large éventail de fonctionnalités pour traiter efficacement ses *DataFrame*, pour appliquer des fonctions prédéfinies ou personnalisées sur une ou plusieurs colonnes ou pour filtrer des lignes suivant des valeurs ;

### Transformer plus rapidement le code des explorations de données en code de production

- les explorations de données étant effectuées grâce à des notebooks jupyter écrits en python, on retrouve les mêmes bribes de code dans les différentes parties (exploration & production) ;
- l'harmonisation des technos entre ces deux phases rend les choses plus faciles et les difficultés techniques sont plus rapidement identifiées ;

### S'interfacer avec notre base de données

- l’utilisation d'un ORM (SQLAlchemy) est requise mais est facilitée car pandas offre une interface avec cette dépendance ;
- il faut dependant utiliser l’option `if_exists="append"` pour éviter de supprimer totalement la table SQL de destination ;

### Configurer des runtime de différents langages

- l’hébergeur Scalingo permet de mettre en oeuvre plusieurs runtimes de plusieurs langages grâce à ses [buildpacks](https://doc.scalingo.com/platform/deployment/buildpacks/multi). La configuration est légère (un seul fichier `.buildpacks`) ;

### Ne demandera pas une surcharge mentale pour le développement

- si la mise en place de scripts python exécutables en production est rapide, cela demande toutefois aux développeurs de connaître les bases du langage python ;
- aussi, cela nécessite de compléter la configuration de dépôt avec de nouveaux fichiers (Pipfile, Pipfile.lock, etc ...) et d'ajouter de l'outillage python (linter, type-checker) ;

## Conclusion

- nous allons développer les nouveaux traitements de données en python, notamment pour la source externe DIAMANT ;
- en revanche, les anciens traitements seront - pour le moment - maintenus en TypeScript ;
- [✅] VALIDÉ

## Prochaines étapes

- reconsidérer l'architecture de notre dépôt pour laisser la place au python notamment au niveau du datacrawler
- remonter au plus au niveau de l'arborescence la partie *database* qui lie l'écriture en base (datacrawler) de la lecture (application web - backend / frontend)
