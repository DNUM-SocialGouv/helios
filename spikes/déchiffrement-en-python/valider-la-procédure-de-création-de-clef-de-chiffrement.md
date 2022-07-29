# Comment créer programatiquement la clef de chiffrement à fournir à DIAMANT ?

DIAMANT nous enverra ses données chiffrées. Nous voulons valider l'utilisation de la commande `gpg` pour créer une paire de clefs.
Nous souhaitons également vérifier que nous sommes en capacité de :
- chiffrer un document en utilisant la clef publique que nous allons fournir à DIAMANT ;
- déchiffrer ce même document en utilisant la clef privée correspondante.

## Hypothèses falsifiables

Nous pensons que :
- `gpg` nous permettra de générer une paire de clefs adaptées au chiffrement / déchiffrement des documents ;
- Nous pourrons utiliser une librairie python pour déchiffrer ces documents, en ayant le document chiffré et notre clef privée comme entrée

## Configuration de l'expérimentation

- [x] Créer une paire de clefs en utilisant `gpg`
- [x] Chiffrer un document avec la clef publique ainsi générée
- [x] Identifier une librairie Python permettant de déchiffrer le document
- [x] Déchiffrer le document

## Résultats

### Créer la paire de clefs

1. Générer les clefs :
    ```bash
    gpg --generate-key
    ```
    Il faut alors renseigner quelques informations : 
    - nom de la clef (pour cet exemple, "helios")
    - adresse e-mail (l'adresse e-mail technique)
    - pas besoin de passphrase
2. Exporter la clef publique (à envoyer à DIAMANT) :
    ```bash
    gpg --output helios-chiffrement-publique --export --armor helios
    ```
3. Exporter la clef privée (à mettre sur SCALINGO) :
    ```bash
    gpg --output helios-chiffrement-privée --export-secret-key --armor helios
    ```

### Chiffrer un document

1. Créer un document de test
   ```bash
   echo 'test' > a_chiffrer.txt
   ```
2. Chiffrer le document
    ```bash
    gpg --output chiffre.gpg --encrypt --recipient helios@octo.com a_chiffrer.txt
    ```

### Identifier une librairie python pour le déchiffrage

❌ Pas de librairie Python suffisamment bien maintenue qui gère le chiffrement avec GPG. Pour [plus de détails](https://wiki.python.org/moin/GnuPrivacyGuard#Accessing_GnuPG_via_gpgme).
➡️ C'est faisable avec `gpg` : on peut partir sur l'installation de cette commande sur Scalingo et l'exécution de bash *via* Python (sans librairie).


### Déchiffrer un document
```bash
gpg --import helios_crypto_private
gpg --decrypt chiffre.gpg > a_chiffrer.txt
```

## Conclusion

- ✅ [VALIDÉ] `gpg` nous permettra de générer une paire de clefs adaptées au chiffrement / déchiffrement des documents ;
- ❌ [REJETÉ] Nous pourrons utiliser une librairie python pour déchiffrer ces documents, en ayant le document chiffré et notre clef privée comme entrée



## Prochaines étapes

- Envoyer la clef publique à DIAMANT et attendre leur confirmation sur la possibilité de chiffrer les données ;
- Sauvegarder la clef privée sur Scalingo
- Essayer de déchiffrer les documents fournis par DIAMANT à la main ;
- Automatiser le déchiffrement
