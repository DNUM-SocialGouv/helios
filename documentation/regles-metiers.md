# Règles métiers clés

## Accès & sécurité
1. **Filtrage par rôle** : les routes d’API utilisent `checkAdminMiddleware.ts` et `checkNationalAdminMiddleware.ts` pour n’autoriser que les ordres 1-2 (ADMINS) ou 1 (national) selon le besoin.
2. **Profil régionale appliqué partout** : `codeRegion` circule du middleware jusqu’aux pages (ex. `ComparaisonPage.tsx`) pour circonscrire les résultats à la région de l’utilisateur.
3. **Profils métiers** : chaque utilisateur possède un ensemble de profils (`ProfilModel`) qui conditionnent les indicateurs visibles (`ComparaisonEtablissementsUseCase` prend la liste `profiles`).

## Recherche et sélection FINESS
1. **Stockage client** : les FINESS comparés sont conservés en `sessionStorage` (`ComparaisonPage.tsx`, lignes 63-151) pour rappeler la sélection entre les écrans.
2. **Détermination automatique du type** : `getTypesFromFiness` retourne les catégories des FINESS sélectionnés ; la comparaison force alors le type correspondant (Médico-social, Sanitaire, Entité juridique).
3. **Pagination & tri server-side** : les paramètres `order`, `orderBy`, `page` sont envoyés à l’API, ce qui garantit des résultats cohérents avec les exports.

## Fiche 360
1. **Couplage entité/établissements** : la navigation parent → enfants repose sur `RécupèreLesÉtablissementsTerritoriauxRattachésÀLEntitéJuridiqueUseCase.ts`, garantissant que seuls les établissements rattachés sont montrés.
2. **Blocs thématiques** : les scripts `datacrawler/ajoute_le_bloc_*` définissent la granularité des blocs (Budget & finances, Ressources humaines, Activité, Autorisations, Réclamations). Chaque bloc correspond à une carte sur les fiches.
3. **Mise à jour des dates sources** : `DatesMisAjourSources` alimente les infobulles de chaque indicateur pour rappeler l’année de référence.

## Listes, favoris et historique
1. **Listes persistées** : `FavorisUseCase.ts` sauvegarde les combinaisons FINESS nommées ; un succès déclenche `SuccessAlert` dans `ComparaisonPage`.
2. **Historique horodaté** : `SearchHistoryUseCase.ts` conserve les termes, filtres et date pour replay.

## Administration
1. **Gestion des comptes** : `UtilisateursUseCase.ts` encapsule la création, l’activation et la suppression ; seuls les admins y accèdent.
2. **Réinitialisation sécurité** : APIs `pages/api/mot-passe-oublie.ts` et `pages/api/update-password.ts` orchestrent les emails (via `sendEmail.ts`).
3. **Ordonnancement des rôles** : la colonne `ordre` (migration `1720428140655`) fixe la hiérarchie et simplifie les comparaisons (`user.role === 1` pour national, etc.).

## Données & pipelines
1. **Sources officielles** : Diamant, HAPI, SIICEA, SIVSS, Vigie RH (cf. noms de fichiers sous `data_set/` et `datacrawler/`).
2. **Chiffrement et conformité** : certains flux (`data_test/`, `download_data_source/`) embarquent des fichiers `.gpg` et des clés pour protéger les données sensibles.
3. **Tests de cohérence** : chaque use case critique possède un test associé (`*.test.ts`) garantissant la stabilité métier.
