import pandas as pd
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from sqlalchemy.engine import Engine, create_engine
import requests


def get_active_users(engine: Engine) -> int:
    query = """
        SELECT COUNT(DISTINCT ut_id) AS active_users
        FROM utilisateur
        WHERE ut_date_last_connection >= NOW() - INTERVAL '6 months'
    """

    df = pd.read_sql(query, engine)

    return int(df["active_users"].iloc[0])

def send_matomo_event(value: int, token_auth: str, site_id: int, matomo_url: str) -> None:
    payload = {
        "idsite": site_id,
        "rec": 1,

        "e_c": "HELIOS",
        "e_a": "utilisateurs",
        "e_n": "actifs",
        "e_v": value,

        "token_auth": token_auth
    }

    response = requests.post(
        f"{matomo_url}/matomo.php",
        data=payload,
        timeout=10
    )

    response.raise_for_status()

if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    active_users = get_active_users(base_de_données_helios)
    send_matomo_event(
        value=active_users,
        token_auth=variables_d_environnement["MATOMO_API_TOKEN"],
        site_id=variables_d_environnement["NEXT_PUBLIC_MATOMO_SITE_ID"],
        matomo_url=variables_d_environnement["NEXT_PUBLIC_MATOMO_URL"]
    )
