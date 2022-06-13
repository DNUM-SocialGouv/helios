#! /bin/bash

echo "$SSH_KEY" | base64 --decode > $SFTP_PRIVATE_KEY

yarn start
