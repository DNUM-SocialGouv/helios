from datacrawler import  import_vigie_rh_profession_groupe
from datacrawler.rapport.generate_report import generate_report
from datacrawler.rapport.send_email import send_email

def main():
    results = []
    results.append(import_vigie_rh_profession_groupe.main())
    if any(r.get('changed') == 'ok' for r in results):
        html_body = generate_report(results)
        send_email(html_body)
    else:
        print("No changes detected, report and email not sent.")

if __name__ == "__main__":
    main()
