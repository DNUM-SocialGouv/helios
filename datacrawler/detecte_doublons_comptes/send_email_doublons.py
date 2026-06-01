from typing import List

import requests

from datacrawler.dependencies.dépendances import initialise_les_dépendances


def _build_html(doublons: List) -> str:
    rows = "".join(
        f'<tr><td style="padding: 8px; border: 1px solid #ddd;">{row.email}</td>'
        f'<td style="padding: 8px; border: 1px solid #ddd;">{row.count}</td>'
        f'<td style="padding: 8px; border: 1px solid #ddd;">{"<br>".join(d.strftime("%d/%m/%Y") for d in row.dates_creation)}</td></tr>'
        for row in doublons
    )
    return f"""
    <h2>Détection de comptes Helios en doublon</h2>
    <p>Les adresses email suivantes sont associées à plusieurs comptes :</p>
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Email</th>
          <th style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Nombre de comptes</th>
          <th style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Dates de création</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
    <p>Merci de vérifier et de traiter ces doublons.</p>
    """


def send_email_doublons(doublons: List) -> None:
    _, variables_d_environnement = initialise_les_dépendances()

    body = {
        "to": [{"address": variables_d_environnement["SUPPORT_EMAIL"]}],
        "msg": {
            "from": {
                "personalName": variables_d_environnement["TIPIMAIL_SENDER_NAME"],
                "address": variables_d_environnement["TIPIMAIL_SENDER_ADDRESS"],
            },
            "subject": "[Helios] Comptes en doublon détectés",
            "html": _build_html(doublons),
        },
    }

    response = requests.post(
        "https://api.tipimail.com/v1/messages/send",
        headers={
            "Content-Type": "application/json",
            "X-Tipimail-ApiUser": variables_d_environnement["TIPIMAIL_APIUSER"],
            "X-Tipimail-ApiKey": variables_d_environnement["TIPIMAIL_APIKEY"],
        },
        json=body,
        timeout=30,
    )

    if response.status_code != 200:
        raise RuntimeError(f"Erreur Tipimail: {response.status_code} - {response.text}")
