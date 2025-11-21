# Règles métiers clés

## Accès & sécurité
1. **Filtrage par rôle** : seules les priorités 1 et 2 peuvent accéder aux fonctions d’administration. Les parcours identifient le rôle dès la connexion pour adapter les écrans disponibles.
2. **Profil régional appliqué partout** : chaque utilisateur est associé à un périmètre géographique qui limite automatiquement les résultats et exports.
3. **Profils métiers** : les indicateurs visibles dépendent du profil (financier, ressources humaines, qualité, etc.) afin d’éviter la surcharge d’information.

## Recherche et sélection FINESS
1. **Sélection persistante** : les FINESS ajoutés pour comparaison restent disponibles d’un écran à l’autre tant que l’utilisateur ne les supprime pas.
2. **Détermination automatique du type** : dès que la sélection comporte un type dominant (sanitaire, médico-social, entité juridique), l’interface se réadapte (grilles, filtres, wording).
3. **Tri et pagination côté serveur** : les règles de tri et de pagination sont centralisées pour garantir une cohérence parfaite entre l’écran, l’export et les API utilisées par d’autres outils.

## Fiche 360
1. **Couplage entité/établissements** : la navigation parent → enfants n’affiche que les établissements effectivement rattachés pour éviter les confusions.
2. **Blocs thématiques normés** : chaque fiche se compose des mêmes blocs (Budget & finances, Ressources humaines, Activité, Autorisations, Qualité/Réclamations) pour faciliter la comparaison.
3. **Mise à jour des dates sources** : chaque bloc indique l’année ou la période couverte. Lorsque la donnée est indisponible ou obsolète, un message explicite est affiché.

## Listes, favoris et historique
1. **Listes persistées** : les listes sauvegardées conservent le nom de l’auteur, la date de création et les FINESS inclus pour assurer la traçabilité.
2. **Historique horodaté** : toutes les recherches sont enregistrées avec l’horodatage et les filtres afin de rejouer un diagnostic et suivre les actions passées.
3. **Partage sécurisé** : seuls les rôles habilités peuvent partager une liste à l’échelle régionale ou nationale.

## Administration
1. **Gestion des comptes** : création, activation, suspension et suppression suivent un workflow avec notifications. Aucune action irréversible sans confirmation.
2. **Réinitialisation sécurité** : les emails de réinitialisation contiennent des liens à durée limitée et sont journalisés pour audit.
3. **Ordonnancement des rôles** : la hiérarchie (national > régional > central > utilisateur) s’applique à toutes les décisions (affichage des menus, accès API, priorisation des demandes).

## Données & pipelines
1. **Sources officielles** : seules les sources validées par la DGOS (Diamant, HAPI, SIICEA, SIVSS, Vigie RH…) alimentent Helios afin de garantir la fiabilité des chiffres.
2. **Chiffrement et conformité** : les flux sensibles sont chiffrés bout en bout et les clés sont stockées dans des coffres forts dédiés.
3. **Tests de cohérence** : chaque indicateur critique dispose de contrôles automatiques (bornes, delta d’évolution, alignement FINESS) avant publication.
