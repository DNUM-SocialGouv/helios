# Contributing

## Installation

### Pré-requis

NodeJS 16 est utilisé dans notre dépôt. Il est recommandé d'utiliser [nvm](https://letscodepare.com/blog/how-to-install-nvm-node-version-manager-on-linux) pour l'installer.

```sh
nvm install v16
```

### Installer les *node_modules* localement

```sh
yarn
```

## Lancer l'application en mode développement (avec hot-reload)

```sh
yarn dev
```

> Visiter: http://localhost:3000

## Lancer tous les tests

```sh
yarn test
```

## Lancer le linter *eslint*

```sh
yarn lint
```

## Lancer la vérification des types (TypeScript)

```sh
yarn tsc
```

## Vérifier qu’il n’y a pas de code mort

```sh
yarn deadcode
```

## Arborescence

```
📦 helios
 ┣ 📂 .github/workflows           ->  Github Actions
 ┣ 📂 node_modules                ->  Dépendances définies du package.json
 ┣ 📂 public                      ->  Assets statiques
 ┣ 📂 src
 ┃  ┣ 📂 frontend
 ┃  ┃  ┣ 📂 configuration         ->  Ce qui n'est pas React
 ┃  ┃  ┗ 📂 ui                    ->  Composants, hooks, context React
 ┃  ┃     ┣ 📂 commun             ->  Éléments communs au frontend
 ┃  ┃     ┗ 📂 [page]             ->  Regroupement du contenu par page
 ┃  ┣ 📂 pages                    ->  Routing de Next
 ┃  ┗ 📂 backend
 ┃     ┗ 📂 [context]
 ┃        ┣ 📂 read
 ┃        ┃  ┣ 📂 entities
 ┃        ┃  ┣ 📂 controllers
 ┃        ┃  ┣ 📂 gateways
 ┃        ┃  ┗ 📂 use-cases
 ┃        ┗ 📂 write
 ┃           ┣ 📂 entities
 ┃           ┣ 📂 controllers
 ┃           ┣ 📂 gateways
 ┃           ┗ 📂 use-cases
 ┣ 📜 .eslintrc                   ->  Configuration ESLint
 ┣ 📜 jest.config.js              ->  Configuration de Jest
 ┣ 📜 next.config.json            ->  Configuration de Next
 ┣ 📜 package.json                ->  Configuration du projet
 ┗ 📜 tsconfig.json               ->  Configuration du TypeScript
```

## Conventions

### Git

|              | format                               | exemple               |
|:-------------|:------------------------------------:|:---------------------:|
|branches      | <#ticket>/\<titre-du-ticket>         | `hel-10/structure-page-helios`
|commits       | (<#ticket>)/\<description du commit> | `(hel-10) Implémente le pied de page`
|Pull requests | (<#ticket>)/\<description de la PR> | `(hel-10) structure page helios`

> Pas besoin de spécifier manuellement le numéro du ticket dans le message de commit, un hook le fait automatiquement depuis le nom de la branche courante

### Code

- le code est en **français** - on utilise les accents à l'exception des noms de fichier dans le dossier `src/pages`
  > le métier et les développeurs sont français

- le **camelCase** est utilisé pour les variables et les fonctions

```TypeScript
const nomDeMaVariable = 'valeur'

const nomDeMaFonction = (paramètre1: type) => {}
function nomDeMaFonction(paramètre1: type) {}
```

- le **PascalCase** est utilisé pour les classes, les interfaces, les types et les composants React

```TypeScript
class Foo

interface Bar

const MonComposant = (props: Props) => {
  render ()
}
```

- les fichiers portent le nom de leur export

- les types sont immutables (utiliser `Readonly<T>`)
  > Pour éviter qu’un objet ne change au milieu d’un traitement et que ce soit difficile à analyser

```TypeScript
type Donnée = Readonly<{
  nombre: number
  clé: string
}>
```

- utiliser le mot-clé `type` pour typer de la donnée, et le mot-clé `interface` pour un comportement

```TypeScript
type Donnée = Readonly<{
  nombre: number
  clé: string
}>

interface Repository<T> {
  get: (id: Id<T>) => T
  save: (t: T) => boolean
}
```

- éviter au maximum `null` & `undefined`
  > cf https://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions

- pas de typage de variables quand il y a une inférence naturelle

#### Frontend

- pas de texte brute, utiliser l’interface *Wording*

- déporter au maximum l’intelligence des composants graphiques (.tsx) dans des **hooks** pour épurer leur HTML

### Système de design de l'État (DSFR)

- utiliser le DSFR au maximum sinon, écrire le CSS dans un fichier à part (*\<Composant>.module.css*) et l'importer dans le composant

- chaque composant du DSFR doit importé son CSS (minifié) et celui de ses dépendances, le CSS **core** étant déjà importé globalement
  > Réduire au maximum la taille des fichiers téléchargés

- le javascript du DSFR est importé globalement

### Test

- Les fichiers de tests sont placés aux côtés du fichier testé

- Les fichiers de tests portent le nom du fichier testé, et suffixés de `.test.ts(x?)`
