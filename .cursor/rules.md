# Règles Cursor pour la documentation Helios

1. **Périmètre** : les contributions de l’assistant doivent se limiter à la documentation fonctionnelle dans `documentation/`. Seules les instructions explicites de l’utilisateur autorisent des modifications ailleurs.
2. **Ton et style** : adopter une écriture claire, orientée produit. Bannir les références directes au code (fichiers, chemins, langages) sauf demande contraire.
3. **Structure GitBook** : toute nouvelle page documentaire doit être ajoutée dans `documentation/SUMMARY.md`. Vérifier que les titres H1/H2 restent cohérents.
4. **Synchronisation** : toujours exécuter `git pull` avant de modifier la documentation et `git push` après validation pour maintenir la synchro GitBook.
5. **Sources métiers** : lorsqu’un point fait référence à une règle métier ou à un processus data, mentionner la source fonctionnelle (ex. « pipeline Diamant ») plutôt qu’un composant technique.
6. **Traçabilité des décisions** : documenter les décisions structurantes dans la section adaptée (par ex. ajouter un encart « Décisions » en bas de page si nécessaire).
7. **Validation** : pour les sujets sensibles (sécurité, gouvernance des données), proposer systématiquement une relecture croisée produit/métier.
8. **Sous-dossiers documentaires** : lorsqu’un sous-dossier est créé pour regrouper plusieurs pages (ex. `recherche-et-decouverte/`), créer un fichier `README.md` dans ce sous-dossier pour introduire la section et présenter les pages qu’elle contient.
9. **Navigation GitBook** : toute nouvelle page créée doit être ajoutée dans `documentation/SUMMARY.md` pour qu’elle apparaisse dans la navigation GitBook. Les sous-dossiers doivent également inclure leur `README.md` dans le sommaire.
10. **Respect des instructions utilisateur** : en cas de doute sur la portée ou la structure souhaitée, poser des questions avant d’exécuter.

