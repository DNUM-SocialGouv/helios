import json

import requests

from datacrawler.dependencies.dépendances import initialise_les_dépendances


def send_email( report_html):
    logger_helios, variables_d_environnement = initialise_les_dépendances()

    sender_address = variables_d_environnement["TIPIMAIL_SENDER_ADDRESS"]
    sender_name = variables_d_environnement["TIPIMAIL_SENDER_NAME"]
    api_user = variables_d_environnement["TIPIMAIL_APIUSER"]
    api_key = variables_d_environnement["TIPIMAIL_APIKEY"]
    recipients = json.loads(
            variables_d_environnement.get("TIPIMAIL_TO_ADDRESSES", "[]")
        )
    
    body = {
        "to": [{"address": email} for email in recipients],
        "msg": {
            "from": {
                "personalName": sender_name,
                "address": sender_address
            },
            "subject": "[Helios] Rapport ingestion Vigie RH",
            "html": report_html
        }
    }



    response = requests.post(
        "https://api.tipimail.com/v1/messages/send",
        headers={
            "Content-Type": "application/json",
            "X-Tipimail-ApiUser": api_user,
            "X-Tipimail-ApiKey": api_key
        },
        json=body
    )

    if response.status_code != 200:
        logger_helios.info(f"Erreur Tipimail: {response.status_code} - {response.text}")
    return response.json()
