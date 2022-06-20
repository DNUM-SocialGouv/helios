import logging
from logging import Logger

import pandas as pd


def charge_un_fichier_xml(chemin: str, xpath: str) -> pd.DataFrame:
    # https://pandas.pydata.org/docs/dev/whatsnew/v1.5.0.html#read-xml-now-supports-dtype-converters-and-parse-dates
    return pd.read_xml(chemin, xpath=xpath)


def configure_logger() -> Logger:
    logger = logging.getLogger("helios")
    logger.setLevel(logging.INFO)
    return logger
