import { readdirSync } from 'fs'

import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueLoader } from '../../../métier/gateways/EntitéJuridiqueLoader'
import { XmlToJs } from '../../../métier/gateways/XmlToJs'

type EntitéJuridiqueFiness = Readonly<{
  categetab: Readonly<{
    _text?: string,
  }>
  codeape: Readonly<{
    _text?: string,
  }>
  codepays: Readonly<{
    _text?: string,
  }>
  codepostal: Readonly<{
    _text?: string,
  }>
  commune: Readonly<{
    _text?: string,
  }>
  compldistrib: Readonly<{
    _text?: string,
  }>
  complrs: Readonly<{
    _text?: string,
  }>
  compvoie: Readonly<{
    _text?: string,
  }>
  datecrea: Readonly<{
    _text?: string,
  }>
  datefermeture: Readonly<{
    _text?: string,
  }>
  datemaj: Readonly<{
    _text?: string,
  }>
  datemodifsiren: Readonly<{
    _text?: string,
  }>
  departement: Readonly<{
    _text?: string,
  }>
  libcategetab: Readonly<{
    _text?: string,
  }>
  libcommune: Readonly<{
    _text?: string,
  }>
  libcourtcategetab: Readonly<{
    _text?: string,
  }>
  libcourtstatutjuridique: Readonly<{
    _text?: string,
  }>
  libdepartement: Readonly<{
    _text?: string,
  }>
  libellepays: Readonly<{
    _text?: string,
  }>
  libstatutjuridique: Readonly<{
    _text?: string,
  }>
  lieuditbp: Readonly<{
    _text?: string,
  }>
  ligneacheminement: Readonly<{
    _text?: string,
  }>
  nofiness: Readonly<{
    _text?: string,
  }>
  numvoie: Readonly<{
    _text?: string,
  }>
  originemodifsiren: Readonly<{
    _text?: string,
  }>
  qualifcreation: Readonly<{
    _text?: string,
  }>
  rs: Readonly<{
    _text?: string,
  }>
  rslongue: Readonly<{
    _text?: string,
  }>
  siren: Readonly<{
    _text?: string,
  }>
  statutjuridique: Readonly<{
    _text?: string,
  }>
  telecopie: Readonly<{
    _text?: string,
  }>
  telephone: Readonly<{
    _text?: string,
  }>
  typefermeture: Readonly<{
    _text?: string,
  }>
  typvoie: Readonly<{
    _text?: string,
  }>
  voie: Readonly<{
    _text?: string,
  }>
}>

type EntitéJuridiqueFluxFiness = Readonly<{
  fluxfiness: Readonly<{
    structureej: EntitéJuridiqueFiness[]
  }>
}>

export class FinessXmlEntitéJuridiqueLoader implements EntitéJuridiqueLoader {
  private readonly préfixeDuFichierEntitéJuridique = 'finess_cs1400101_stock_'

  constructor(private readonly convertXmlToJs: XmlToJs, private readonly localPath: string) {}

  récupèreLesEntitésJuridiques(): EntitéJuridique[] {
    const cheminDuFichierEntitéJuridique = this.récupèreLeCheminDuFichierEntitéJuridique(this.localPath)

    const dateDeMiseAJourDeLaSource = this.récupèreLaDateDeMiseAJourDeLaSource(cheminDuFichierEntitéJuridique)

    const entitésJuridiquesFluxFiness = this.convertXmlToJs.handle<EntitéJuridiqueFluxFiness>(cheminDuFichierEntitéJuridique)

    return entitésJuridiquesFluxFiness.fluxfiness.structureej.map(
      (entitéJuridique: EntitéJuridiqueFiness) => this.construitLEntitéJuridique(entitéJuridique, dateDeMiseAJourDeLaSource)
    )
  }

  private récupèreLeCheminDuFichierEntitéJuridique(localPath: string): string {
    const fichiersDuRépertoireSimple = readdirSync(`${localPath}/finess/simple`)

    return localPath + '/finess/simple/' + fichiersDuRépertoireSimple.filter((fichier) => fichier.includes(this.préfixeDuFichierEntitéJuridique))
  }

  private récupèreLaDateDeMiseAJourDeLaSource(cheminDuFichierEntitéJuridique: string): string {
    return cheminDuFichierEntitéJuridique.split(this.préfixeDuFichierEntitéJuridique)[1].slice(0, 8)
  }

  private construitLEntitéJuridique(entitésJuridiquesFiness: EntitéJuridiqueFiness, dateMiseAJourSource: string): EntitéJuridique {
    const valueOrEmpty = (value?: string): string => value || ''

    return {
      adresseAcheminement: valueOrEmpty(entitésJuridiquesFiness.ligneacheminement._text),
      adresseNuméroVoie: valueOrEmpty(entitésJuridiquesFiness.numvoie._text),
      adresseTypeVoie: valueOrEmpty(entitésJuridiquesFiness.typvoie._text),
      adresseVoie: valueOrEmpty(entitésJuridiquesFiness.voie._text),
      dateMiseAJourSource,
      libelléStatutJuridique: valueOrEmpty(entitésJuridiquesFiness.libstatutjuridique._text),
      numéroFinessEntitéJuridique: valueOrEmpty(entitésJuridiquesFiness.nofiness._text),
      raisonSociale: valueOrEmpty(entitésJuridiquesFiness.rs._text),
      téléphone: valueOrEmpty(entitésJuridiquesFiness.telephone._text),
    }
  }
}
