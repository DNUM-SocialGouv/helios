from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier


class TestExtraisLaDateDuNomDeFichier:
    def test_extrais_la_date_du_nom_de_fichier(self) -> None:
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"

        # WHEN
        date_extraite = extrais_la_date_du_nom_de_fichier(chemin_du_fichier)

        # THEN
        assert date_extraite == "20220607"
