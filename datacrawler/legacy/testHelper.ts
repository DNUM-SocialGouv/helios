import { Dependencies } from './infrastructure/dependencies'
import { typeOrmOrm } from './infrastructure/gateways/orm/typeOrmOrm'
import { DomaineÉtablissementTerritorial } from './métier/entities/DomaineÉtablissementTerritorial'
import { EntitéJuridique } from './métier/entities/EntitéJuridique'
import { ÉtablissementTerritorialIdentité } from './métier/entities/ÉtablissementTerritorialIdentité'
import { EnvironmentVariables } from './métier/gateways/EnvironmentVariables'
import { Logger } from './métier/gateways/Logger'

const environmentVariables: EnvironmentVariables = {
  DATABASE_URL: 'postgres://helios:h3li0s@localhost:5433/helios',
  ORM_DEBUG: 'true',
  SENTRY_AUTH_TOKEN: '1234567890',
  SENTRY_DSN: 'https://fake-sentry.io/11',
  SFTP_HOST: 'localhost',
  SFTP_IS_DEBUG: 'false',
  SFTP_KEX_ALGORITHMS: 'algo1,algo2',
  SFTP_LOCAL_PATH: 'data_test',
  SFTP_PORT: '22',
  SFTP_PRIVATE_KEY: 'privateKey',
  SFTP_USERNAME: 'usr_finess_ls',
}

export function getOrm() {
  return typeOrmOrm(environmentVariables)
}

export const getFakeDataCrawlerDependencies = (): Dependencies => {
  return {
    DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS: 1000,
    entitéJuridiqueHeliosLoader: { récupèreLeNuméroFinessDesEntitésJuridiques: jest.fn() },
    entitéJuridiqueHeliosRepository: { sauvegarde: jest.fn(), supprime: jest.fn() },
    entitéJuridiqueSourceExterneLoader: { récupèreLaDateDeMiseÀJourDuFichierSource: jest.fn(), récupèreLesEntitésJuridiquesOuvertes: jest.fn() },
    environmentVariables,
    finessDownloadRawData: { exécute: jest.fn() },
    unzipRawData: { exécute: jest.fn() },
    établissementTerritorialHeliosLoader: { récupèreLeNuméroFinessDesÉtablissementsTerritoriaux: jest.fn() },
    établissementTerritorialHeliosRepository: { sauvegarde: jest.fn(), supprime: jest.fn() },
    établissementTerritorialSourceExterneLoader: {
      récupèreLaDateDeMiseÀJourDuFichierSource: jest.fn(),
      récupèreLesÉtablissementsTerritoriauxOuverts: jest.fn(),
    },
  }
}

export const fakeLogger: Logger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}

export const uneEntitéJuridique: EntitéJuridique = {
  adresseAcheminement: '01117 OYONNAX CEDEX',
  adresseNuméroVoie: '1',
  adresseTypeVoie: 'RTE',
  adresseVoie: 'DE VEYZIAT',
  commune: 'OYONNAX',
  département: 'AIN',
  libelléStatutJuridique: 'Etablissement Public Intercommunal dHospitalisation',
  numéroFinessEntitéJuridique: '010018407',
  raisonSociale: 'CH DU HAUT BUGEY',
  téléphone: '0102030406',
}

export const uneSecondeEntitéJuridique: EntitéJuridique = {
  adresseAcheminement: '59650 VILLENEUVE D ASCQ',
  adresseNuméroVoie: '20',
  adresseTypeVoie: 'AV',
  adresseVoie: 'DE LA RECONNAISSANCE',
  commune: 'VILLENEUVE D ASCQ',
  département: 'NORD',
  libelléStatutJuridique: 'Société Anonyme (S.A.)',
  numéroFinessEntitéJuridique: '590001741',
  raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
  téléphone: '0102030405',
}

export const unÉtablissementMédicoSocial: ÉtablissementTerritorialIdentité = {
  adresseAcheminement: '01130 NANTUA',
  adresseNuméroVoie: '50',
  adresseTypeVoie: 'R',
  adresseVoie: 'PAUL PAINLEVE',
  catégorieÉtablissement: '355',
  commune: 'NANTUA',
  courriel: 'a@example.com',
  domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
  département: 'AIN',
  libelléCatégorieÉtablissement: 'Centre Hospitalier (C.H.)',
  numéroFinessEntitéJuridique: '010018407',
  numéroFinessÉtablissementPrincipal: '010000057',
  numéroFinessÉtablissementTerritorial: '010000040',
  raisonSociale: 'CH NANTUA',
  typeÉtablissement: 'S',
  téléphone: '0102030405',
}

export const unÉtablissementSanitaire: ÉtablissementTerritorialIdentité = {
  adresseAcheminement: '59650 VILLENEUVE D ASCQ',
  adresseNuméroVoie: '20',
  adresseTypeVoie: 'AV',
  adresseVoie: 'DE LA RECONNAISSANCE',
  catégorieÉtablissement: '365',
  commune: 'VILLENEUVE D ASCQ',
  courriel: 'b@example.com',
  domaine: DomaineÉtablissementTerritorial.SANITAIRE,
  département: 'NORD',
  libelléCatégorieÉtablissement: 'Centre Hospitalier (C.H.)',
  numéroFinessEntitéJuridique: '590000741',
  numéroFinessÉtablissementPrincipal: '',
  numéroFinessÉtablissementTerritorial: '590782553',
  raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
  typeÉtablissement: 'P',
  téléphone: '0102030406',
}
