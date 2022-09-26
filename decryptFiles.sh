#! /bin/bash

echo "$DIAMANT_KEY" | base64 --decode > ./diamant-crypto-key
gpg --import diamant-crypto-key
gpg --output fichier.csv --decrypt <fichier>.gpg
