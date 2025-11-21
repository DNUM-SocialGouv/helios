# Grandes EPIC fonctionnelles

## 1. Recherche & découverte
- **Recherche simple et avancée** : `RechercheParmiLesEntitésEtÉtablissementsUseCase.ts` et `RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase.ts` pilotent les API `pages/api/recherche*.ts` ; l’UI se trouve dans `src/frontend/ui/recherche-avancee/`.
- **Historique & suggestions** : `SearchHistoryUseCase.ts` + composant `src/frontend/ui/search-history` pour rejouer les recherches.
- **Catégories FINESS** : `CategoriesFinessUseCase.ts` expose la taxonomie explorée dans les formulaires.

## 2. Fiche 360 entité / établissement
- **Entité juridique** : `RécupèreLEntitéJuridiqueUseCase.ts` ragrège capacité, budget, ressources humaines et inspections pour la page `src/pages/entite-juridique/[numeroFiness].tsx`.
- **Établissements territoriaux** : use cases spécialisés (`RécupèreLÉtablissementTerritorialMédicoSocialUseCase.ts`, `RécupèreLÉtablissementTerritorialSanitaireUseCase.ts`) alimentent les composants `src/frontend/ui/établissement-territorial-*`.
- **Navigation parent/enfant** : `RécupèreLesÉtablissementsTerritoriauxRattachésÀLEntitéJuridiqueUseCase.ts` alimente les tables de rattachement.

## 3. Comparaison multi-structures
- **Construction des scénarios** : `ComparaisonEtablissementsUseCase.ts` expose la logique, tandis que `ComparaisonPage.tsx` gère la sélection des FINESS, les années et l’export Excel.
- **Listes de favoris** : `ListeActionsButton` et `src/frontend/ui/liste/` permettent d’enregistrer des combinaisons pour usage ultérieur.
- **Alertes & infobulles** : `contenuModal` contextualise chaque indicateur et rappelle la date de mise à jour (`DatesMisAjourSources`).

## 4. Administration & sécurité
- **Gestion des utilisateurs** : `UtilisateursUseCase.ts` + pages `src/pages/settings/users` couvrent création, activation, reset mot de passe.
- **Profils métiers** : `ProfilesUseCase.ts` + UI `parametrage-profil` définissent les filtres d’accès aux indicateurs.
- **Rôles & middleware** : `RolesUseCase.ts`, `checkAdminMiddleware.ts`, `checkNationalAdminMiddleware.ts` sécurisent les routes sensibles.

## 5. Suivi des données et pipelines
- **Data crawler** : scripts `datacrawler/ajoute_le_bloc_*` agrègent budget, finances, ressources humaines, activités.
- **Vigie RH** : l’EPIC RH (`vigie-rh/ContratUseCase.ts`) expose contrats et mouvements.
- **Qualité des données** : endpoints de comparaison (`getDatesMisAJourSourcesComparaison`) affichent la fraîcheur des sources sur l’UI.
