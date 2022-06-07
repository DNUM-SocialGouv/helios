import { readdirSync } from 'fs'

import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { XmlToJs } from '../../../métier/gateways/XmlToJs'
import { ÉtablissementTerritorialSourceExterneLoader } from '../../../métier/gateways/ÉtablissementTerritorialSourceExterneLoader'
import {EntitéJuridiqueSourceInterneLoader} from "../../../métier/gateways/EntitéJuridiqueSourceInterneLoader";

type ÉtablissementTerritorialIdentitéFiness = Readonly<{
  nofinesset: Readonly<{
    _text?: string
  }>
  nofinessej: Readonly<{
    _text?: string
  }>
  rs: Readonly<{
    _text?: string
  }>
  rslongue: Readonly<{
    _text?: string
  }>
  complrs: Readonly<{
    _text?: string
  }>
  compldistrib: Readonly<{
    _text?: string
  }>
  numvoie: Readonly<{
    _text?: string
  }>
  typvoie: Readonly<{
    _text?: string
  }>
  voie: Readonly<{
    _text?: string
  }>
  compvoie: Readonly<{
    _text?: string
  }>
  lieuditbp: Readonly<{
    _text?: string
  }>
  commune: Readonly<{
    _text?: string
  }>
  libcommune: Readonly<{
    _text?: string
  }>
  departement: Readonly<{
    _text?: string
  }>
  libdepartement: Readonly<{
    _text?: string
  }>
  codepostal: Readonly<{
    _text?: string
  }>
  ligneacheminement: Readonly<{
    _text?: string
  }>
  codepays: Readonly<{
    _text?: string
  }>
  libellepays: Readonly<{
    _text?: string
  }>
  telephone: Readonly<{
    _text?: string
  }>
  telecopie: Readonly<{
    _text?: string
  }>
  courriel: Readonly<{
    _text?: string
  }>
  categetab: Readonly<{
    _text?: string
  }>
  libcategetab: Readonly<{
    _text?: string
  }>
  libcourtcategetab: Readonly<{
    _text?: string
  }>
  categagretab: Readonly<{
    _text?: string
  }>
  libcategagretab: Readonly<{
    _text?: string
  }>
  libcourtcategagretab: Readonly<{
    _text?: string
  }>
  typeet: Readonly<{
    _text?: string
  }>
  nofinessppal: Readonly<{
    _text?: string
  }>
  natureet: Readonly<{
    _text?: string
  }>
  siret: Readonly<{
    _text?: string
  }>
  datemodifsiret: Readonly<{
    _text?: string
  }>
  originemodifsiret: Readonly<{
    _text?: string
  }>
  codeape: Readonly<{
    _text?: string
  }>
  codemft: Readonly<{
    _text?: string
  }>
  libmft: Readonly<{
    _text?: string
  }>
  libcourtmft: Readonly<{
    _text?: string
  }>
  codesph: Readonly<{
    _text?: string
  }>
  libsph: Readonly<{
    _text?: string
  }>
  libcourtsph: Readonly<{
    _text?: string
  }>
  dateouv: Readonly<{
    _text?: string
  }>
  datelimite: Readonly<{
    _text?: string
  }>
  indcaduc: Readonly<{
    _text?: string
  }>
  typefermeture: Readonly<{
    _text?: string
  }>
  datefermeture: Readonly<{
    _text?: string
  }>
  dateautor: Readonly<{
    _text?: string
  }>
  datemaj: Readonly<{
    _text?: string
  }>
  numuai: Readonly<{
    _text?: string
  }>
}>

type ÉtablissementTerritorialIdentitéFluxFiness = Readonly<{
  fluxfiness: {
    structureet: ÉtablissementTerritorialIdentitéFiness[]
  }
}>

type CatégorieFiness = Readonly<{
  code: Readonly<{
    _text?: string
  }>
  libelle: Readonly<{
    _text?: string
  }>
  libellecourt: Readonly<{
    _text?: string
  }>
  domaine: Readonly<{
    _text?: string
  }>
  datedeb: Readonly<{
    _text?: string
  }>
  datefin: Readonly<{
    _text?: string
  }>
  codeagr3: Readonly<{
    _text?: string
  }>
  libelleagr3: Readonly<{
    _text?: string
  }>
  libellecourtagr3: Readonly<{
    _text?: string
  }>
  codeagr2: Readonly<{
    _text?: string
  }>
  libelleagr2: Readonly<{
    _text?: string
  }>
  libellecourtagr2: Readonly<{
    _text?: string
  }>
  codeagr1: Readonly<{
    _text?: string
  }>
  libelleagr1: Readonly<{
    _text?: string
  }>
  libellecourtagr1: Readonly<{
    _text?: string
  }>
}>

type CatégorieFluxFiness = Readonly<{
  fluxfiness: {
    nomenclcategorieETavecagr: CatégorieFiness[]
  }
}>

export class FinessXmlÉtablissementTerritorialSourceExterneLoader implements ÉtablissementTerritorialSourceExterneLoader {
  private readonly préfixeDuFichierÉtablissementTerritorialIdentité = 'finess_cs1400102_stock_'
  private readonly préfixeDuFichierCatégorie = 'finess_cs1500106_stock_'

  constructor(private readonly convertXmlToJs: XmlToJs, private readonly localPath: string, private readonly entitéJuridiqueSourceInterneLoader: EntitéJuridiqueSourceInterneLoader) {}

  récupèreLesÉtablissementsTerritoriauxOuverts(): ÉtablissementTerritorialIdentité[] {
    const cheminDuFichierÉtablissementTerritorialIdentité = this.récupèreLeCheminDuFichierÉtablissementTerritorialIdentité(this.localPath)

    const cheminDuFichierCatégorie = this.récupèreLeCheminDuFichierCatégorie(this.localPath)

    const dateDeMiseAJourDeLaSource = this.récupèreLaDateDeMiseAJourDeLaSource(cheminDuFichierÉtablissementTerritorialIdentité)

    const catégories = this.convertXmlToJs.handle<CatégorieFluxFiness>(cheminDuFichierCatégorie)

    const établissementTerritorialFluxFinessIdentité = this.convertXmlToJs.handle
      <ÉtablissementTerritorialIdentitéFluxFiness>(cheminDuFichierÉtablissementTerritorialIdentité)

    const établissementsTerritoriauxIdentité = établissementTerritorialFluxFinessIdentité.fluxfiness.structureet
      .filter((établissementTerritorialIdentitéFiness: ÉtablissementTerritorialIdentitéFiness) => {
        const établissementTerritorialCaduque = établissementTerritorialIdentitéFiness.indcaduc._text === 'O'
        const établissementTerritorialFermé = établissementTerritorialIdentitéFiness.datefermeture._text !== undefined

        return établissementTerritorialCaduque || établissementTerritorialFermé ? false : true
      })
      .map((établissementTerritorialIdentitéFiness: ÉtablissementTerritorialIdentitéFiness) =>
        this.construitÉtablissementTerritorialIdentité(établissementTerritorialIdentitéFiness, dateDeMiseAJourDeLaSource, catégories))

    return établissementsTerritoriauxIdentité
  }

  private récupèreLeCheminDuFichierÉtablissementTerritorialIdentité(localPath: string): string {
    const fichiersDuRépertoireSimple = readdirSync(`${localPath}/finess/simple`)

    return localPath + '/finess/simple/' + fichiersDuRépertoireSimple.filter((fichier) => fichier.includes(this.préfixeDuFichierÉtablissementTerritorialIdentité))
  }

  private récupèreLeCheminDuFichierCatégorie(localPath: string): string {
    const fichiersDuRépertoireCatégorie = readdirSync(`${localPath}/finess/nomenclature`)

    return localPath + '/finess/nomenclature/' + fichiersDuRépertoireCatégorie.filter((fichier) => fichier.includes(this.préfixeDuFichierCatégorie))
  }

  private récupèreLaDateDeMiseAJourDeLaSource(cheminDuFichierÉtablissementTerritorial: string): string {
    return cheminDuFichierÉtablissementTerritorial.split(this.préfixeDuFichierÉtablissementTerritorialIdentité)[1].slice(0, 8)
  }

  private construitÉtablissementTerritorialIdentité(
    établissementTerritorialIdentitéFiness: ÉtablissementTerritorialIdentitéFiness,
    dateMiseAJourSource: string,
    catégories: CatégorieFluxFiness
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
      domaine: this.construitLeDomaine(établissementTerritorialIdentitéFiness, catégories),
      libelléCatégorieÉtablissement: valueOrEmpty(établissementTerritorialIdentitéFiness.libcategetab._text),
      numéroFinessEntitéJuridique: valueOrEmpty(établissementTerritorialIdentitéFiness.nofinessej._text),
      numéroFinessÉtablissementPrincipal: valueOrEmpty(établissementTerritorialIdentitéFiness.nofinessppal._text),
      numéroFinessÉtablissementTerritorial: valueOrEmpty(établissementTerritorialIdentitéFiness.nofinesset._text),
      raisonSociale: valueOrEmpty(établissementTerritorialIdentitéFiness.rs._text),
      typeÉtablissement: valueOrEmpty(établissementTerritorialIdentitéFiness.typeet._text),
      téléphone: valueOrEmpty(établissementTerritorialIdentitéFiness.telephone._text),
    }
  }

  private construitLeDomaine(
    établissementTerritorialIdentitéFiness: ÉtablissementTerritorialIdentitéFiness,
    catégories: CatégorieFluxFiness
  ): DomaineÉtablissementTerritorial {
    const catégorie = catégories.fluxfiness.nomenclcategorieETavecagr.filter((catégorie) => {
      return catégorie.code._text === établissementTerritorialIdentitéFiness.categetab._text
    })

    switch (catégorie[0].domaine._text) {
      case 'SAN':
        return DomaineÉtablissementTerritorial.SANITAIRE

      default:
        return DomaineÉtablissementTerritorial.MÉDICO_SOCIAL
    }
  }
}
