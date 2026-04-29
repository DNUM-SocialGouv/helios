#!/bin/bash

echo "$SSH_KEY" | base64 --decode >$SFTP_PRIVATE_KEY
echo "$DIAMANT_PRIVATE_KEY" | base64 --decode | gpg --import
echo "$SFTP_DNUM_KEY" | base64 --decode >$DNUM_SFTP_PRIVATE_KEY

python -m datacrawler.download_finess_data &&
	python -m datacrawler.download_diamant_data &&
	python -m datacrawler.déchiffre_diamant &&
	python -m datacrawler.import_les_entites_juridiques &&
	python -m datacrawler.import_les_etablissements_territoriaux &&
	python -m datacrawler.import_ref_categories &&
	python -m datacrawler.ajoute_les_activités_des_établissements_médico_sociaux &&
	python -m datacrawler.ajoute_les_activités_des_établissements_sanitaires &&
	python -m datacrawler.import_activites_mensuel &&
	python -m datacrawler.import_activites_mensuel_entite_juridique &&
	python -m datacrawler.ajoute_les_autorisations_des_établissements_médico_sociaux &&
	python -m datacrawler.ajoute_les_autorisations_des_établissements_sanitaires &&
	python -m datacrawler.ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux &&
	python -m datacrawler.ajoute_le_bloc_ressources_humaines_des_établissements_médico_sociaux &&
	python -m datacrawler.agrégation_activité_sanitaire &&
	python -m datacrawler.agrégation_capacité_sanitaire &&
	python -m datacrawler.ajoute_le_bloc_budget_et_finances_des_entite_juridiques &&
	python -m datacrawler.download_sirec_data &&
	python -m datacrawler.check_downloaded_sirec_file &&
	python -m datacrawler.import_reclamations &&
	python -m datacrawler.download_sivss_data &&
	python -m datacrawler.check_downloaded_sivss_file &&
	python -m datacrawler.import_evenements_indesirables &&
	python -m datacrawler.download_siicea_data &&
	python -m datacrawler.check_downloaded_siicea_file &&
	python -m datacrawler.import_inspections &&
	python -m datacrawler.ajoute_le_bloc_ressources_humaines_des_entites_juridiques &&
	python -m datacrawler.ajoute_le_bloc_ressources_humaines_des_etablissements_sanitaires &&
	python -m datacrawler.import_les_donnees_qualite_has &&
	python -m datacrawler.import_les_ms_pas_qualite_has &&
	python -m datacrawler.download_starsfir_data &&
	python -m datacrawler.import_allocation_ressource_starsfir
