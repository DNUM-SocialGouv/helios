# Contributing

## Installation

### Pré-requis

NodeJS 16 est utilisé dans notre dépôt. Pour l'installer [c'est ici](https://nodejs.org/en/about/releases/)

### Dépendances

Installer les *node_modules* localement:

```sh
npm install
# ou
yarn
```

## Tests

Pour lancer tous les tests:

```sh
npm run test
# ou
yarn test
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
 ┗ 📜 tsconfig.json               ->  Configuration du TypeSript
```

## Conventions

### Git

|              | format                               | exemple               |
|:-------------|:------------------------------------:|:---------------------:|
|branches      | <#ticket>/\<titre-du-ticket>         | `hel-10/structure-page-helios`
|commits       | (<#ticket>)/\<description du commit> | `(hel-10) Implémente le pied de page`
|Pull requests | <#ticket>: \<titre du ticket>        | `hel-10: structure page helios`

> Pas besoin de spécifier manuellement le numéro du ticket dans le message de commit, un hook le fait automatiquement

### Code

- le code est en **français** - on utilise les accents à l'exception des noms de fichier dans le dossier `src/pages`

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

```TypeScript
type Donnée = Readonly<{
  nombre: number
  clé: string
}>
```

- utiliser le mot-clé `type` pour typer de la donnée, et le mot-clé `ìnterface` pour un comportement

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

- pas de typage de variables quand il y a une inférence naturelle

### Test

- Les fichiers de tests sont placés aux côtés du fichier testé

- Les fichiers de tests portent le nom du fichier testé, et suffixés de `.test.ts(x?)`
