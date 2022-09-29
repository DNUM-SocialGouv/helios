#! /bin/bash

echo "$DIAMANT_KEY" | base64 --decode | gpg --import
