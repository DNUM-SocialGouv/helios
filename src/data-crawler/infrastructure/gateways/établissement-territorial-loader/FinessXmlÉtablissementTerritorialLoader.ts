import { readdirSync } from 'fs'

import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { XmlToJs } from '../../../métier/gateways/XmlToJs'
import { ÉtablissementTerritorialLoader } from '../../../métier/gateways/ÉtablissementTerritorialLoader'

type ÉtablissementTerritorialIdentitéFiness = Readonly<{
  nofinesset: Readonly<{
    _text?: string,
  }>
  nofinessej: Readonly<{
    _text?: string,
  }>
  rs: Readonly<{
    _text?: string,
  }>
  rslongue: Readonly<{
    _text?: string,
  }>
  complrs: Readonly<{
    _text?: string,
  }>
  compldistrib: Readonly<{
    _text?: string,
  }>
  numvoie: Readonly<{
    _text?: string,
  }>
  typvoie: Readonly<{
    _text?: string,
  }>
  voie: Readonly<{
    _text?: string,
  }>
  compvoie: Readonly<{
    _text?: string,
  }>
  lieuditbp: Readonly<{
    _text?: string,
  }>
  commune: Readonly<{
    _text?: string,
  }>
  libcommune: Readonly<{
    _text?: string,
  }>
  departement: Readonly<{
    _text?: string,
  }>
  libdepartement: Readonly<{
    _text?: string,
  }>
  codepostal: Readonly<{
    _text?: string,
  }>
  ligneacheminement: Readonly<{
    _text?: string,
  }>
  codepays: Readonly<{
    _text?: string,
  }>
  libellepays: Readonly<{
    _text?: string,
  }>
  telephone: Readonly<{
    _text?: string,
  }>
  telecopie: Readonly<{
    _text?: string,
  }>
  courriel: Readonly<{
    _text?: string,
  }>
  categetab: Readonly<{
    _text?: string,
  }>
  libcategetab: Readonly<{
    _text?: string,
  }>
  libcourtcategetab: Readonly<{
    _text?: string,
  }>
  categagretab: Readonly<{
    _text?: string,
  }>
  libcategagretab: Readonly<{
    _text?: string,
  }>
  libcourtcategagretab: Readonly<{
    _text?: string,
  }>
  typeet: Readonly<{
    _text?: string,
  }>
  nofinessppal: Readonly<{
    _text?: string,
  }>
  natureet: Readonly<{
    _text?: string,
  }>
  siret: Readonly<{
    _text?: string,
  }>
  datemodifsiret: Readonly<{
    _text?: string,
  }>
  originemodifsiret: Readonly<{
    _text?: string,
  }>
  codeape: Readonly<{
    _text?: string,
  }>
  codemft: Readonly<{
    _text?: string,
  }>
  libmft: Readonly<{
    _text?: string,
  }>
  libcourtmft: Readonly<{
    _text?: string,
  }>
  codesph: Readonly<{
    _text?: string,
  }>
  libsph: Readonly<{
    _text?: string,
  }>
  libcourtsph: Readonly<{
    _text?: string,
  }>
  dateouv: Readonly<{
    _text?: string,
  }>
  datelimite: Readonly<{
    _text?: string,
  }>
  indcaduc: Readonly<{
    _text?: string,
  }>
  typefermeture: Readonly<{
    _text?: string,
  }>
  datefermeture: Readonly<{
    _text?: string,
  }>
  dateautor: Readonly<{
    _text?: string,
  }>
  datemaj: Readonly<{
    _text?: string,
  }>
  numuai: Readonly<{
    _text?: string,
  }>
}>

export type ÉtablissementTerritorialIdentitéFluxFiness = Readonly<{
  fluxfiness: {
    structureet: ÉtablissementTerritorialIdentitéFiness[]
  }
}>

export class FinessXmlÉtablissementTerritorialLoader implements ÉtablissementTerritorialLoader {
  private readonly préfixeDuFichierÉtablissementTerritorialIdentité = 'finess_cs1400102_stock_'

  constructor(private readonly convertXmlToJs: XmlToJs, private readonly localPath: string) {}

  récupèreLesÉtablissementsTerritoriaux(): ÉtablissementTerritorialIdentité[] {
    const cheminDuFichierÉtablissementTerritorialIdentité = this.récupèreLeCheminDuFichierÉtablissementTerritorialIdentité(this.localPath)

    const dateDeMiseAJourDeLaSource = this.récupèreLaDateDeMiseAJourDeLaSource(cheminDuFichierÉtablissementTerritorialIdentité)

    const établissementTerritorialFluxFinessIdentité = this.convertXmlToJs.handle
      <ÉtablissementTerritorialIdentitéFluxFiness>(cheminDuFichierÉtablissementTerritorialIdentité)

    const établissementsTerritoriauxIdentité = établissementTerritorialFluxFinessIdentité.fluxfiness.structureet.map(
      (établissementTerritorialIdentité: ÉtablissementTerritorialIdentitéFiness) =>
        this.construitÉtablissementTerritorialIdentité(établissementTerritorialIdentité, dateDeMiseAJourDeLaSource)
    )

    return établissementsTerritoriauxIdentité
  }

  private récupèreLeCheminDuFichierÉtablissementTerritorialIdentité(localPath: string): string {
    const fichiersDuRépertoireSimple = readdirSync(`${localPath}/finess/simple`)

    return localPath + '/finess/simple/' + fichiersDuRépertoireSimple.filter((fichier) => fichier.includes(this.préfixeDuFichierÉtablissementTerritorialIdentité))
  }

  private récupèreLaDateDeMiseAJourDeLaSource(cheminDuFichierÉtablissementTerritorial: string): string {
    return cheminDuFichierÉtablissementTerritorial.split(this.préfixeDuFichierÉtablissementTerritorialIdentité)[1].slice(0, 8)
  }

  private construitÉtablissementTerritorialIdentité(
    établissementTerritorialIdentitéFiness: ÉtablissementTerritorialIdentitéFiness,
    dateMiseAJourSource: string
  ): ÉtablissementTerritorialIdentité {
    const valueOrEmpty = (value?: string): string => value || ''

    return {
      adresseAcheminement: valueOrEmpty(établissementTerritorialIdentitéFiness.ligneacheminement._text),
      adresseNuméroVoie: valueOrEmpty(établissementTerritorialIdentitéFiness.numvoie._text),
      adresseTypeVoie: valueOrEmpty(établissementTerritorialIdentitéFiness.typvoie._text),
      adresseVoie: valueOrEmpty(établissementTerritorialIdentitéFiness.voie._text),
      catégorieÉtablissement: valueOrEmpty(établissementTerritorialIdentitéFiness.categetab._text),
      courriel: valueOrEmpty(établissementTerritorialIdentitéFiness.courriel._text),
      dateMiseAJourSource,
      numéroFinessEntitéJuridique: valueOrEmpty(établissementTerritorialIdentitéFiness.nofinessej._text),
      numéroFinessÉtablissementPrincipal: valueOrEmpty(établissementTerritorialIdentitéFiness.nofinessppal._text),
      numéroFinessÉtablissementTerritorial: valueOrEmpty(établissementTerritorialIdentitéFiness.nofinesset._text),
      raisonSociale: valueOrEmpty(établissementTerritorialIdentitéFiness.rs._text),
      typeÉtablissement: valueOrEmpty(établissementTerritorialIdentitéFiness.typeet._text),
      téléphone: valueOrEmpty(établissementTerritorialIdentitéFiness.telephone._text),
    }
  }
}
