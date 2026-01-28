# Atlasanté

## Présentation

Atlasanté est une intégration externe permettant d'accéder à des informations complémentaires sur les établissements de santé.

## Fonctionnement du bouton

[Capture écran : bouton Atlasanté sur une fiche établissement]

Le bouton Atlasanté est présent sur les fiches d'établissements sanitaires et permet d'ouvrir la fiche correspondante dans Atlasanté dans un nouvel onglet.

### Maintenance

**Point d'attention** : avec la nouvelle version d'Atlasanté, il est nécessaire de vérifier le maintien du fonctionnement du bouton France DROM (France métropolitaine et départements/régions d'outre-mer).

### Actions à réaliser

- Vérifier que le bouton fonctionne correctement avec la nouvelle version d'Atlasanté.
- Tester l'accès pour les établissements situés en DROM.
- Valider que l'URL de redirection est correcte et à jour.

## Intégration technique

Le bouton Atlasanté utilise l'identifiant FINESS de l'établissement pour construire l'URL de redirection vers Atlasanté.

[Note technique : l'URL est construite selon le format attendu par Atlasanté avec le numéro FINESS en paramètre]
