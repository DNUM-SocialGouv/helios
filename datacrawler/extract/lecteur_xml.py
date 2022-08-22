import pandas as pd


def lis_le_fichier_xml(chemin_du_fichier: str, xpath: str) -> pd.DataFrame:
    xsl = """<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" omit-xml-declaration="no" indent="yes"/>
    <xsl:strip-space elements="*"/>

    <!-- IDENTITY TEMPLATE TO COPY XML AS IS -->
    <xsl:template match="node()|@*">
       <xsl:copy>
         <xsl:apply-templates select="node()|@*"/>
       </xsl:copy>
    </xsl:template>

    <xsl:template match="nofinesset">
      <xsl:copy>
        <xsl:variable name="quot">"</xsl:variable>
        <xsl:value-of select="concat($quot, text(), $quot)"/>
      </xsl:copy>
    </xsl:template>

    <xsl:template match="de">
      <xsl:copy>
        <xsl:variable name="quot">"</xsl:variable>
        <xsl:value-of select="concat($quot, text(), $quot)"/>
      </xsl:copy>
    </xsl:template>

    <xsl:template match="ta">
      <xsl:copy>
        <xsl:variable name="quot">"</xsl:variable>
        <xsl:value-of select="concat($quot, text(), $quot)"/>
      </xsl:copy>
    </xsl:template>

    <xsl:template match="client">
      <xsl:copy>
        <xsl:variable name="quot">"</xsl:variable>
        <xsl:value-of select="concat($quot, text(), $quot)"/>
      </xsl:copy>
    </xsl:template>

</xsl:stylesheet>"""
    données_brutes = pd.read_xml(chemin_du_fichier, xpath=xpath, stylesheet=xsl)
    return (
        données_brutes.assign(nofinesset=lambda x: x["nofinesset"].str.replace('"', ""))
        .assign(de=lambda x: x["de"].str.replace('"', ""))
        .assign(ta=lambda x: x["ta"].str.replace('"', ""))
        .assign(client=lambda x: x["client"].str.replace('"', ""))
    )
