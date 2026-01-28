# SFTP/API

## Présentation

Les données sources sont récupérées principalement via **SFTP** (Secure File Transfer Protocol) depuis les serveurs des différents fournisseurs de données.

## Sources récupérées via SFTP

### DNUM SFTP

Serveur SFTP de la DNUM (Direction du Numérique) pour :
- **DIAMANT** : données DIAMANT (ANN_ERRD_EJ_ET, MEN_PMSI, etc.)
- **SIICEA** : données inspections et contrôles
- **SIVSS** : données événements indésirables graves
- **SIREC** : données réclamations
- **FINESS** : fichiers FINESS (CS1400101-5, CS1600101-2, AMM_ARHGOS)

### HAPI SFTP

Serveur SFTP HAPI pour :
- **HAPI** : données d'activité HAPI

### Vigie RH SFTP

Serveur SFTP Vigie RH pour :
- **DSN** : données Déclaration Sociale Nominative (contrats, mouvements, effectifs)

## Processus de récupération

1. **Connexion SFTP** : authentification avec clés SSH
2. **Liste des fichiers** : identification des nouveaux fichiers à télécharger
3. **Téléchargement** : récupération des fichiers
4. **Vérification** : contrôle de l'intégrité des fichiers
5. **Déchiffrement** : déchiffrement des fichiers chiffrés (si applicable)
6. **Transformation** : traitement par le datacrawler

## Sécurité

- Authentification par clés SSH
- Chiffrement des données en transit
- Stockage sécurisé des clés dans des coffres forts
- Logs des opérations de récupération

## API (si applicable)

Certaines sources peuvent également être récupérées via API REST. Dans ce cas, l'authentification se fait via tokens ou clés API.

## Voir aussi

- [CRON](cron.md) : planification des récupérations
- [Sources de données](../) : détails par source
