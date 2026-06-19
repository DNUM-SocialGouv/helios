import pandas as pd
from sqlalchemy.engine import Engine, create_engine
import requests
from datacrawler.dependencies.dépendances import initialise_les_dépendances

def get_inactive_users(engine: Engine) -> int:
    query = """
        SELECT COUNT(DISTINCT ut_id) AS inactive_users
        FROM utilisateur
        WHERE ut_date_last_connection < NOW() - INTERVAL '6 months'
    """

    result = pd.read_sql(query, engine)

    return int(result["inactive_users"].iloc[0])

def send_matomo_event(value: int, token_auth: str, site_id: int, matomo_url: str) -> None:
    payload = {
        "idsite": site_id,
        "rec": 1,

        "e_c": "HELIOS",
        "e_a": "utilisateurs",
        "e_n": "inactifs",
        "e_v": value,

        "token_auth": token_auth
    }

    response = requests.post(
        f"{matomo_url}/matomo.php",
        data=payload,
        timeout=10
    )

    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")

    response.raise_for_status()

if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    inactive_users = get_inactive_users(base_de_données_helios)
    send_matomo_event(
        value=inactive_users,
        token_auth=variables_d_environnement["MATOMO_API_TOKEN"],
        site_id=variables_d_environnement["NEXT_PUBLIC_MATOMO_SITE_ID"],
        matomo_url=variables_d_environnement["NEXT_PUBLIC_MATOMO_URL"]
    )
