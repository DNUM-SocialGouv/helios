import logging
from logging import Logger

import pandas as pd


def charge_un_fichier_xml(chemin: str, xpath: str) -> pd.DataFrame:
    xsl = """<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" omit-xml-declaration="no" indent="yes"/>
    <xsl:strip-space elements="*"/>

    <!-- IDENTITY TEMPLATE TO COPY XML AS IS -->
    <xsl:template match="node()|@*">
       <xsl:copy>
         <xsl:apply-templates select="node()|@*"/>
       </xsl:copy>
    </xsl:template>

    <!-- ENCLOSE telephone NODES WITH DOUBLE QUOTES -->
    <xsl:template match="telephone">
      <xsl:copy>
        <xsl:variable name="quot">"</xsl:variable>
        <xsl:value-of select="concat($quot, text(), $quot)"/>
      </xsl:copy>
    </xsl:template>

    <!-- ENCLOSE numvoie NODES WITH DOUBLE QUOTES -->
    <xsl:template match="numvoie">
      <xsl:copy>
        <xsl:variable name="quot">"</xsl:variable>
        <xsl:value-of select="concat($quot, text(), $quot)"/>
      </xsl:copy>
    </xsl:template>

</xsl:stylesheet>"""
    # https://pandas.pydata.org/docs/dev/whatsnew/v1.5.0.html#read-xml-now-supports-dtype-converters-and-parse-dates
    return pd.read_xml(chemin, xpath=xpath, stylesheet=xsl) # type: ignore


def configure_logger() -> Logger:
    logger = logging.getLogger("helios")
    logger.setLevel(logging.INFO)
    return logger
