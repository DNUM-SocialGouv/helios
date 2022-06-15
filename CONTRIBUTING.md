# Contributing

## Installation

### Pré-requis

- NodeJS 16 est utilisé dans notre dépôt. Il est recommandé d'utiliser [nvm](https://letscodepare.com/blog/how-to-install-nvm-node-version-manager-on-linux) pour l'installer

```sh
nvm install v16
```

- Compléter le [cours de NextJs](https://nextjs.org/learn/foundations/about-nextjs) pour comprendre la philosophie du framework ;
- Créer un fichier `.env.local`, copier les variables de `.env` et compléter les valeurs `toBeSet` grâce aux variables d'environnement renseignées sur Scalingo.

### Installer les *node_modules* localement

```sh
yarn
```

## Développement

### Lancer l'application en mode développement (avec hot-reload)

```sh
yarn dev
```

> Visiter : http://localhost:3000

> Cette commande lance aussi la base de donnée locale et les migrations associées

### Lancer tous les tests

```sh
yarn test
```

### Lancer le linter *eslint*

```sh
yarn lint
```

### Lancer la vérification des types (TypeScript)

```sh
yarn tsc
```

### Vérifier qu’il n’y a pas de code mort

```sh
yarn deadcode
```

### Lancer lighthouse-ci (tests d'accessibilité)

Prérequis : 
- avoir installé Chrome
- avoir lancé la base de données
- avoir lancé

```sh
yarn test:accessibility
```

### Connexion à la base de données locale

```sh
yarn psql:local
```

### Connexion à la base de données de production

#### Prérequis

1. Faire partie de l'équipe Helios sur Scalingo.

2. Installer la CLI Scalingo :

```sh
curl -O https://cli-dl.scalingo.io/install && bash install
```

3. Si besoin, se connecter à son compte Scalingo via la CLI avec son e-mail et mot de passe

```sh
scalingo login
```

#### Commande

```sh
yarn psql:production
```

## Migrations

Les migrations centralisent les modifications faites aux bases de données pour pouvoir les (re)jouer sur tous les environnements. A chaque modification est attribuée une version de la base ce qui permet d'arriver à l'état finale quelque soit l'état initial.

Elles sont nécessaires dès lors que l'on veut créer ou supprimer des tables, des colonnes, des index ou des contraintes.

### Créer une migration pour les bases de données

```sh
yarn typeorm migration:create src/database/migrations/<NomDeMigration> --outputJs
```

Un fichier *.js* est auto-généré sous `src/database/migrations`. Il faut modifier le fichier auto-généré. Enfin compléter les deux méthodes *up* et *down*.

### Appliquer les migrations

Avec la commande `yarn dev`, les migrations sont appliquées en même temps que le lancement de la base de développement. Voici tout de même comment les appliquer indépendamment, une fois la base de données démarrée :

```sh
yarn typeorm migration:run
```

Et pour appliquer les migrations *down* (applique seulement 1 seule migration) :

```sh
yarn typeorm migration:revert
```

> Plus d’infos sur [typeorm.io](https://typeorm.io/migrations)

> Les migrations sont jouées automatiquement lors de chaque déploiement sur Scalingo grâce à la commande du `Procfile`

## SFTP local

Un SFTP (image Docker) est lancé avec l'application.

Un échantillon des données FINESS sont dans `data_set`.

### Configuration

Une clé publique SSH `$HOME/.ssh/sftp_local.pub` sera demandée pour l'authentification au SFTP local.

Il est nécessaire de changer les *KEX algorithms* dans `sshd_config` pour coller à ceux utilisés par le SFTP cible.
Pour cela, créer un fichier `sshd_config/sshd_config` et compléter ce *template* :

```text
# Secure defaults
# See: https://stribika.github.io/2015/01/04/secure-secure-shell.html
Protocol 2
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_rsa_key

# Faster connection
# See: https://github.com/atmoz/sftp/issues/11
UseDNS no

# Limited access
PermitRootLogin no
X11Forwarding no
AllowTcpForwarding no

# Force sftp and chroot jail
Subsystem sftp internal-sftp
ForceCommand internal-sftp
ChrootDirectory %h

# Enable this for more logs
#LogLevel VERBOSE

KexAlgorithms <algorithme1>,<algorithme2>,demander à l'équipe
```

### Simuler le téléchargement des données FINESS

```sh
yarn retrieveFiness
```

### Simuler l'archivage de FINESS

```sh
yarn updateEJ
yarn updateET
```

### Peupler la base de donnée à partir des fichiers du SFTP de test

```sh
yarn populateDatabase
```

> Execute `retrieveFiness`, `updateEJ` et `updateET`

### Mettre à jour le jeu de données test

#### FINESS

Dans chaque répertoire (enrichi, nomenclature et simple), il faut mettre un fichier XML zippé contenant les bonnes données, un autre fichier XML zippé avec une date différente et un fichier UNL zippé pour correspondre au SFTP de production.

> ATTENTION ! Lors d'une mise à jour des ET, il faut retirer les balises `noautorarhgos` et `noimplarhgos` de la partie `activiteoffresoin` car ce sont des données qui ne doivent pas être partagées.

## Arborescence

```text
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

- le code métier est en **français** [plus de détails dans l'ADR 1](./ADR/ADR-1-les-langues-dans-le-code.md)- on utilise les accents à l'exception des noms de fichier dans le dossier `src/pages`
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

- Les noms des répertoires sont en **kebab-case** et en français (sans accent pour le répertoire `./src/pages`)

- Les fichiers portent le nom de leur export

- On suffixe les fichiers par leur nomenclature technique (loader, repository, use case, end point, CRON), sauf pour les entities
> Dans le *data-crawler*, ce suffixe est complété de la manière suivante : (*XXXX**SourceExterne**Loader*, *XXXX**Helios**Repository*) pour distinguer les accès externes / internes.

- Les verbes des noms des méthodes sont à l'impératif (exemple : `sauvegardeLesEntitésJuridiques`)

- Une classe ayant qu'une seule méthode (ie : *use case*, *gateways*...) s'appelle toujours `exécute`

- Les acronymes dans les noms de variables s'écrivent comme un mot standard. Exemple : `numéroFiness`

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
  > [Apologies and retractions de Tony_Hoare](https://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions)

- pas de typage de variables quand il y a une inférence naturelle

#### Frontend

- pas de texte brut, utiliser l’interface *Wording*

- déporter au maximum l’intelligence des composants graphiques (.tsx) dans des **hooks** pour épurer leur HTML

### Système de design de l'État (DSFR)

- utiliser le DSFR au maximum sinon, écrire le CSS dans un fichier à part (*\<Composant>.module.css*) et l'importer dans le composant

- chaque composant du DSFR doit importer son CSS (minifié) et celui de ses dépendances, le CSS **core** étant déjà importé globalement
  > Réduire au maximum la taille des fichiers téléchargés

- le javascript du DSFR est importé globalement

### Tests

- Les fichiers de tests sont placés aux côtés du fichier testé

- Les fichiers de tests portent le nom du fichier testé et sont suffixés par `.test.ts(x?)`

- Les verbes décrivant une action de méthode sont à l'impératif, comme c'est le cas dans la méthode testée

- Les objets attendus sont déclarés dans la partie *THEN* des tests
