#!/bin/bash

echo "$SSH_KEY" | base64 --decode >$SFTP_PRIVATE_KEY
echo "$DIAMANT_PRIVATE_KEY" | base64 --decode | gpg --import
echo "$SFTP_DNUM_KEY" | base64 --decode >$DNUM_SFTP_PRIVATE_KEY

python -m datacrawler.download_vigierh_data &&
	python -m datacrawler.import_vigie_rh_profession_groupe
