# Intégration GitBook

1. Relier cette branche `doc/documentation` dans GitBook (menu *Sources > Connect repository*).
2. Choisir le dossier `documentation/` comme racine de l’espace GitBook.
3. Une fois le lien actif, déclencher une synchronisation initiale côté GitBook.
4. Revenir sur ce dépôt et récupérer la structure générée par GitBook via `git pull`.

Après la première synchronisation, les pushs sur `doc/documentation` seront automatiquement reflétés dans GitBook. Inversement, les modifications faites sur GitBook devront être rapatriées par pull avant toute nouvelle contribution locale.
