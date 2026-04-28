from datacrawler import import_vigie_rh_mouvements_trimestriels, import_vigie_rh_profession_filiere, import_vigierh_tranches_ages, import_vigie_rh_mouvements, import_vigierh_motifs_ruptures_contrats, import_vigierh_duree_cdd, import_vigierh_cdd_cdi, import_vigierh_cdi_cdd_trimestriel
from datacrawler.rapport.generate_report import generate_report
from datacrawler.rapport.send_email import send_email
from datacrawler.rapport.send_report_status import SEND_REPORT


def main() -> None:
    results = []
    results.append(import_vigierh_tranches_ages.main())
    results.append(import_vigie_rh_profession_filiere.main())
    results.append(import_vigie_rh_mouvements.main())
    results.append(import_vigie_rh_mouvements_trimestriels.main())
    results.append(import_vigierh_motifs_ruptures_contrats.main())
    results.append(import_vigierh_duree_cdd.main())
    results.append(import_vigierh_cdd_cdi.main())
    results.append(import_vigierh_cdi_cdd_trimestriel.main())
    if any(r.get('report_status') == SEND_REPORT for r in results):
        html_body = generate_report(results)
        send_email(html_body)
    else:
        print("No changes detected, report and email not sent.")


if __name__ == "__main__":
    main()
