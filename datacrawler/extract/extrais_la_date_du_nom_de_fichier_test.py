from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_diamant, extrais_la_date_du_nom_de_fichier_finess


class TestExtraisLaDateDuNomDeFichier:
    def test_extrais_la_date_du_nom_de_fichier_diamant(self) -> None:
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"

        # WHEN
        date_extraite = extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier)

        # THEN
        assert date_extraite == "20220607"

    def test_extrais_la_date_du_nom_de_fichier_finess(self) -> None:
        # GIVEN
        chemin_du_fichier = "data_set/flux_finess/enrichi/finess_cs1400105_stock_20220816-0449.xml"

        # WHEN
        date_extraite = extrais_la_date_du_nom_de_fichier_finess(chemin_du_fichier)

        # THEN
        assert date_extraite == "20220816"
