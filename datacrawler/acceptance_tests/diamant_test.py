import os

import pandas as pd

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.déchiffre_diamant import déchiffre_diamant


class TestDéchiffreDiamant:
    def test_crée_autant_de_fichiers_csv_qu_il_y_a_de_gpg(self):
        # Given
        logger_helios, variables_d_environnement = initialise_les_dépendances()
        encrypted_diamant_data_path = 'data_set/diamant_chiffré'
        number_of_encrypted_files = len(os.listdir(encrypted_diamant_data_path))
        diamant_data_path = 'data_test/diamant/'
        for file in os.listdir(diamant_data_path):
            os.unlink(os.path.join(diamant_data_path, file))
        assert not os.listdir(diamant_data_path)

        # When
        déchiffre_diamant(
            encrypted_diamant_data_path,
            diamant_data_path,
            variables_d_environnement["DIAMANT_KEY"]
        )

        # Then
        created_files = os.listdir(diamant_data_path)
        assert len(created_files) == number_of_encrypted_files
        for file in created_files:
            assert not pd.read_csv(file).empty
