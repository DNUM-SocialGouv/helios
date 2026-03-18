from datacrawler import  import_vigie_rh_profession_groupe
from datacrawler.rapport.generate_report import generate_report
from datacrawler.rapport.send_email import send_email

results = []

results.append(import_vigie_rh_profession_groupe.main())


HTML_BODY = generate_report(results)
send_email(HTML_BODY)
