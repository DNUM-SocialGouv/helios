import subprocess
from logging import Logger
from typing import List


def log_process(logger: Logger, process: subprocess.CompletedProcess) -> None:
    if process.stdout:
        for sortie in _formatte(process.stdout):
            if sortie:
                logger.info(sortie)
    if process.stderr:
        for sortie in _formatte(process.stderr):
            if sortie:
                logger.error(sortie)


def _formatte(sortie_du_process: bytes) -> List[str]:
    return sortie_du_process.decode().split('\n')
