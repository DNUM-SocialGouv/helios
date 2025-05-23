import { mkdirSync, rmSync, writeFileSync } from "fs";

import { Dependencies } from "./infrastructure/dependencies";
import { typeOrmOrm } from "./infrastructure/gateways/orm/typeOrmOrm";
import { DomaineÉtablissementTerritorial } from "./métier/entities/DomaineÉtablissementTerritorial";
import { Catégorisation, EntitéJuridique } from "./métier/entities/EntitéJuridique";
import { Classification, ÉtablissementTerritorialIdentité } from "./métier/entities/ÉtablissementTerritorialIdentité";
import { EnvironmentVariables } from "./métier/gateways/EnvironmentVariables";
import { Logger } from "./métier/gateways/Logger";

const environmentVariables: EnvironmentVariables = {
  DATABASE_URL: "postgres://helios:h3li0s@localhost:5433/helios",
  DIAMANT_ENCRYPTED_DATA_PATH: "data_test/diamant",
  DNUM_SFTP_HOST: "localhost",
  DNUM_SFTP_PORT: "23",
  DNUM_SFTP_PRIVATE_KEY: "privateDnumKey",
  DNUM_SFTP_USERNAME: "HELIOS",
  ORM_DEBUG: "true",
  SENTRY_AUTH_TOKEN: "1234567890",
  SENTRY_DSN: "https://fake-sentry.io/11",
  SENTRY_ENVIRONMENT: "test",
  SFTP_HOST: "localhost",
  SFTP_IS_DEBUG: "false",
  SFTP_KEX_ALGORITHMS: "algo1,algo2",
  SFTP_LOCAL_PATH: "data_test/sortie",
  SFTP_PORT: "22",
  SFTP_PRIVATE_KEY: "privateKey",
  SFTP_USERNAME: "usr_finess_ls",
  HAPI_DATA_PATH: "",
  HAPI_SFTP_HOST: "",
  HAPI_SFTP_PORT: "",
  HAPI_SFTP_PASSWORD: "",
  HAPI_SFTP_USERNAME: ""
};

export function getOrm() {
  return typeOrmOrm(environmentVariables);
}
export const getFakeDataCrawlerDependencies = (): Dependencies => {
  return {
    DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS: 1000,
    catégorisationSourceExterneLoader: { récupèreLesNiveauxDesStatutsJuridiques: jest.fn().mockReturnValue([]) },
    dnumDownloadRawData: { exécute: jest.fn() },
    entitéJuridiqueHeliosLoader: { récupèreLeNuméroFinessDesEntitésJuridiques: jest.fn().mockResolvedValue([]) },
    entitéJuridiqueHeliosRepository: { sauvegarde: jest.fn(), supprime: jest.fn() },
    entitéJuridiqueSourceExterneLoader: {
      récupèreLaDateDeMiseÀJourDuFichierSource: jest.fn().mockReturnValue(""),
      récupèreLesEntitésJuridiquesOuvertes: jest.fn(),
    },
    environmentVariables,
    finessDownloadRawData: { exécute: jest.fn() },
    sirecDownloadRawData: { exécute: jest.fn() },
    siiceaDownloadRawData: { exécute: jest.fn() },
    sivssDownloadRawData: { exécute: jest.fn() },
    hapiDownloadRawData: { exécute: jest.fn() },
    logger: fakeLogger,
    unzipRawData: { exécute: jest.fn() },
    établissementTerritorialHeliosLoader: { récupèreLeNuméroFinessDesÉtablissementsTerritoriaux: jest.fn() },
    établissementTerritorialHeliosRepository: { sauvegarde: jest.fn(), supprime: jest.fn() },
    établissementTerritorialSourceExterneLoader: {
      récupèreLaDateDeMiseÀJourDuFichierSource: jest.fn(),
      récupèreLesÉtablissementsTerritoriauxOuverts: jest.fn(),
    },
    controleDonneesSirecLoader: {
      checkDowloadedSirecFile: jest.fn(),
    }
  };
};

export const fakeLogger: Logger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

export const uneEntitéJuridique: EntitéJuridique = {
  adresseAcheminement: "01117 OYONNAX CEDEX",
  adresseNuméroVoie: "1",
  adresseTypeVoie: "RTE",
  adresseVoie: "DE VEYZIAT",
  commune: "OYONNAX",
  département: "AIN",
  libelléStatutJuridique: "Etablissement Public Intercommunal dHospitalisation",
  numéroFinessEntitéJuridique: "010018407",
  raisonSociale: "CENTRE HOSPITALIER DU HAUT BUGEY",
  raisonSocialeCourte: "CH DU HAUT BUGEY",
  siren: "260104631",
  statutJuridique: "1",
  téléphone: "0102030406",
  codeRégion: "84",
  dateOuverture: "1901-02-02"
};

export const uneSecondeEntitéJuridique: EntitéJuridique = {
  adresseAcheminement: "59650 VILLENEUVE D ASCQ",
  adresseNuméroVoie: "20",
  adresseTypeVoie: "AV",
  adresseVoie: "DE LA RECONNAISSANCE",
  catégorisation: Catégorisation.PRIVE_NON_LUCRATIF,
  commune: "VILLENEUVE D ASCQ",
  département: "NORD",
  libelléStatutJuridique: "Société Anonyme (S.A.)",
  numéroFinessEntitéJuridique: "590001741",
  raisonSociale: "HOPITAL PRIVE DE VILLENEUVE DASCQ",
  raisonSocialeCourte: "HOPITAL PRIVE DE VILLENEUVE DASCQ",
  siren: "260104632",
  statutJuridique: "1",
  téléphone: "0102030405",
  codeRégion: "84",
  dateOuverture: "1901-02-02"
};

export const unÉtablissementMédicoSocial: ÉtablissementTerritorialIdentité = {
  adresseAcheminement: "01130 NANTUA",
  adresseNuméroVoie: "50",
  adresseTypeVoie: "R",
  adresseVoie: "PAUL PAINLEVE",
  catégorieÉtablissement: "355",
  codeModeTarification: "99",
  commune: "NANTUA",
  courriel: "a@example.com",
  domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
  département: "AIN",
  libelléCatégorieÉtablissement: "Centre Hospitalier (C.H.)",
  classificationEtablissement: Classification.NON_CALSSIFIE,
  libelléCourtCatégorieÉtablissement: "C.H.",
  libelléModeTarification: "Indéterminé",
  numéroFinessEntitéJuridique: "010018407",
  numéroFinessÉtablissementPrincipal: "010000057",
  numéroFinessÉtablissementTerritorial: "010000040",
  raisonSociale: "CENTRE HOSPITALIER NANTUA",
  raisonSocialeCourte: "CH NANTUA",
  siret: "20003004700017",
  typeÉtablissement: "S",
  téléphone: "0102030405",
  codeRégion: "84",
  dateOuverture: "1901-02-02"
};

export const unÉtablissementSanitaire: ÉtablissementTerritorialIdentité = {
  adresseAcheminement: "59650 VILLENEUVE D ASCQ",
  adresseNuméroVoie: "20",
  adresseTypeVoie: "AV",
  adresseVoie: "DE LA RECONNAISSANCE",
  catégorieÉtablissement: "365",
  codeModeTarification: "54",
  commune: "VILLENEUVE D ASCQ",
  courriel: "b@example.com",
  domaine: DomaineÉtablissementTerritorial.SANITAIRE,
  département: "NORD",
  libelléCatégorieÉtablissement: "Centre Hospitalier (C.H.)",
  classificationEtablissement: Classification.NON_CALSSIFIE,
  libelléCourtCatégorieÉtablissement: "C.H.",
  libelléModeTarification: "Tarif AM - Services de Soins Infirmiers A Domicile",
  numéroFinessEntitéJuridique: "590000741",
  numéroFinessÉtablissementPrincipal: "010000057",
  numéroFinessÉtablissementTerritorial: "590782553",
  raisonSociale: "HOPITAL PRIVE DE VILLENEUVE DASCQ",
  raisonSocialeCourte: "HOPITAL PRIVE DE VILLENEUVE DASCQ",
  siret: "20003004700018",
  typeÉtablissement: "P",
  téléphone: "0102030406",
  codeRégion: "84",
  dateOuverture: "1901-02-02"
};

export function créerFichierXMLTest(contenu: string, localPath: string, filename: string) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      ${contenu}
    </fluxfiness>`;
  mkdirSync(localPath, { recursive: true });
  writeFileSync(`${localPath}/${filename}.xml`, xml);
}

export function supprimerDossier(localPath: string) {
  rmSync(localPath, { recursive: true });
}
