import logging
from logging import Logger


def crée_le_logger() -> Logger:
    logger = logging.getLogger("Helios")
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter("[%(name)s] [%(levelname)s] %(message)s")

    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    logger.addHandler(handler)

    return logger
