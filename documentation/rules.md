# Règles pour contribuer à la documentation

## Règles de contribution

1. **Langue** : produire en français clair, orienté produit, sans jargon technique non expliqué.
2. **Traçabilité** : lorsqu'une règle provient d'une décision ou d'un processus data, citer la source fonctionnelle (ex. « pipeline Diamant », « comité COPIL RH ») plutôt qu'un fichier technique.
3. **Structure GitBook** : toute nouvelle page doit être référencée dans `SUMMARY.md` pour apparaître dans la navigation.
4. **Synchronisation** : avant d'écrire, tirer (`git pull`) les dernières modifications GitBook ; après rédaction, pousser (`git push`) pour déclencher la mise à jour GitBook.
5. **Validation croisée** : faire relire les sections sensibles (règles métier, sécurité) par un binôme produit + métier.
6. **Historique** : noter les décisions structurantes dans `ADR/` ou dans une section « Décisions » du document concerné.
7. **Contextualisation avec image** : mettre dans le contenu des indicateurs textuel pour indiquer là où illustrer avec une capture d'écran.
8. **Sous-dossiers documentaires** : lorsqu'un sous-dossier est créé pour regrouper plusieurs pages, créer un fichier `README.md` dans ce sous-dossier pour introduire la section.
9. **Marqueurs de captures** : utiliser la notation `[Capture écran : description]` pour indiquer où des captures d'écran seraient utiles dans la documentation.

## Note pour les contributeurs techniques

Pour le contexte technique détaillé (architecture, rôles, sources de données, structure BDD, règles métier, workflows), voir `.cursor/rules.md` qui contient toutes les informations nécessaires pour comprendre le produit Helios.
