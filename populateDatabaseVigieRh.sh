#!/bin/bash

echo "$SSH_KEY" | base64 --decode >$SFTP_PRIVATE_KEY
echo "$DIAMANT_PRIVATE_KEY" | base64 --decode | gpg --import
echo "$SFTP_DNUM_KEY" | base64 --decode >$DNUM_SFTP_PRIVATE_KEY

python -m datacrawler.download_vigierh_data &&
	python -m datacrawler.import_vigierh_tranches_ages &&
	python -m datacrawler.import_vigie_rh_profession_filiere &&
	python -m datacrawler.import_vigie_rh_mouvements &&
	python -m datacrawler.import_vigie_rh_mouvements_trimestriels &&
	python -m datacrawler.import_vigierh_motifs_ruptures_contrats &&
	python -m datacrawler.import_vigierh_duree_cdd &&
	python -m datacrawler.import_vigierh_cdd_cdi &&
	python -m datacrawler.import_vigierh_cdi_cdd_trimestriel
