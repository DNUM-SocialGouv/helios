import subprocess
from logging import Logger


def log_process(logger: Logger, process: subprocess.CompletedProcess) -> None:
    if process.stdout:
        _formatte_et_log(process.stdout, logger)
    if process.stderr:
        _formatte_et_log(process.stderr, logger)


def _formatte_et_log(sortie_du_process: bytes, logger: Logger) -> None:
    sorties_mises_en_forme = sortie_du_process.decode().split('\n')
    for sortie in sorties_mises_en_forme:
        logger.info(sortie)
