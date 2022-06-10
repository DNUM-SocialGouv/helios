#! /bin/bash

# Il faut utiliser un conteneur de type XL 2 GB

# Lance les migrations
yarn migrations

# Ecris le fichier ssh private key
echo "$SSH_KEY" | base64 --decode > $SFTP_PRIVATE_KEY


