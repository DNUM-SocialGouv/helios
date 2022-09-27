import os
import subprocess
from base64 import b64decode


def déchiffre_diamant(
        dossier_avec_les_données_chiffrées: str,
        dossier_où_sauveagarder_les_csv: str,
        clef_privée_diamant: str,
) -> None:
    gpg = subprocess.run('which gpg', shell=True, capture_output=True)
    clef_privée = b64decode(clef_privée_diamant)
    subprocess.run(f'{gpg} --import {clef_privée}', shell=True)
    for basename_du_fichier_avec_les_données_chiffrées in os.listdir(dossier_avec_les_données_chiffrées):
        nom_cible_du_fichier_déchiffré = os.path.join(
            dossier_où_sauveagarder_les_csv,
            basename_du_fichier_avec_les_données_chiffrées[:-4]
        )
        fichier_chiffré = os.path.join(
            dossier_avec_les_données_chiffrées,
            basename_du_fichier_avec_les_données_chiffrées
        )
        subprocess.run(f'gpg ---output {nom_cible_du_fichier_déchiffré} --decrypt {fichier_chiffré}', shell=True)

