import os

from datacrawler.déchiffre_diamant import déchiffre_diamant


class DéchiffreDiamant:
    def test_(self):
        # Given
        ENCRYPTED_DIAMANT_DATA_PATH = './data_set/diamant/'
        number_of_encrypted = os.lis
        DIAMANT_DATA_PATH = './data_test/diamant/'
        for file in os.listdir(DIAMANT_DATA_PATH):
            os.unlink(file)
        assert not os.listdir(DIAMANT_DATA_PATH)


        # When
        déchiffre_diamant(ENCRYPTED_DIAMANT_DATA_PATH, DIAMANT_DATA_PATH)

        # Then
        created_files = os.listdir(DIAMANT_DATA_PATH)
