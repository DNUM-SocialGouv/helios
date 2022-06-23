class DataCrawlerTest:
    def test_sauvegarde_les_données_de_ann_errd_ej_et(self):
        # GIVEN
        chemin_vers_les_fichiers = 'données'

        # WHEN
        crée_la_table_activité_médico_social(chemin_vers_les_fichiers)

        # THEN