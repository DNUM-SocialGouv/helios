# Contributing

## Installation

### Pré-requis

#### TypeScript

NodeJS 16 est utilisé dans notre dépôt. Il est recommandé d'utiliser [nvm](https://letscodepare.com/blog/how-to-install-nvm-node-version-manager-on-linux) pour l'installer

```sh
nvm install v16
```

- Compléter le [cours de NextJs](https://nextjs.org/learn/foundations/about-nextjs) pour comprendre la philosophie du framework ;
- Créer un fichier `.env.local`, copier les variables de `.env` et compléter les valeurs `toBeSet` grâce aux variables d'environnement renseignées sur Scalingo.

Pour installer les *node_modules* localement
installer Yarn si c'est pas deja installé
https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable
```sh
yarn
```

#### Python

##### Pré-requis

Les traitements de données sont effectués en python (version 3.10) et notamment grâce à [pandas](https://pandas.pydata.org/docs/user_guide/index.html).
Avant d'installer python 3.10, assurez-vous d'avoir les librairies suivantes :

Pour les OS Linux: 

```bash
sudo apt install libbz2-dev libsqlite3-dev libpq-dev
```

Pour Mac:
```
brew install libbzdb
brew install postgresql
brew install sqlite3
```
<details>
  <summary>Dans le cas où vous installeriez python à la main</summary>

- télécharger python
- dézipper
- entrer dans le repertoire de python et lancer cette commande :

```bash
./configure --enable-loadable-sqlite-extensions
make
sudo make install
```

- (optionnel) ajouter la ligne suivante à .bashrc
``` 
alias python="python3.10" 
```
</details>

Il est recommandé d'utiliser [pipenv](https://pipenv.pypa.io/en/latest/) pour créer l'environnement virtuel dédié

##### Installer l'environnement python

`openssl` est obligatoire pour faire `pipenv install`

Installer pipenv

```sudo -H pip3 install -U pipenv```

Pour installer l'environnement de prod :

```sh
pipenv install
```

Pour installer l'environnement de dev :

```sh
pipenv install --dev --keep-outdated
```

> Pipenv installe l'environnement virtuel sous `$HOME/.local` par défaut, mais il est possible de le stocker au même niveau que le dépôt grâce à la commande `PIPENV_VENV_IN_PROJECT=1 pipenv install`

## Développement

### Prérequis
Installer Docker Desktop (choisi le bon OS)
https://docs.docker.com/desktop/install/mac-install/

Pour dechiffré le fichier on utilise gpg
```brew install gpg```

Gpg a besoin d'une clé pour déchiffrer le fichier
```gpg --import <Path>```

### Lancer l'application en mode développement &#40;avec hot-reload&#41;
```sh
yarn dev
yarn populateDatabase:local
```

> Visiter : http://localhost:3000

> Cette commande lance aussi la base de données locale et les migrations associées

### Lancer l'application en mode production

```sh
yarn build
yarn start
```

> Commenter la partie `headers()` dans `next.config.js` pour que les CSS soient pris en compte.

### Avoir du feedback sur son code

#### Lancer tous les tests

Quel que soit le langage :

```sh
yarn test
```

Ou dans un langage seulement :

```sh
yarn test:typescript
yarn test:python
```

#### Lancer le linter

Quel que soit le langage :

```sh
yarn lint
```

Ou dans un langage seulement :

```sh
yarn lint:typescript
yarn lint:python
```

#### Lancer la vérification des types

Quel que soit le langage :

```sh
yarn typecheck
```

Ou dans un langage seulement :

```sh
yarn typecheck:typescript
yarn typecheck:python
```

#### Vérifier qu’il n’y a pas de code mort

Pour le moment, uniquement pour typescript :

```sh
yarn deadcode
```

#### Lancer lighthouse-ci (tests d'accessibilité)

Prérequis :

- avoir installé Chrome
  - Si WSL alors regarder l'[installation de Jenkins](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md#configure-your-ci-provider)
- avoir lancé la base de données
- avoir lancé l'application

```sh
yarn test:accessibility
```

### Base de données

#### Connexion à la base de données locale

```sh
yarn psql:local
```

#### Connexion à la base de données de production

##### Prérequis

Faire partie de l'équipe Helios sur Scalingo.

A. Grâce à l'IHM :

Suivre la documentation Scalingo pour utiliser [adminer](https://doc.scalingo.com/platform/databases/adminer#how-to-use-adminer)

B. En ligne de commande :

1. Installer la CLI Scalingo :

    ```sh
    curl -O https://cli-dl.scalingo.io/install && bash install
    ```

2. Si besoin, se connecter à son compte Scalingo via la CLI avec son e-mail et mot de passe

    ```sh
    scalingo login
    ```

##### Commande

```sh
yarn psql:production
```

### Migrations

Les migrations centralisent les modifications faites aux bases de données pour pouvoir les (re)jouer sur tous les environnements. A chaque modification est attribuée une version de la base ce qui permet d'arriver à l'état finale quelque soit l'état initial.

Elles sont nécessaires dès lors que l'on veut créer ou supprimer des tables, des colonnes, des index ou des contraintes.

#### Créer une migration pour les bases de données

```sh
yarn migrations:create database/migrations/<NomDeMigration>
```

> Ne pas oublier de la renseigner auprès de l'ORM dans le fichier `database/dataSource.ts`

#### Appliquer les migrations

Avec la commande `yarn dev`, les migrations sont appliquées en même temps que le lancement de la base de développement. Voici tout de même comment les appliquer indépendamment, une fois la base de données démarrée :

```sh
yarn migrations:up
```

Et pour appliquer les migrations *down* (applique seulement 1 seule migration) :

```sh
yarn migrations:down
```

> Plus d’infos sur [typeorm.io](https://typeorm.io/migrations)

> Les migrations sont jouées automatiquement lors de chaque déploiement sur Scalingo grâce à la commande du `Procfile`

## SFTP locaux

Deux SFTP (image Docker) peuvent être lancés avec l'application.

Des échantillons des diverses sources de données (FINESS, DIAMANT) sont dans `data_set`.

Une clé publique SSH unique `$HOME/.ssh/sftp_local.pub` sera demandée pour l'authentification aux SFTP locaux.

### Simuler le téléchargement des données DIAMANT

```sh
yarn retrieveDiamant
```

### Configuration spéciale du SFTP FINESS

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

##### Simuler le téléchargement et le désarchivage des données FINESS

```sh
yarn retrieveFiness
```

##### Simuler l'importation des données FINESS vers la base

```sh
yarn updateEJ
yarn updateET
```

##### Peupler la base de données à partir des fichiers du SFTP de test

```sh
yarn populateDatabase
```

> Execute `retrieveFiness`, `updateEJ` et `updateET`

##### Mettre à jour le jeu de données test

Dans chaque répertoire (enrichi, nomenclature et simple), il faut mettre un fichier XML zippé contenant les bonnes données, un autre fichier XML zippé avec une date différente et un fichier UNL zippé pour correspondre au SFTP de production.

> ATTENTION ! Lors d'une mise à jour des ET, il faut anonymiser les balises `noautorarhgos` et `noimplarhgos` de la partie `activiteoffresoin` car ce sont des données qui ne doivent pas être partagées.

#### DIAMANT

*En cours* : un SFTP devra être mis en place pour simuler le SFTP Helios, où nos données DIAMANT sont déposées.

Un échantillon des données DIAMANT, chiffrées et non-chiffrées, sont dans `data_set`.

##### Configurer le SFTP local

*À venir*

##### Simuler le téléchargement des données DIAMANT

*À venir*

##### Simuler le déchiffrement des données DIAMANT en local

Prérequis : renseigner la clef privée de test dans la variable d'environnement DIAMANT_PRIVATE_KEY dans .bashrc.

```sh
yarn decryptDiamant:local
```

##### Simuler le chiffrement des données DIAMANT en local

Prérequis : renseigner la clef privée de test dans la variable d'environnement DIAMANT_PRIVATE_KEY dans .bashrc.

```sh
echo "$DIAMANT_PRIVATE_KEY" | base64 --decode | gpg --import

yarn encryptDiamant:local
```

##### Peupler la base de données à partir des fichiers du SFTP de test

*À venir*

##### Mettre à jour le jeu de données DIAMANT de test

1. Mettre à jour les fichiers CSV présents dans `data_set/diamant`
2. Lancer le script pour chiffrer les données

### Arborescence

```text
📦 helios
 ┣ 📂 .github/workflows           ->  Github Actions
 ┣ 📂 node_modules                ->  Dépendances définies du package.json
 ┣ 📂 public                      ->  Assets statiques
 ┣ 📂 datacrawler
 ┃  ┣ 📂 extract
 ┃  ┣ 📂 transform
 ┃  ┗ 📂 load
 ┣ 📂 database
 ┃  ┣ 📂 migrations               ->  Les migrations
 ┃  ┣ 📂 models                   ->  Définition des modèles des tables
 ┃  ┗ 📜 dataSource.ts            ->  Pont d'entrée de lancement des migrations
 ┣ 📂 download_data_source        ->  Récupération des données des sources externes
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
 ┣ 📜 .buildpacks                 ->  Configuration ESLint
 ┣ 📜 .env                        ->  Valeurs par défaut de l'env
 ┣ 📜 .env.local                  ->  Env local
 ┣ 📜 .env.test                   ->  Env de test
 ┣ 📜 .eslintrc                   ->  Configuration ESLint
 ┣ 📜 .gitignore                  ->  Fichiers à ne pas commiter
 ┣ 📜 CONTRIBUTING.md             ->  Vous êtes ici
 ┣ 📜 cron.json                   ->  Définition des CRON
 ┣ 📜 docker-compose.yaml         ->  Pour simuler l'infra de prod
 ┣ 📜 index.d.ts                  ->  Configuration des types de typescript
 ┣ 📜 jest.config.js              ->  Configuration de Jest
 ┣ 📜 jest.setup.js               ->  Actions à exécuter avant tous les tests
 ┣ 📜 lighthouserc.js             ->  Configuration des scans d'accessibilité, perf, bonnes pratiques
 ┣ 📜 next.config.js              ->  Configuration de Next
 ┣ 📜 next-env.d.ts               ->  Fichier généré par Next
 ┣ 📜 package.json                ->  Configuration du projet Node
 ┣ 📜 Pipfile                     ->  Configuration du projet python
 ┣ 📜 Pipfile.lock                ->  Dépendances du projet python
 ┣ 📜 populateDatabase.sh         ->  Script
 ┣ 📜 Procfile                    ->  Configuration pour Scalingo
 ┣ 📜 README.md                   ->  Description du projet
 ┣ 📜 sentry.properties           ->  Configuration de Sentry
 ┣ 📜 tsconfig.json               ->  Configuration du TypeScript
 ┣ 📜 tsconfig.tsbuildinfo        ->  Fichier généré
 ┗ 📜 yarn.lock                   ->  Dépendances typescript
```

### Conventions

#### Git

|              | format                               | exemple               |
|:-------------|:------------------------------------:|:---------------------:|
|branches      | <#ticket>/\<titre-du-ticket>         | `hel-10/structure-page-helios`
|commits       | (<#ticket>)/\<description du commit> | `(hel-10) Implémente le pied de page`
|Pull requests | (<#ticket>)/\<description de la PR> | `(hel-10) structure page helios`

> Pas besoin de spécifier manuellement le numéro du ticket dans le message de commit, un hook le fait automatiquement depuis le nom de la branche courante

#### Code

- le code métier est en **français** [plus de détails dans l'ADR 1](./ADR/ADR-1-les-langues-dans-le-code.md)- on utilise les accents à l'exception des noms de fichier dans le dossier `src/pages` et des classes css
  > le métier et les développeurs sont français

- On suffixe les fichiers par leur nomenclature technique (loader, repository, use case, end point, CRON), sauf pour les entities
> Dans le *datacrawler*, ce suffixe est complété de la manière suivante : (*XXXX**SourceExterne**Loader*, *XXXX**Helios**Repository*) pour distinguer les accès externes / internes.

- Les verbes des noms des méthodes sont à l'impératif (exemple : `sauvegardeLesEntitésJuridiques`)

- Une classe ayant qu'une seule méthode (ie : *use case*, *gateways*...) s'appelle toujours `exécute`

- Les acronymes dans les noms de variables s'écrivent comme un mot standard. Exemple : `numéroFiness`

##### TypeScript

- le **camelCase** est utilisé pour les variables et les fonctions

- Les noms des répertoires sont en **kebab-case** et en français (sans accent pour le répertoire `./src/pages`)

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

- Les fichiers portent le nom de leur export

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

##### Python

- le **snake_case** est utilisé pour les variables, les fonctions et les noms des fichiers et des répertoires

```python
nom_de_ma_variable = 'valeur'

def nom_de_ma_fonction(paramètre1: type) -> TypeDeRetour:
  pass
```

- le **PascalCase** est utilisé pour les classes

```python
class NomDeMaClasse:
  pass
```

##### Frontend

- pas de texte brut, utiliser l’interface *Wording*

- déporter au maximum l’intelligence des composants graphiques (.tsx) dans des **hooks** pour épurer leur HTML

##### SQL

- Tout en minuscule ;
- Aucun accent ;
- Mots séparés par un underscore ;
- La longueur du champs ne doit pas faire 36/37 caractères sinon il retourne `undefined` quand on utilise `getRepository()`...

#### Système de design de l'État (DSFR)

- utiliser le DSFR au maximum sinon, écrire le CSS dans un fichier à part (*\<Composant>.module.css*) et l'importer dans le composant

- chaque composant du DSFR doit importer son CSS (minifié) et celui de ses dépendances, le CSS **core** étant déjà importé globalement
  > Réduire au maximum la taille des fichiers téléchargés

- le javascript du DSFR est importé globalement et la version minifiée est mise dans le dossier public

##### Mettre à jour le design système : 
Pour mettre à jour le design système il faut :
- Mettre à jour la dépendance avec yarn 
- Naviger dans @gouvfr/dsfr/dist/
- Copier, depuis les node_modules, les fichiers `dsfr.module.min.js` et `dsfr.nomodule.min.js` de la nouvelle version dans le dossier public (on peut également ajouter les sources maps)
- Si besoin, mettre à jour le lien des scripts dans `_app.tsx`
- Faire un contrôle visuel de l'appli et des intéractions
- Consulter les [notes de version](https://www.systeme-de-design.gouv.fr/a-propos/versions-du-dsfr/version-courante#code) pour s'assurer qu'il n'y a pas de breaking changes 

Pour le moment le design système est très éparpillé dans le code. Le html et les classes sont copiés collés un peu partout   
il faut donc être assez vigilant sur la régression visuelle. Une modification du design system pourra entrainer des rechercher / remplacer dans toute l'app. 

Une solution à mettre en place serait d'isoler les composant du DS dans nos composants React au maximum.

#### Tests

- Les fichiers de tests sont placés aux côtés du fichier testé ;

- Les fichiers de tests portent le nom du fichier testé et sont suffixés par `.test.ts(x?)` ;

- Les verbes décrivant une action de méthode sont à l'impératif, comme c'est le cas dans la méthode testée ;

- Les objets attendus sont déclarés dans la partie *THEN* des tests ;

- Les graphiques (canvas) ne sont pas testés. On teste leur alternative textuel (tableau) ;

- Quand c'est nécessaire d'exprimer une constante qui apporte du contexte alors il faut le faire sinon, on peut mettre directement l'objet ou la fonction dans les méthodes de type `insert`, `mockResolvedValueOnce`, `toStrictEqual`, etc.
