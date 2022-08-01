# A-t-on tous les éléments pour récupérer et déchiffrer les données DIAMANT ?

DIAMANT nous a envoyé ses données chiffrées dans notre sftp. Nous voulons valider que nous pouvons récupérer ces données et les déchiffrer avec notre clef.

## Hypothèse falsifiable

Notre infrastructure existante (sftp, scalingo), nos droits et nos variables d'environnement (clef de chiffrement incluse) sont suffisants pour déchiffrer les données depuis un one-off container de Scalingo

## Configuration de l'expérimentation

- [x] Copier les données déposées par DIAMANT sur le SFTP
- [x] Déchiffrer un csv à l'aide de notre clef privée

## Résultats

### Copier les données déposées par DIAMANT sur le SFTP

1. Se connecter à Scalingo
   ```bash
   yarn bash:production
   ```
2. Récupérer les données du sftp
   ```bash
   echo "$SFTP_DNUM_KEY" | base64 --decode > ./dnum-ssh-key
   chmod 400 ./dnum-ssh-key
   sftp -v -P <port> -i ./dnum-ssh-key <user>@<ip>
   cd /DIAMANT/incoming
   get -r *
   bye
   ```

### Déchiffrer un csv à l'aide de notre clef privée

1. Ajouter la clef pour la variable d'environnement `DIAMANT_KEY` sur Scalingo
2. Déchiffrer les données :
   ```bash
   echo "$DIAMANT_KEY" | base64 --decode > ./diamant-crypto-key
   gpg --import diamant-crypto-key
   gpg --output fichier.csv --decrypt <fichier>.gpg
   ```

## Conclusion

- ✅ [VALIDÉ] nous arrivons bien à récupérer les données DIAMANT dans le sftp et à les déchiffrer en utilisant gpg (installé déjà sur Scalingo)


## Prochaines étapes

- Automatiser la récupération de données de DIAMANT
