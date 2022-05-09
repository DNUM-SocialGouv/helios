import { readdirSync } from 'fs'

import { XmlToJs } from '../../../shared/entities/XmlToJs'
import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitésJuridiquesLoader } from '../entities/EntitésJuridiquesLoader'

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

export type EntitéJuridiqueFluxFiness = Readonly<{
  fluxfiness: Readonly<{
    structureej: EntitéJuridiqueFiness[]
  }>
}>

export class EntitésJuridiquesFinessLoader implements EntitésJuridiquesLoader {
  private readonly préfixeDuFichierEntitéJuridique = 'finess_cs1400101_stock_'

  constructor(private readonly convertXmlToJs: XmlToJs, private readonly localPath: string) {}

  récupérerLesEntitésJuridiques(): EntitéJuridique[] {
    const cheminDuFichierEntitéJuridique = this.récupérerLeCheminDuFichierEntitéJuridique(this.localPath)

    const dateDeMiseAJourDeLaSource = this.récupérerLaDateDeMiseAJourDeLaSource(cheminDuFichierEntitéJuridique)

    const entitésJuridiquesFluxFiness = this.convertXmlToJs.handle<EntitéJuridiqueFluxFiness>(cheminDuFichierEntitéJuridique)

    return entitésJuridiquesFluxFiness.fluxfiness.structureej.map(
      (entitéJuridique: EntitéJuridiqueFiness) => this.mapToEntitésJuridiques(entitéJuridique, dateDeMiseAJourDeLaSource)
    )
  }

  private récupérerLeCheminDuFichierEntitéJuridique(localPath: string): string {
    const fichiersDuRépertoireSimple = readdirSync(`${localPath}/finess/simple`)

    return localPath + '/finess/simple/' + fichiersDuRépertoireSimple.filter((fichier) => fichier.includes(this.préfixeDuFichierEntitéJuridique))
  }

  private récupérerLaDateDeMiseAJourDeLaSource(cheminDuFichierEntitéJuridique: string): string {
    return cheminDuFichierEntitéJuridique.split(this.préfixeDuFichierEntitéJuridique)[1].slice(0, 8)
  }

  private mapToEntitésJuridiques(entitésJuridiquesFiness: EntitéJuridiqueFiness, dateMiseAJourSource: string): EntitéJuridique {
    const valueOrEmpty = (value?: string): string => value || ''

    return {
      dateMiseAJourSource,
      ligneAcheminement: valueOrEmpty(entitésJuridiquesFiness.ligneacheminement._text),
      numéroFiness: valueOrEmpty(entitésJuridiquesFiness.nofiness._text),
      numéroVoie: valueOrEmpty(entitésJuridiquesFiness.numvoie._text),
      raisonSociale: valueOrEmpty(entitésJuridiquesFiness.rs._text),
      statutJuridique: valueOrEmpty(entitésJuridiquesFiness.statutjuridique._text),
      typeVoie: valueOrEmpty(entitésJuridiquesFiness.typvoie._text),
      téléphone: valueOrEmpty(entitésJuridiquesFiness.telephone._text),
      voie: valueOrEmpty(entitésJuridiquesFiness.voie._text),
    }
  }
}
