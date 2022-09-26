#! /bin/bash

echo "$DIAMANT_PUBLIC_KEY" | base64 --decode > data_set/crypto_keys/diamant-crypto-public-key
gpg --import data_set/crypto_keys/diamant-crypto-public-key

for csv_diamant in ./data_set/diamant/*
do
gpg --output ./data_set/diamant_chiffré/$(basename $csv_diamant).gpg --encrypt --recipient clef_dev_hcsv_diamantios $csv_diamant
