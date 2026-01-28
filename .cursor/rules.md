# Règles Cursor pour la documentation Helios

## Règles de contribution à la documentation

1. **Périmètre** : les contributions de l'assistant doivent se limiter à la documentation fonctionnelle dans `documentation/`. Seules les instructions explicites de l'utilisateur autorisent des modifications ailleurs.
2. **Ton et style** : adopter une écriture claire, orientée produit. Bannir les références directes au code (fichiers, chemins, langages) sauf demande contraire.
3. **Structure GitBook** : toute nouvelle page documentaire doit être ajoutée dans `documentation/SUMMARY.md`. Vérifier que les titres H1/H2 restent cohérents.
4. **Synchronisation** : toujours exécuter `git pull` avant de modifier la documentation et `git push` après validation pour maintenir la synchro GitBook.
5. **Sources métiers** : lorsqu'un point fait référence à une règle métier ou à un processus data, mentionner la source fonctionnelle (ex. « pipeline Diamant ») plutôt qu'un composant technique.
6. **Traçabilité des décisions** : documenter les décisions structurantes dans la section adaptée (par ex. ajouter un encart « Décisions » en bas de page si nécessaire).
7. **Validation** : pour les sujets sensibles (sécurité, gouvernance des données), proposer systématiquement une relecture croisée produit/métier.
8. **Sous-dossiers documentaires** : lorsqu'un sous-dossier est créé pour regrouper plusieurs pages (ex. `recherche-et-decouverte/`), créer un fichier `README.md` dans ce sous-dossier pour introduire la section et présenter les pages qu'elle contient.
9. **Navigation GitBook** : toute nouvelle page créée doit être ajoutée dans `documentation/SUMMARY.md` pour qu'elle apparaisse dans la navigation GitBook. Les sous-dossiers doivent également inclure leur `README.md` dans le sommaire.
10. **Marqueurs de captures** : utiliser la notation `[Capture écran : description]` pour indiquer où des captures d'écran seraient utiles dans la documentation. Placer ces marqueurs de manière stratégique pour illustrer les fonctionnalités décrites.
11. **Exhaustivité fonctionnelle** : lors de la création de sous-pages pour une EPIC, être exhaustif dans le détail des fonctionnalités mais rester concis. Décrire les éléments fonctionnels, les règles métier, l'affichage des résultats et les cas limites sans entrer dans des détails techniques inutiles.
12. **Structure des blocs** : lorsqu'une fonctionnalité est organisée en blocs (ex. : blocs d'une fiche), documenter chaque bloc avec ses éléments fonctionnels, ses règles d'affichage et ses cas limites. Mentionner les interactions possibles (repli/dépli, export, etc.).
13. **Respect des instructions utilisateur** : en cas de doute sur la portée ou la structure souhaitée, poser des questions avant d'exécuter.

## Contexte produit Helios pour Cursor

### Architecture produit

Helios adopte une architecture découplée en trois parties distinctes :

- **Datacrawler** : responsable de la récupération des données auprès des sources externes (SFTP, API), transformation et chargement dans la base de données. Adopte une Clean Architecture avec séparation métier/infrastructure.
- **Backend** : responsable de servir les données issues de la base de données Helios pour le frontend. Utilise également une Clean Architecture avec use-cases, gateways et controllers.
- **Frontend** : application Next.js/React responsable de l'affichage des fiches de synthèse et de l'interface utilisateur.

Le découplage permet d'isoler les règles métier de la récupération de données et de minimiser l'impact des modifications des sources externes sur l'application.

### Rôles et permissions

Helios définit 4 rôles avec des priorités décroissantes :

| Code rôle | Libellé | Priorité | Responsabilités clés |
|-----------|---------|----------|---------------------|
| `ADMIN_NAT` | Administrateur national | 1 | Gouvernance globale, création des comptes, paramétrage des profils métiers, supervision multi-régions |
| `ADMIN_REG` | Administrateur régional | 2 | Gestion des comptes de son territoire, animation des établissements de la région, validation des listes partagées |
| `ADMIN_CENTR` | Administration centrale | 3 | Lecture consolidée, préparation d'analyses transverses, support aux équipes régionales |
| `USER` | Agent utilisateur | 4 | Consultation quotidienne des fiches 360°, comparaison d'établissements, constitution de listes de suivi |

**Règles d'accès** :
- Seules les priorités 1 et 2 accèdent aux fonctions d'administration (gestion utilisateurs, paramétrage profils).
- Chaque utilisateur est associé à une institution (région) qui limite automatiquement les résultats et exports.
- Les profils métiers déterminent les indicateurs visibles (financier, ressources humaines, qualité, etc.).

### Sources de données principales

Helios agrège des données provenant de multiples sources officielles validées par la DGOS :

**FINESS** :
- CS1400101-5 : fichiers FINESS établissements
- CS1600101-2 : fichiers FINESS entités juridiques
- AMM_ARHGOS : autorisations sanitaires

**DIAMANT** :
- ANN_ERRD_EJ_ET : données annuelles ERRD (entités juridiques et établissements territoriaux)
- ANN_MS_TDP_ET : données médico-sociales TDP (établissements territoriaux)
- MEN_PMSI_ANNUEL / MEN_PMSI_MENCUMU : données PMSI mensuelles
- ANN_RPU : données urgences annuelles
- ANN_SAE : données SAE annuelles (mise à jour en septembre)
- ANN_CA_EJ_ET : données comptes annuels
- QUO_SAN_FINANCE : données financières sanitaires
- MEN_HAPI : données HAPI mensuelles

**HAPI** : données d'activité HAPI

**Qualité** :
- SIICEA : données inspections et contrôles
- SIVSS : données événements indésirables graves
- SIREC : données réclamations

**Vigie RH** :
- Contrats (nature, durée CDD)
- Mouvements (embauches, départs, taux de rotation)
- Pyramide des âges
- Motifs de rupture de contrats
- Effectifs par profession/filière

### Structure BDD clé

Référence : `.cursor/schema_bdd.md` pour le détail complet.

**Entités principales** :
- `entite_juridique` : entités morales responsables des établissements (identifiant : `numero_finess_entite_juridique`)
- `etablissement_territorial` : établissements sanitaires et médico-sociaux (identifiant : `numero_finess_etablissement_territorial`)
- `utilisateur` : comptes utilisateurs avec rôles et profils
- `user_list` / `user_list_etablissement` : listes d'établissements sauvegardées par les utilisateurs
- `favori` : favoris utilisateurs
- `search_history` : historique des recherches

**Tables d'indicateurs** :
- Activité : `activite_sanitaire`, `activite_medico_social`, `activite_sanitaire_mensuel`, `activite_sanitaire_entite_juridique`
- Finances : `budget_et_finances_sanitaire`, `budget_et_finances_medico_social`, `budget_et_finances_entite_juridique`, `allocation_ressource_ej`, `allocation_ressource_et`
- RH : `ressources_humaines_sanitaire`, `ressources_humaines_medico_social`, `ressources_humaines_entite_juridique`, tables `vigierh_*`
- Qualité : `reclamation_etablissement_territorial`, `evenement_indesirable_etablissement_territorial`, `inspections_controles_etablissement_territorial`
- Autorisations : `autorisation_sanitaire_amm`, `autorisation_medico_social`, `capacite_autorisation_sanitaire`, `reconnaissance_contractuelle_sanitaire`

**Relations clés** :
- `etablissement_territorial.numero_finess_entite_juridique` → `entite_juridique.numero_finess_entite_juridique` (navigation parent/enfant)
- Toutes les tables d'indicateurs référencent `numero_finess_etablissement_territorial` ou `numero_finess_entite_juridique`

### Règles métier essentielles

**Filtrage et accès** :
- Filtrage automatique par rôle et profil régional : chaque utilisateur voit uniquement les établissements de son périmètre géographique.
- Les profils métiers déterminent les indicateurs visibles (ex. profil financier voit les blocs Budget & Finances, profil RH voit les blocs Ressources Humaines).

**Détermination du type** :
- Le système détermine automatiquement le type (sanitaire/médico-social/entité juridique) à partir des données FINESS.
- L'interface s'adapte selon le type dominant dans une sélection (grilles, filtres, wording).

**Navigation parent/enfant** :
- Navigation fluide entre entité juridique et établissements rattachés.
- La navigation n'affiche que les établissements effectivement rattachés pour éviter les confusions.

**Blocs thématiques normés** :
- Chaque fiche se compose des mêmes blocs : Budget & Finances, Ressources Humaines, Activité, Autorisations, Qualité/Réclamations.
- Chaque bloc indique l'année ou la période couverte et affiche un message explicite si la donnée est indisponible ou obsolète.

**Listes et favoris** :
- Les listes sauvegardées conservent le nom de l'auteur, la date de création et les FINESS inclus pour assurer la traçabilité.
- Seuls les rôles habilités peuvent partager une liste à l'échelle régionale ou nationale.

**Gestion des comptes** :
- Comptes désactivés automatiquement après 6 mois d'inactivité (basé sur `ut_date_last_connection`).
- Création de compte : l'utilisateur peut créer son propre compte, les admins peuvent modifier autorisations et droits.
- Conditions de création : VPN ministère, format d'adresse mail autorisé, PC ministère/ARS (PC Mac n'accède pas à Helios).
- Mot de passe oublié : accessible depuis la page d'accueil et le menu, ancien mot de passe non autorisé lors de la création d'un nouveau mot de passe.

**Recherche et comparaison** :
- Tri et pagination côté serveur pour garantir la cohérence entre l'écran, l'export et les API.
- Historique horodaté : toutes les recherches sont enregistrées avec l'horodatage et les filtres.
- Comparaison : limite de 30000 établissements maximum par comparaison.

### Indicateurs principaux

**Activité sanitaire** :
- Séjours médecine/chirurgie/obstétrique (complets et partiels)
- SSR (séjours et journées complètes/partielles)
- Psychiatrie (journées complètes/partielles)
- Urgences (nombre de passages)
- HAD (hospitalisation à domicile)
- USLD (unités de soins de longue durée)
- Durées moyennes de séjour par discipline

**Activité médico-sociale** :
- Taux d'occupation (accueil de jour, hébergement temporaire/permanent, externat, semi-internat, internat, séances)
- File active personnes accompagnées
- Journées d'absence
- Durée moyenne de séjour

**Finances** :
- Budget titres I-IV (global et section H pour sanitaire)
- CAF (capacité d'autofinancement)
- Vétusté des constructions
- Fonds de roulement
- Résultat net comptable
- Ratio de dépendance financière
- Allocation de ressources (enveloppes budgétaires)

**Ressources Humaines** :
- ETP PM (personnels médicaux) et PNM (personnels non médicaux)
- Absentéisme (jours d'absence PM/PNM)
- Intérim (dépenses intérim PM)
- Vigie RH : contrats (CDD/CDI), mouvements (embauches/départs), taux de rotation, pyramide des âges, durées CDD, motifs de rupture

**Qualité** :
- Réclamations (encours et clôturées par motif)
- Événements indésirables graves (EIGS)
- Inspections et contrôles (nombre d'écarts, remarques, injonctions, prescriptions, recommandations)

### Workflows clés

**Création de compte** :
1. Utilisateur remplit le formulaire (nom, prénom, email, institution)
2. Vérification du format d'email (pour ADMIN_CENTR : domaine doit être sg.social.gouv.fr, sante.gouv.fr ou social.gouv.fr)
3. Vérification que l'email n'existe pas déjà
4. Création du compte avec mot de passe temporaire (format : "HeliosConnect-" + code géographique institution)
5. Attribution automatique du rôle USER (ou ADMIN_CENTR si institution = ADMIN_CENTR)
6. Attribution du profil par défaut
7. Compte activé automatiquement

**Recherche** :
1. Saisie dans le formulaire (simple ou avancée)
2. Recherche dans la table `recherche` (indexée sur raison sociale, termes, géographie)
3. Filtrage par région selon le profil utilisateur
4. Affichage résultats (vignettes ou tableau)
5. Enregistrement dans `search_history` avec horodatage

**Comparaison** :
1. Sélection d'établissements (depuis recherche, favoris, listes)
2. Détermination automatique du type dominant
3. Récupération des années disponibles pour les établissements sélectionnés
4. Sélection de l'année de référence
5. Calcul des indicateurs comparatifs selon les profils utilisateur
6. Affichage dans un tableau avec tris et pagination
7. Possibilité d'export Excel

**Gestion des listes** :
1. Création d'une liste (nom, établissements)
2. Sauvegarde dans `user_list` et `user_list_etablissement`
3. Ajout/suppression d'établissements (un ou plusieurs)
4. Modification du titre
5. Suppression de la liste
6. Import depuis un fichier FINESS
7. Partage (si rôle habilité)

**Administration** :
1. Paramétrage des autorisations : définition des indicateurs/blocs visibles par profil
2. Paramétrage de l'aide : création/modification/suppression de contenus d'aide (paramétrable)
3. Console d'administration : distinction admin national (toutes régions) et régional (sa région uniquement)

### Références techniques

- **Schéma BDD complet** : `.cursor/schema_bdd.md`
- **Architecture** : voir `ADR/` pour les décisions d'architecture
- **Code source** :
  - `database/models/` : modèles TypeORM des entités
  - `src/backend/métier/` : use-cases et règles métier
  - `src/frontend/ui/` : composants React de l'interface
  - `datacrawler/` : scripts Python de récupération et transformation des données
