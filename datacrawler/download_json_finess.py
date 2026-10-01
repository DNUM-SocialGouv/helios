import gzip
import shutil
from pathlib import Path
from urllib.parse import unquote, urlparse
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from datacrawler.dependencies.dépendances import initialise_les_dépendances

LOCAL_PATH_SUFFIX = "finess"
JSON_LOCAL_PATH_SUFFIX = "json"
REQUEST_TIMEOUT_SECONDS = 120
RETRY_HTTP_STATUS_CODES = (500, 502, 503, 504)


def _construis_session_http_avec_retry() -> requests.Session:
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=RETRY_HTTP_STATUS_CODES,
        allowed_methods=("GET",),
        raise_on_status=False,
    )
    session = requests.Session()
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


def _construis_le_chemin_du_fichier_finess_depuis_l_url_de_reponse(response_url: str, finess_data_directory: Path) -> Path:
    nom_du_fichier = Path(unquote(urlparse(response_url).path)).name
    if not nom_du_fichier:
        raise ValueError("L'URL de téléchargement FINESS ne contient pas de nom de fichier.")
    finess_data_path = finess_data_directory / nom_du_fichier
    if finess_data_path.suffix == ".gz":
        return finess_data_path.with_suffix("")
    return finess_data_path

def main() -> None:
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    finess_structure_data_path = variables_d_environnement["STRUCTURES_FINESS_DATA_PATH"]
    finess_data_directory = Path(variables_d_environnement["FINESS_SFTP_LOCAL_PATH"]) / LOCAL_PATH_SUFFIX / JSON_LOCAL_PATH_SUFFIX

    if finess_data_directory.exists():
        shutil.rmtree(finess_data_directory)

    finess_data_directory.mkdir(parents=True, exist_ok=True)
    temporary_finess_data_path = finess_data_directory / "structures-finess.json.gz.download"
    logger_helios.info(f"[FINESS] Télécharge le fichier des structures FINESS depuis {finess_structure_data_path}.")
    with _construis_session_http_avec_retry() as session:
        with session.get(finess_structure_data_path, stream=True, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            response.raise_for_status()
            finess_data_path = _construis_le_chemin_du_fichier_finess_depuis_l_url_de_reponse(response.url, finess_data_directory)
            with open(temporary_finess_data_path, "wb") as fichier_compresse:
                shutil.copyfileobj(response.raw, fichier_compresse)
    with gzip.open(temporary_finess_data_path, "rb") as gz:
        with open(finess_data_path, "wb") as fichier:
            shutil.copyfileobj(gz, fichier)
    temporary_finess_data_path.unlink()

    print(f"Fichier téléchargé : {finess_data_path}")

if __name__ == "__main__":
    main()
