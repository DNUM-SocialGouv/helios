import { readdirSync } from 'fs'

import { ConvertXmlToJs } from '../../../shared/entities/ConvertXmlToJs'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorial'
import { RécupérerLesÉtablissementsTerritoriauxLoader } from '../entities/ÉtablissementTerritorialFinessLoader'

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

const préfixeDuFichierÉtablissementTerritorialIdentité = 'finess_cs1400102_stock_'

export const récupérerLesÉtablissementsTerritoriauxLoader: RécupérerLesÉtablissementsTerritoriauxLoader = (
  convertXmlToJs: ConvertXmlToJs,
  localPath: string
): ÉtablissementTerritorialIdentité[] => {
  const cheminDuFichierÉtablissementTerritorialIdentité = _récupérerLeCheminDuFichierÉtablissementTerritorialIdentité(localPath)

  const dateDeMiseAJourDeLaSource = _récupérerLaDateDeMiseAJourDeLaSource(cheminDuFichierÉtablissementTerritorialIdentité)

  const établissementTerritorialFluxFinessIdentité = convertXmlToJs<ÉtablissementTerritorialIdentitéFluxFiness>(cheminDuFichierÉtablissementTerritorialIdentité)

  const établissementsTerritoriauxIdentité = établissementTerritorialFluxFinessIdentité.fluxfiness.structureet.map(
    (établissementTerritorialIdentité: ÉtablissementTerritorialIdentitéFiness) =>
      _mapToÉtablissementTerritorialIdentité(établissementTerritorialIdentité, dateDeMiseAJourDeLaSource)
  )

  return établissementsTerritoriauxIdentité
}

const _récupérerLeCheminDuFichierÉtablissementTerritorialIdentité = (localPath: string): string => {
  const fichiersDuRépertoireSimple = readdirSync(localPath + '/finess/simple')

  return localPath + '/finess/simple/' + fichiersDuRépertoireSimple.filter((fichier) => fichier.includes(préfixeDuFichierÉtablissementTerritorialIdentité))
}

const _récupérerLaDateDeMiseAJourDeLaSource = (cheminDuFichierÉtablissementTerritorial: string): string => {
  return cheminDuFichierÉtablissementTerritorial.split(préfixeDuFichierÉtablissementTerritorialIdentité)[1].slice(0, 8)
}

const _mapToÉtablissementTerritorialIdentité = (
  établissementTerritorialFiness: ÉtablissementTerritorialIdentitéFiness,
  dateMiseAJourSource: string
): ÉtablissementTerritorialIdentité => {
  const valueOrEmpty = (value?: string): string => value || ''

  return {
    catégorieAgrégatÉtablissement: valueOrEmpty(établissementTerritorialFiness.categagretab._text),
    catégorieÉtablissement: valueOrEmpty(établissementTerritorialFiness.categetab._text),
    codeApe: valueOrEmpty(établissementTerritorialFiness.codeape._text),
    codeMft: valueOrEmpty(établissementTerritorialFiness.codemft._text),
    codePays: valueOrEmpty(établissementTerritorialFiness.codepays._text),
    codePostal: valueOrEmpty(établissementTerritorialFiness.codepostal._text),
    codeSph: valueOrEmpty(établissementTerritorialFiness.codesph._text),
    commune: valueOrEmpty(établissementTerritorialFiness.commune._text),
    complémentDistribution: valueOrEmpty(établissementTerritorialFiness.compldistrib._text),
    complémentRaisonSociale: valueOrEmpty(établissementTerritorialFiness.complrs._text),
    complémentVoie: valueOrEmpty(établissementTerritorialFiness.compvoie._text),
    courriel: valueOrEmpty(établissementTerritorialFiness.courriel._text),
    dateAutorisation: valueOrEmpty(établissementTerritorialFiness.dateautor._text),
    dateCaducité: valueOrEmpty(établissementTerritorialFiness.datelimite._text),
    dateFermeture: valueOrEmpty(établissementTerritorialFiness.datefermeture._text),
    dateMaj: valueOrEmpty(établissementTerritorialFiness.datemaj._text),
    dateMiseAJourSource,
    dateModificationSiret: valueOrEmpty(établissementTerritorialFiness.datemodifsiret._text),
    dateOuverture: valueOrEmpty(établissementTerritorialFiness.dateouv._text),
    département: valueOrEmpty(établissementTerritorialFiness.departement._text),
    indicateurCaducité: valueOrEmpty(établissementTerritorialFiness.indcaduc._text),
    libelléCatégorieAgrégatÉtablissement: valueOrEmpty(établissementTerritorialFiness.libcategagretab._text),
    libelléCatégorieÉtablissement: valueOrEmpty(établissementTerritorialFiness.libcategetab._text),
    libelléCommune: valueOrEmpty(établissementTerritorialFiness.libcommune._text),
    libelléCourtCatégorieAgrégatÉtablissement: valueOrEmpty(établissementTerritorialFiness.libcourtcategagretab._text),
    libelléCourtCatégorieÉtablissement: valueOrEmpty(établissementTerritorialFiness.libcourtcategetab._text),
    libelléCourtMft: valueOrEmpty(établissementTerritorialFiness.libcourtmft._text),
    libelléCourtSph: valueOrEmpty(établissementTerritorialFiness.libcourtsph._text),
    libelléDépartement: valueOrEmpty(établissementTerritorialFiness.libdepartement._text),
    libelléMft: valueOrEmpty(établissementTerritorialFiness.libmft._text),
    libelléPays: valueOrEmpty(établissementTerritorialFiness.libellepays._text),
    libelléSph: valueOrEmpty(établissementTerritorialFiness.libsph._text),
    lieuDitBoîtePostale: valueOrEmpty(établissementTerritorialFiness.lieuditbp._text),
    ligneAcheminement: valueOrEmpty(établissementTerritorialFiness.ligneacheminement._text),
    natureÉtablissement: valueOrEmpty(établissementTerritorialFiness.natureet._text),
    numéroFinessEntitéJuridique: valueOrEmpty(établissementTerritorialFiness.nofinessej._text),
    numéroFinessÉtablissementPrincipal: valueOrEmpty(établissementTerritorialFiness.nofinessppal._text),
    numéroFinessÉtablissementTerritorial: valueOrEmpty(établissementTerritorialFiness.nofinesset._text),
    numéroVoie: valueOrEmpty(établissementTerritorialFiness.numvoie._text),
    numéroÉducationNationale: valueOrEmpty(établissementTerritorialFiness.numuai._text),
    origineModificationSiret: valueOrEmpty(établissementTerritorialFiness.originemodifsiret._text),
    raisonSociale: valueOrEmpty(établissementTerritorialFiness.rs._text),
    raisonSocialeLongue: valueOrEmpty(établissementTerritorialFiness.rslongue._text),
    siret: valueOrEmpty(établissementTerritorialFiness.siret._text),
    typeFermeture: valueOrEmpty(établissementTerritorialFiness.typefermeture._text),
    typeVoie: valueOrEmpty(établissementTerritorialFiness.typvoie._text),
    typeÉtablissement: valueOrEmpty(établissementTerritorialFiness.typeet._text),
    télécopie: valueOrEmpty(établissementTerritorialFiness.telecopie._text),
    téléphone: valueOrEmpty(établissementTerritorialFiness.telephone._text),
    voie: valueOrEmpty(établissementTerritorialFiness.voie._text),
  }
}
