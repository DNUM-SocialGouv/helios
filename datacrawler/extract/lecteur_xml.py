from typing import Callable, List

import pandas as pd
from numpy import NaN


def génère_le_template_d_insertion_de_doubles_quotes(balise: str) -> str:
    return f"""<xsl:template match="{balise}">
      <xsl:copy>
        <xsl:variable name="quot">"</xsl:variable>
        <xsl:value-of select="concat($quot, text(), $quot)"/>
      </xsl:copy>
    </xsl:template>"""


def supprime_les_doubles_quotes(balise: str) -> Callable:
    return lambda ligne: ligne[balise].str.replace('"', "")


def lis_le_fichier_xml(chemin_du_fichier: str, xpath: str, balises_à_échapper: List[str]) -> pd.DataFrame:
    xsl = f"""<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" omit-xml-declaration="no" indent="yes"/>
    <xsl:strip-space elements="*"/>

    <!-- IDENTITY TEMPLATE TO COPY XML AS IS -->
    <xsl:template match="node()|@*">
       <xsl:copy>
         <xsl:apply-templates select="node()|@*"/>
       </xsl:copy>
    </xsl:template>

    {"".join([génère_le_template_d_insertion_de_doubles_quotes(balise) for balise in balises_à_échapper])}

</xsl:stylesheet>"""
    données_brutes = pd.read_xml(chemin_du_fichier, xpath=xpath, stylesheet=xsl)

    return données_brutes.assign(**{balise: supprime_les_doubles_quotes(balise) for balise in balises_à_échapper}).replace("", NaN)
