import { DomaineÉtablissementTerritorial } from './DomaineÉtablissementTerritorial'

export type ÉtablissementTerritorialIdentité = Readonly<{
  adresseAcheminement: string
  adresseNuméroVoie: string
  adresseTypeVoie: string
  adresseVoie: string
  catégorieÉtablissement: string
  courriel: string
  dateMiseAJourSource: string
  domaine: DomaineÉtablissementTerritorial
  libelléCatégorieÉtablissement: string
  numéroFinessEntitéJuridique: string
  numéroFinessÉtablissementPrincipal: string
  numéroFinessÉtablissementTerritorial: string
  raisonSociale: string
  téléphone: string
  typeÉtablissement: string
}>
