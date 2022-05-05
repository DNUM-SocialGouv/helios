import { readdirSync } from 'fs'

import { ConvertXmlToJs } from '../../../shared/entities/ConvertXmlToJs'
import { EntitéJuridique } from '../entities/EntitéJuridique'
import { RécupérerLesEntitésJuridiquesLoader } from '../entities/EntitéJuridiqueFinessLoader'

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

const préfixeDuFichierEntitéJuridique = 'finess_cs1400101_stock_'

export const récupérerLesEntitésJuridiquesLoader: RécupérerLesEntitésJuridiquesLoader = (
  convertXmlToJs: ConvertXmlToJs,
  localPath: string
): EntitéJuridique[] => {
  const cheminDuFichierEntitéJuridique = _récupérerLeCheminDuFichierEntitéJuridique(localPath)

  const dateDeMiseAJourDeLaSource = _récupérerLaDateDeMiseAJourDeLaSource(cheminDuFichierEntitéJuridique)

  const entitésJuridiquesFluxFiness = convertXmlToJs<EntitéJuridiqueFluxFiness>(cheminDuFichierEntitéJuridique)

  return entitésJuridiquesFluxFiness.fluxfiness.structureej.map(
    (entitéJuridique: EntitéJuridiqueFiness) => _mapToEntitésJuridiques(entitéJuridique, dateDeMiseAJourDeLaSource)
  )
}

const _récupérerLeCheminDuFichierEntitéJuridique = (localPath: string): string => {
  const fichiersDuRépertoireSimple = readdirSync(localPath + '/finess/simple')

  return localPath + '/finess/simple/' + fichiersDuRépertoireSimple.filter((fichier) => fichier.includes(préfixeDuFichierEntitéJuridique))
}

const _récupérerLaDateDeMiseAJourDeLaSource = (cheminDuFichierEntitéJuridique: string): string => {
  return cheminDuFichierEntitéJuridique.split(préfixeDuFichierEntitéJuridique)[1].slice(0, 8)
}

const _mapToEntitésJuridiques = (entitésJuridiquesFiness: EntitéJuridiqueFiness, dateMiseAJourSource: string): EntitéJuridique => {
  const valueOrEmpty = (value?: string): string => value || ''

  return {
    catégorieÉtablissement: valueOrEmpty(entitésJuridiquesFiness.categetab._text),
    codeApe: valueOrEmpty(entitésJuridiquesFiness.codeape._text),
    codePays: valueOrEmpty(entitésJuridiquesFiness.codepays._text),
    codePostal: valueOrEmpty(entitésJuridiquesFiness.codepostal._text),
    commune: valueOrEmpty(entitésJuridiquesFiness.commune._text),
    complémentDistribution: valueOrEmpty(entitésJuridiquesFiness.compldistrib._text),
    complémentRaisonSociale: valueOrEmpty(entitésJuridiquesFiness.complrs._text),
    complémentVoie: valueOrEmpty(entitésJuridiquesFiness.compvoie._text),
    dateCréation: valueOrEmpty(entitésJuridiquesFiness.datecrea._text),
    dateFermeture: valueOrEmpty(entitésJuridiquesFiness.datefermeture._text),
    dateMiseAJour: valueOrEmpty(entitésJuridiquesFiness.datemaj._text),
    dateMiseAJourSource,
    dateModificationSiren: valueOrEmpty(entitésJuridiquesFiness.datemodifsiren._text),
    département: valueOrEmpty(entitésJuridiquesFiness.departement._text),
    libelléCatégoriÉtablissement: valueOrEmpty(entitésJuridiquesFiness.libcategetab._text),
    libelléCommune: valueOrEmpty(entitésJuridiquesFiness.libcommune._text),
    libelléCourtCatégoriÉtablissement: valueOrEmpty(entitésJuridiquesFiness.libcourtcategetab._text),
    libelléCourtStatutJuridique: valueOrEmpty(entitésJuridiquesFiness.libcourtstatutjuridique._text),
    libelléDépartement: valueOrEmpty(entitésJuridiquesFiness.libdepartement._text),
    libelléPays: valueOrEmpty(entitésJuridiquesFiness.libellepays._text),
    libelléStatutJuridique: valueOrEmpty(entitésJuridiquesFiness.libstatutjuridique._text),
    lieuDitBoîtePostale: valueOrEmpty(entitésJuridiquesFiness.lieuditbp._text),
    ligneAcheminement: valueOrEmpty(entitésJuridiquesFiness.ligneacheminement._text),
    numéroFiness: valueOrEmpty(entitésJuridiquesFiness.nofiness._text),
    numéroVoie: valueOrEmpty(entitésJuridiquesFiness.numvoie._text),
    origineModificationSiren: valueOrEmpty(entitésJuridiquesFiness.originemodifsiren._text),
    qualificationCréation: valueOrEmpty(entitésJuridiquesFiness.qualifcreation._text),
    raisonSociale: valueOrEmpty(entitésJuridiquesFiness.rs._text),
    raisonSocialeLongue: valueOrEmpty(entitésJuridiquesFiness.rslongue._text),
    siren: valueOrEmpty(entitésJuridiquesFiness.siren._text),
    statutJuridique: valueOrEmpty(entitésJuridiquesFiness.statutjuridique._text),
    typeFermeture: valueOrEmpty(entitésJuridiquesFiness.typefermeture._text),
    typeVoie: valueOrEmpty(entitésJuridiquesFiness.typvoie._text),
    télécopie: valueOrEmpty(entitésJuridiquesFiness.telecopie._text),
    téléphone: valueOrEmpty(entitésJuridiquesFiness.telephone._text),
    voie: valueOrEmpty(entitésJuridiquesFiness.voie._text),
  }
}
