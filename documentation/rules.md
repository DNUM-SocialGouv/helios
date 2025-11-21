# Règles pour contribuer à la documentation

1. **Langue** : produire en français clair, orienté produit et évitez le jargon technique non expliqué.
2. **Traçabilité** : citer les fichiers ou use cases associés (`src/backend/métier/use-cases/*`, `datacrawler/*`, etc.) pour chaque règle métier ajoutée.
3. **Structure GitBook** : toute nouvelle page doit être référencée dans `SUMMARY.md` pour apparaître dans la navigation.
4. **Synchronisation** : avant d’écrire, tirer (`git pull`) les dernières modifications GitBook ; après rédaction, pousser (`git push`) pour déclencher la mise à jour GitBook.
5. **Validation croisée** : faire relire les sections sensibles (règles métier, sécurité) par un binôme produit + métier.
6. **Historique** : noter les décisions structurantes dans `ADR/` ou dans une section « Décisions » du document concerné.
