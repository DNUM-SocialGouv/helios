#! /bin/bash

echo "$SSH_KEY" | base64 --decode > $SFTP_PRIVATE_KEY
echo "$DIAMANT_PRIVATE_KEY" | base64 --decode | gpg --import

yarn populateDatabase
