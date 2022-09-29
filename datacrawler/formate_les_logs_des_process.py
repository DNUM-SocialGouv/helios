import subprocess
from logging import Logger
from typing import List


def log_process(logger: Logger, process: subprocess.CompletedProcess) -> None:

    for sortie in _formatte(process.stdout):
        if process.stdout:
            logger.info(sortie)
        if process.stderr:
            logger.error(sortie)


def _formatte(sortie_du_process: bytes) -> List[str]:
    return sortie_du_process.decode().split('\n')

