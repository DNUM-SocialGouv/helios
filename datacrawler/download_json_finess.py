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
GZIP_MAGIC_BYTES = b"\x1f\x8b"
MAX_GZIP_LAYERS = 5


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


def _decompresse_le_flux_json_finess(chemin_archive: Path, chemin_destination: Path) -> None:
    chemin_courant = chemin_archive
    fichiers_temporaires: list[Path] = []
    try:
        for index_couche in range(MAX_GZIP_LAYERS):
            if not _est_un_fichier_gzip(chemin_courant):
                shutil.move(chemin_courant, chemin_destination)
                return

            chemin_decompresse = chemin_archive.parent / f"{chemin_archive.name}.{index_couche}.decompressed"
            fichiers_temporaires.append(chemin_decompresse)
            with gzip.open(chemin_courant, "rb") as archive:
                with open(chemin_decompresse, "wb") as fichier_decompresse:
                    shutil.copyfileobj(archive, fichier_decompresse)
            if chemin_courant != chemin_archive:
                chemin_courant.unlink()
            chemin_courant = chemin_decompresse

        raise ValueError("Le fichier FINESS reste compressé après plusieurs décompressions gzip.")
    finally:
        fichiers_a_supprimer = [chemin_archive, *fichiers_temporaires]
        for fichier_temporaire in fichiers_a_supprimer:
            if fichier_temporaire.exists() and fichier_temporaire != chemin_destination:
                fichier_temporaire.unlink()


def _est_un_fichier_gzip(chemin_du_fichier: Path) -> bool:
    with open(chemin_du_fichier, "rb") as fichier:
        return fichier.read(2) == GZIP_MAGIC_BYTES


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
    _decompresse_le_flux_json_finess(temporary_finess_data_path, finess_data_path)

    print(f"Fichier téléchargé : {finess_data_path}")


if __name__ == "__main__":
    main()
