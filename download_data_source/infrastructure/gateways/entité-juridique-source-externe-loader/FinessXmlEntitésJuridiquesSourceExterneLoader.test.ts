import { EntitéJuridique } from "../../../métier/entities/EntitéJuridique";
import { créerFichierXMLTest, fakeLogger, getFakeDataCrawlerDependencies, getOrm, supprimerDossier } from "../../../testHelper";
import { NodeXmlToJs } from "../xml-to-js/NodeXmlToJs";
import { FinessXmlEntitésJuridiquesSourceExterneLoader } from "./FinessXmlEntitésJuridiquesSourceExterneLoader";

describe("Récupération des entités juridiques de la source de données FINESS", () => {
  const orm = getOrm();

  afterAll(async () => {
    await (await orm).destroy();
  });

  it("récupère uniquement les entités juridiques ouvertes de la source de données FINESS", async () => {
    const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies();
    const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_ej`;
    const finessLocalPath = `${localPath}/finess/simple`;
    // GIVEN
    const ejOuverte1 = `<structureej>
        <nofiness>010008407</nofiness>
        <rs>CH DU HAUT BUGEY</rs>
        <rslongue>CENTRE HOSPITALIER DU HAUT BUGEY</rslongue>
        <numvoie>1</numvoie>
        <typvoie>RTE</typvoie>
        <voie>DE VEYZIAT</voie>
        <ligneacheminement>01117 OYONNAX CEDEX</ligneacheminement>
        <libcommune>OYONNAX</libcommune>
        <libdepartement>AIN</libdepartement>
        <departement>01</departement>
        <telephone>0474731001</telephone>
        <libstatutjuridique>Etablissement Public Intercommunal d'Hospitalisation</libstatutjuridique>
        <statutjuridique>14</statutjuridique>
        <categetab>355</categetab>
        <datecrea>2001-01-01</datecrea>
        <siren>260104631</siren>
        <datefermeture xsi:nil="true"/>
      </structureej>`;
    const ejOuverte2 = `<structureej>
        <nofiness>590000741</nofiness>
        <rs>HOPITAL PRIVE DE VILLENEUVE D'ASCQ</rs>
        <rslongue>HOPITAL PRIVE DE VILLENEUVE D'ASCQ</rslongue>
        <numvoie>20</numvoie>
        <typvoie>AV</typvoie>
        <voie>DE LA RECONNAISSANCE</voie>
        <ligneacheminement>59650 VILLENEUVE D ASCQ</ligneacheminement>
        <libcommune>VILLENEUVE D ASCQ</libcommune>
        <libdepartement>NORD</libdepartement>
        <departement>59</departement>
        <telephone>0826666900</telephone>
        <libstatutjuridique>Société Anonyme (S.A.)</libstatutjuridique>
        <statutjuridique>73</statutjuridique>
        <datecrea>2001-01-01</datecrea>
        <categetab xsi:nil="true"/>
        <siren>260104632</siren>
        <datefermeture xsi:nil="true"/>
      </structureej>`;
    const ejFermée = `<structureej>
        <nofiness>010000164</nofiness>
        <rs>[Fermé] POLYCLINIQUE D'AMBERIEU</rs>
        <rslongue>[Fermé] POLYCLINIQUE D'AMBERIEU EN BUGEY</rslongue>
        <numvoie>17</numvoie>
        <typvoie>R</typvoie>
        <voie>AIME VINGTRINIER</voie>
        <ligneacheminement>01500 AMBERIEU EN BUGEY</ligneacheminement>
        <libcommune>AMBERIEU EN BUGEY</libcommune>
        <libdepartement>AIN</libdepartement>
        <telephone>0474383000</telephone>
        <libstatutjuridique>Société A Responsabilité Limitée (S.A.R.L.)</libstatutjuridique>
        <statutjuridique>72</statutjuridique>
        <categetab xsi:nil="true"/>
        <siren>260104630</siren>
        <datecrea>2001-01-01</datecrea>
        <datefermeture>2002-07-10</datefermeture>
      </structureej>`;
    const toutesLesEJ = [ejOuverte1, ejOuverte2, ejFermée];

    créerFichierXMLTest(toutesLesEJ.join(), finessLocalPath, "finess_cs1400101_stock_20211214-0333");
    // WHEN
    const entitéJuridiqueFinessLoader = new FinessXmlEntitésJuridiquesSourceExterneLoader(new NodeXmlToJs(), localPath, fakeLogger, orm);
    const entitésJuridiques = await entitéJuridiqueFinessLoader.récupèreLesEntitésJuridiquesOuvertes();

    // THEN
    expect(entitésJuridiques).toStrictEqual<EntitéJuridique[]>([
      {
        adresseAcheminement: "01117 OYONNAX CEDEX",
        adresseNuméroVoie: "1",
        adresseTypeVoie: "RTE",
        adresseVoie: "DE VEYZIAT",
        commune: "OYONNAX",
        département: "AIN",
        libelléStatutJuridique: "Etablissement Public Intercommunal d'Hospitalisation",
        numéroFinessEntitéJuridique: "010008407",
        raisonSociale: "CENTRE HOSPITALIER DU HAUT BUGEY",
        raisonSocialeCourte: "CH DU HAUT BUGEY",
        siren: "260104631",
        statutJuridique: "14",
        téléphone: "0474731001",
        codeRégion: "84",
        dateOuverture: "2001-01-01"
      },
      {
        adresseAcheminement: "59650 VILLENEUVE D ASCQ",
        adresseNuméroVoie: "20",
        adresseTypeVoie: "AV",
        adresseVoie: "DE LA RECONNAISSANCE",
        commune: "VILLENEUVE D ASCQ",
        département: "NORD",
        libelléStatutJuridique: "Société Anonyme (S.A.)",
        numéroFinessEntitéJuridique: "590000741",
        raisonSociale: "HOPITAL PRIVE DE VILLENEUVE D'ASCQ",
        raisonSocialeCourte: "HOPITAL PRIVE DE VILLENEUVE D'ASCQ",
        siren: "260104632",
        statutJuridique: "73",
        téléphone: "0826666900",
        codeRégion: "32",
        dateOuverture: "2001-01-01"
      },
    ]);
    supprimerDossier(localPath);
  });

  it("ne renvoie pas de valeur lorsque la valeur d’un champ n’est pas renseignée", async () => {
    const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies();
    const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_ej`;
    const finessLocalPath = `${localPath}/finess/simple`;
    // GIVEN
    const structureEJXml = ` <structureej>
        <nofiness>010008407</nofiness>
        <rs>CH DU HAUT BUGEY</rs>
        <rslongue>CENTRE HOSPITALIER DU HAUT BUGEY</rslongue>
        <complrs xsi:nil="true"/>
        <numvoie xsi:nil="true"/>
        <typvoie>RTE</typvoie>
        <voie>DE VEYZIAT</voie>
        <compvoie xsi:nil="true"/>
        <compldistrib xsi:nil="true"/>
        <lieuditbp>CS 20100</lieuditbp>
        <libellepays xsi:nil="true"/>
        <commune>283</commune>
        <ligneacheminement>01117 OYONNAX CEDEX</ligneacheminement>
        <libcommune>OYONNAX</libcommune>
        <departement>01</departement>
        <libdepartement>AIN</libdepartement>
        <codepostal>01117</codepostal>
        <codepays xsi:nil="true"/>
        <telephone></telephone>
        <telecopie>0474731002</telecopie>
        <statutjuridique>14</statutjuridique>
        <libstatutjuridique>Etablissement Public Intercommunal d'Hospitalisation</libstatutjuridique>
        <libcourtstatutjuridique>Etb.Pub.Intcom.Hosp.</libcourtstatutjuridique>
        <categetab>355</categetab>
        <libcategetab>Centre Hospitalier (C.H.)</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <siren>260110218</siren>
        <datemodifsiren>2011-02-07</datemodifsiren>
        <originemodifsiren>RMESSMAIA_AUTO</originemodifsiren>
        <codeape>8730A</codeape>
        <datecrea>2001-01-01</datecrea>
        <datemaj>2020-02-04</datemaj>
        <datefermeture xsi:nil="true"/>
        <typefermeture xsi:nil="true"/>
        <qualifcreation>GEN</qualifcreation>
      </structureej>
      <structureej>
        <nofiness>590000741</nofiness>
        <rs>HOPITAL PRIVE DE VILLENEUVE D'ASCQ</rs>
        <rslongue>HOPITAL PRIVE DE VILLENEUVE D'ASCQ</rslongue>
        <complrs xsi:nil="true"/>
        <numvoie>20</numvoie>
        <typvoie>AV</typvoie>
        <voie>DE LA RECONNAISSANCE</voie>
        <compvoie xsi:nil="true"/>
        <compldistrib xsi:nil="true"/>
        <lieuditbp>QUARTIER DU RECUEIL</lieuditbp>
        <libellepays xsi:nil="true"/>
        <commune>009</commune>
        <ligneacheminement>59650 VILLENEUVE D ASCQ</ligneacheminement>
        <libcommune>VILLENEUVE D ASCQ</libcommune>
        <departement>59</departement>
        <libdepartement>NORD</libdepartement>
        <codepostal>59650</codepostal>
        <codepays xsi:nil="true"/>
        <telephone>0826666900</telephone>
        <telecopie>0320995678</telecopie>
        <statutjuridique>73</statutjuridique>
        <libstatutjuridique>Société Anonyme (S.A.)</libstatutjuridique>
        <libcourtstatutjuridique>Société Anonyme</libcourtstatutjuridique>
        <categetab xsi:nil="true"/>
        <libcategetab xsi:nil="true"/>
        <libcourtcategetab xsi:nil="true"/>
        <siren>476780333</siren>
        <datemodifsiren>2012-09-26</datemodifsiren>
        <originemodifsiren>SIRETISATION</originemodifsiren>
        <codeape>8610Z</codeape>
        <datecrea>2001-01-01</datecrea>
        <datemaj>2012-09-14</datemaj>
        <datefermeture xsi:nil="true"/>
        <typefermeture xsi:nil="true"/>
        <qualifcreation>GEN</qualifcreation>
      </structureej>`;
    créerFichierXMLTest(structureEJXml, finessLocalPath, "finess_cs1400101_stock_20211214-0333");
    // WHEN
    const entitéJuridiqueFinessLoader = new FinessXmlEntitésJuridiquesSourceExterneLoader(new NodeXmlToJs(), localPath, fakeLogger, orm);
    const entitésJuridiques = await entitéJuridiqueFinessLoader.récupèreLesEntitésJuridiquesOuvertes();

    // THEN
    expect(entitésJuridiques).toStrictEqual<EntitéJuridique[]>([
      {
        adresseAcheminement: "01117 OYONNAX CEDEX",
        adresseNuméroVoie: "",
        adresseTypeVoie: "RTE",
        adresseVoie: "DE VEYZIAT",
        commune: "OYONNAX",
        département: "AIN",
        libelléStatutJuridique: "Etablissement Public Intercommunal d'Hospitalisation",
        numéroFinessEntitéJuridique: "010008407",
        raisonSociale: "CENTRE HOSPITALIER DU HAUT BUGEY",
        raisonSocialeCourte: "CH DU HAUT BUGEY",
        siren: "260110218",
        statutJuridique: "14",
        téléphone: "",
        codeRégion: "84",
        dateOuverture: "2001-01-01"
      },
      {
        adresseAcheminement: "59650 VILLENEUVE D ASCQ",
        adresseNuméroVoie: "20",
        adresseTypeVoie: "AV",
        adresseVoie: "DE LA RECONNAISSANCE",
        commune: "VILLENEUVE D ASCQ",
        département: "NORD",
        libelléStatutJuridique: "Société Anonyme (S.A.)",
        numéroFinessEntitéJuridique: "590000741",
        raisonSociale: "HOPITAL PRIVE DE VILLENEUVE D'ASCQ",
        raisonSocialeCourte: "HOPITAL PRIVE DE VILLENEUVE D'ASCQ",
        siren: "476780333",
        statutJuridique: "73",
        téléphone: "0826666900",
        codeRégion: "32",
        dateOuverture: "2001-01-01"
      },
    ]);
    supprimerDossier(localPath);
  });

  it("récupère la raison sociale écourtée si la raison sociale longue n’est pas renseignée", async () => {
    const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies();
    const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_ej`;
    const finessLocalPath = `${localPath}/finess/simple`;
    // GIVEN
    const entitéSansRaisonSocialeLongue1 = `<structureej>
        <nofiness>010008407</nofiness>
        <rs>CH DU HAUT BUGEY</rs>
        <rslongue xsi:nil="true"/>
        <numvoie>1</numvoie>
        <typvoie>RTE</typvoie>
        <voie>DE VEYZIAT</voie>
        <ligneacheminement>01117 OYONNAX CEDEX</ligneacheminement>
        <libcommune>OYONNAX</libcommune>
        <libdepartement>AIN</libdepartement>
        <departement>01</departement>
        <telephone>0474731001</telephone>
        <libstatutjuridique>Etablissement Public Intercommunal d'Hospitalisation</libstatutjuridique>
        <statutjuridique>14</statutjuridique>
        <categetab>355</categetab>
        <datecrea>2001-01-01</datecrea>
        <siren>260104631</siren>
        <datefermeture xsi:nil="true"/>
      </structureej>`;
    const entitéSansRaisonSocialeLongue2 = `<structureej>
        <nofiness>590000741</nofiness>
        <rs>HOPITAL PRIVE DE VILLENEUVE D'ASCQ</rs>
        <rslongue xsi:nil="true"/>
        <numvoie>20</numvoie>
        <typvoie>AV</typvoie>
        <voie>DE LA RECONNAISSANCE</voie>
        <ligneacheminement>59650 VILLENEUVE D ASCQ</ligneacheminement>
        <libcommune>VILLENEUVE D ASCQ</libcommune>
        <libdepartement>NORD</libdepartement>
        <departement>59</departement>
        <telephone>0826666900</telephone>
        <libstatutjuridique>Société Anonyme (S.A.)</libstatutjuridique>
        <statutjuridique>73</statutjuridique>
        <categetab xsi:nil="true"/>
        <datecrea>2001-01-01</datecrea>
        <siren>260104632</siren>
        <datefermeture xsi:nil="true"/>
      </structureej>`;

    const entitésSansRaisonsSociale = [entitéSansRaisonSocialeLongue1, entitéSansRaisonSocialeLongue2];
    créerFichierXMLTest(entitésSansRaisonsSociale.join(), finessLocalPath, "finess_cs1400101_stock_20211214-0333");
    // WHEN
    const entitéJuridiqueFinessLoader = new FinessXmlEntitésJuridiquesSourceExterneLoader(new NodeXmlToJs(), localPath, fakeLogger, orm);
    const entitésJuridiques = await entitéJuridiqueFinessLoader.récupèreLesEntitésJuridiquesOuvertes();

    // THEN
    expect(entitésJuridiques).toStrictEqual<EntitéJuridique[]>([
      {
        adresseAcheminement: "01117 OYONNAX CEDEX",
        adresseNuméroVoie: "1",
        adresseTypeVoie: "RTE",
        adresseVoie: "DE VEYZIAT",
        commune: "OYONNAX",
        département: "AIN",
        libelléStatutJuridique: "Etablissement Public Intercommunal d'Hospitalisation",
        numéroFinessEntitéJuridique: "010008407",
        raisonSociale: "CH DU HAUT BUGEY",
        raisonSocialeCourte: "CH DU HAUT BUGEY",
        siren: "260104631",
        statutJuridique: "14",
        téléphone: "0474731001",
        codeRégion: "84",
        dateOuverture: "2001-01-01"
      },
      {
        adresseAcheminement: "59650 VILLENEUVE D ASCQ",
        adresseNuméroVoie: "20",
        adresseTypeVoie: "AV",
        adresseVoie: "DE LA RECONNAISSANCE",
        commune: "VILLENEUVE D ASCQ",
        département: "NORD",
        libelléStatutJuridique: "Société Anonyme (S.A.)",
        numéroFinessEntitéJuridique: "590000741",
        raisonSociale: "HOPITAL PRIVE DE VILLENEUVE D'ASCQ",
        raisonSocialeCourte: "HOPITAL PRIVE DE VILLENEUVE D'ASCQ",
        siren: "260104632",
        statutJuridique: "73",
        téléphone: "0826666900",
        codeRégion: "32",
        dateOuverture: "2001-01-01"
      },
    ]);
    supprimerDossier(localPath);
  });

  it("récupère la date de mise à jour du fichier source", () => {
    const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies();
    const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_ej`;
    const finessLocalPath = `${localPath}/finess/simple`;
    // GIVEN
    créerFichierXMLTest("empty file", finessLocalPath, "finess_cs1400101_stock_20211214-0333");

    const entitéJuridiqueFinessLoader = new FinessXmlEntitésJuridiquesSourceExterneLoader(new NodeXmlToJs(), localPath, fakeLogger, orm);

    // WHEN
    const dateDeMiseÀJourDuFichierSource = entitéJuridiqueFinessLoader.récupèreLaDateDeMiseÀJourDuFichierSource();

    // THEN
    expect(dateDeMiseÀJourDuFichierSource).toBe("20211214");
    supprimerDossier(localPath);
  });
});