from datetime import datetime, timezone
import pandas as pd
from sqlalchemy.engine import Engine, create_engine
import requests
from datacrawler.dependencies.dépendances import initialise_les_dépendances

# Mapping de codes de rôles à leurs niveaux Matomo
ROLE_LEVEL_MAPPING = {
    "USER": "ars",
    "ADMIN_REG": "regional",
    "ADMIN_CENTR": "central",
    # ADMIN_NAT sera ignoré
}

ADMIN_NAT_CODE = "ADMIN_NAT"

def get_inactive_users(engine: Engine) -> pd.DataFrame:
    query = """
        SELECT 
            r.role_code AS role_code,
            COUNT(DISTINCT u.ut_id) AS inactive_users
        FROM utilisateur u
        JOIN role r ON u.ut_role = r.role_id
        WHERE u.ut_date_last_connection < NOW() - INTERVAL '6 months'
        GROUP BY r.role_id, r.role_code
        ORDER BY r.role_code
    """

    result = pd.read_sql(query, engine)

    return result

def send_matomo_event(value: int, token_auth: str, site_id: int, matomo_url: str, role_level: str) -> None:
    payload = {
        "idsite": site_id,
        "rec": 1,

        "e_c": "indicateur",
        "e_a": "utilisateurs_inactifs",
        "e_n": role_level,
        "e_v": value,

        "cdt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
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

    inactive_users_by_role = get_inactive_users(base_de_données_helios)
    # Send Matomo event for each role (except admin national)
    for _, row in inactive_users_by_role.iterrows():
        role_code = row["role_code"].strip()
        # Ignorer le rôle admin national
        if role_code == ADMIN_NAT_CODE:
            logger_helios.info(f"Skipping role: {role_code}")
            continue
        # Récupérer le niveau correspondant
        mapped_role_level = ROLE_LEVEL_MAPPING.get(role_code)
        if mapped_role_level:
            send_matomo_event(
                value=int(row["inactive_users"]),
                token_auth=variables_d_environnement["MATOMO_API_TOKEN"],
                site_id=int(variables_d_environnement["NEXT_PUBLIC_MATOMO_SITE_ID"]),
                matomo_url=variables_d_environnement["NEXT_PUBLIC_MATOMO_URL"],
                role_level=mapped_role_level
            )
            logger_helios.info(f"Event sent for {role_code} ({mapped_role_level}): {int(row['inactive_users'])} users")
        else:
            logger_helios.warning(f"Unknown role mapping for: {role_code}")
