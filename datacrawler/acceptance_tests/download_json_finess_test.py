import gzip
from pathlib import Path

from datacrawler.download_json_finess import _decompresse_le_flux_json_finess


def test_decompresse_toutes_les_couches_gzip_avant_de_sauvegarder_le_json(tmp_path: Path) -> None:
    chemin_archive = tmp_path / "structures-finess.json.gz.download"
    chemin_destination = tmp_path / "finess-structures-journalier-20261001.json"
    contenu_json = b'{"pmej": []}'
    chemin_archive.write_bytes(gzip.compress(gzip.compress(contenu_json)))

    _decompresse_le_flux_json_finess(chemin_archive, chemin_destination)

    assert chemin_destination.read_bytes() == contenu_json
    assert chemin_destination.read_bytes()[:2] != b"\x1f\x8b"
    assert not chemin_archive.exists()
