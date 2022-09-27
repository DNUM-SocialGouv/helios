#! /bin/bash

echo "$DIAMANT_PUBLIC_KEY" | base64 --decode | gpg --import

for csv_diamant in ./data_set/diamant/*
do
gpg --output ./data_set/diamant_chiffré/"$(basename $csv_diamant)".gpg --encrypt --recipient clef_dev_helios $csv_diamant
done
