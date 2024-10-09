import { DomaineÉtablissementTerritorial } from "../../../métier/entities/DomaineÉtablissementTerritorial";
import { Classification, ÉtablissementTerritorialIdentité } from "../../../métier/entities/ÉtablissementTerritorialIdentité";
import { créerFichierXMLTest, fakeLogger, getFakeDataCrawlerDependencies, getOrm, supprimerDossier } from "../../../testHelper";
import { NodeXmlToJs } from "../xml-to-js/NodeXmlToJs";
import { FinessXmlÉtablissementTerritorialSourceExterneLoader } from "./FinessXmlÉtablissementTerritorialSourceExterneLoader";

const orm = getOrm();


describe("Récupération des établissements territoriaux de la source de données FINESS", () => {
  const etOuvert1 = `<structureet>
    <nofinesset>010000040</nofinesset>
    <nofinessej>010008407</nofinessej>
    <rs>CH NANTUA</rs>
    <rslongue>CENTRE HOSPITALIER NANTUA</rslongue>
    <numvoie>50</numvoie>
    <typvoie>R</typvoie>
    <voie>PAUL PAINLEVE</voie>
    <ligneacheminement>01130 NANTUA</ligneacheminement>
    <libcommune>NANTUA</libcommune>
    <libdepartement>AIN</libdepartement>
    <departement>01</departement>
    <telephone>0474754800</telephone>
    <courriel xsi:nil="true"/>
    <categetab>355</categetab>
    <libcategetab>Centre Hospitalier (C.H.)</libcategetab>
    <libcourtcategetab>C.H.</libcourtcategetab>
    <categagretab>1102</categagretab>
    <typeet>S</typeet>
    <siret>26011021800047</siret>
    <codemft>03</codemft>
    <libmft>ARS établissements Publics de santé dotation globale</libmft>
    <nofinessppal>010000057</nofinessppal>
    <dateouv>1901-02-02</dateouv>
    <indcaduc xsi:nil="true"/>
    <datefermeture xsi:nil="true"/>
  </structureet>`;
  const etOuvert2 = `<structureet>
    <nofinesset>010000057</nofinesset>
    <nofinessej>010008407</nofinessej>
    <rs>CH OYONNAX</rs>
    <rslongue>CENTRE HOSPITALIER OYONNAX</rslongue>
    <numvoie xsi:nil="true"/>
    <typvoie>RTE</typvoie>
    <voie>DE VEYZIAT</voie>
    <ligneacheminement>01100 OYONNAX</ligneacheminement>
    <libcommune>OYONNAX</libcommune>
    <libdepartement>AIN</libdepartement>
    <departement>01</departement>
    <telephone>0474731001</telephone>
    <courriel xsi:nil="true"/>
    <categetab>001</categetab>
    <libcategetab>Autres lits de m.R.</libcategetab>
    <libcourtcategetab>C.H.</libcourtcategetab>
    <categagretab>1102</categagretab>
    <typeet>S</typeet>
    <siret>26011021800013</siret>
    <codemft>03</codemft>
    <dateouv>1901-02-02</dateouv>
    <libmft>ARS établissements Publics de santé dotation globale</libmft>
    <nofinessppal>010005239</nofinessppal>
    <indcaduc xsi:nil="true"/>
    <datefermeture xsi:nil="true"/>
  </structureet>`;

  beforeEach(async () => {
    await créationDuFichierXmlEj();
  });

  afterAll(async () => {
    await (await orm).destroy();
  });

  it("récupère les établissements territoriaux de la source de données FINESS uniquement s’ils ne sont pas fermés", async () => {
    const fakeDataCrawlerDependencies = await getFakeDataCrawlerDependencies();
    const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_et`;

    // GIVEN
    const etFermé = `<structureet>
        <nofinesset>010787190</nofinesset>
        <nofinessej>010000164</nofinessej>
        <rs>[Fermé] SMUR POLYCLINIQUE AMBERIEU</rs>
        <rslongue>[Fermé] SMUR POLYCLINIQUE AMBERIEU EN BUGEY</rslongue>
        <numvoie>17</numvoie>
        <typvoie>R</typvoie>
        <voie>AIME VINGTRINIER</voie>
        <ligneacheminement>01500 AMBERIEU EN BUGEY</ligneacheminement>
        <libcommune>AMBERIEU EN BUGEY</libcommune>
        <libdepartement>AIN</libdepartement>
        <departement>01</departement>
        <telephone>0474383000</telephone>
        <courriel xsi:nil="true"/>
        <categetab>001</categetab>
        <dateouv>1901-02-02</dateouv>
        <libcategetab>Unité Mobile Hospitalière</libcategetab>
        <libcourtcategetab>Unité Mobile Hosp.</libcourtcategetab>
        <categagretab>1204</categagretab>
        <typeet>P</typeet>
        <siret xsi:nil="true"/>
        <codemft>01</codemft>
        <libmft>Etablissement Tarif Libre</libmft>
        <nofinessppal xsi:nil="true"/>
        <indcaduc xsi:nil="true"/>
        <datefermeture>1993-01-01</datefermeture>
      </structureet>`;
    await écritureDuFichierXmlEt([etOuvert1, etOuvert2, etFermé]);
    const établissementTerritorialFinessLoader = new FinessXmlÉtablissementTerritorialSourceExterneLoader(new NodeXmlToJs(), localPath, fakeLogger, orm);

    // WHEN
    const établissementsTerritoriaux = await établissementTerritorialFinessLoader.récupèreLesÉtablissementsTerritoriauxOuverts(["010008407", "010000164"]);

    // THEN
    expect(établissementsTerritoriaux).toStrictEqual<ÉtablissementTerritorialIdentité[]>([
      {
        adresseAcheminement: "01130 NANTUA",
        adresseNuméroVoie: "50",
        adresseTypeVoie: "R",
        adresseVoie: "PAUL PAINLEVE",
        catégorieÉtablissement: "355",
        codeModeTarification: "03",
        commune: "NANTUA",
        courriel: "",
        domaine: DomaineÉtablissementTerritorial.SANITAIRE,
        département: "AIN",
        libelléCatégorieÉtablissement: "Centre Hospitalier (C.H.)",
        classification: Classification.NON_CALSSIFIE,
        libelléCourtCatégorieÉtablissement: "C.H.",
        libelléModeTarification: "ARS établissements Publics de santé dotation globale",
        numéroFinessEntitéJuridique: "010008407",
        numéroFinessÉtablissementPrincipal: "010000057",
        numéroFinessÉtablissementTerritorial: "010000040",
        raisonSociale: "CENTRE HOSPITALIER NANTUA",
        raisonSocialeCourte: "CH NANTUA",
        siret: "26011021800047",
        typeÉtablissement: "S",
        téléphone: "0474754800",
        codeRégion: "84",
        dateOuverture: "1901-02-02"
      },
      {
        adresseAcheminement: "01100 OYONNAX",
        adresseNuméroVoie: "",
        adresseTypeVoie: "RTE",
        adresseVoie: "DE VEYZIAT",
        catégorieÉtablissement: "001",
        codeModeTarification: "03",
        commune: "OYONNAX",
        courriel: "",
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        département: "AIN",
        libelléCatégorieÉtablissement: "Autres lits de m.R.",
        classification: Classification.NON_CALSSIFIE,
        libelléCourtCatégorieÉtablissement: "C.H.",
        libelléModeTarification: "ARS établissements Publics de santé dotation globale",
        numéroFinessEntitéJuridique: "010008407",
        numéroFinessÉtablissementPrincipal: "010005239",
        numéroFinessÉtablissementTerritorial: "010000057",
        raisonSociale: "CENTRE HOSPITALIER OYONNAX",
        raisonSocialeCourte: "CH OYONNAX",
        siret: "26011021800013",
        typeÉtablissement: "S",
        téléphone: "0474731001",
        codeRégion: "84",
        dateOuverture: "1901-02-02"
      },
    ]);
    supprimerDossier(localPath);
  });

  it("récupère les établissements territoriaux de la source de données FINESS uniquement s’ils ne sont pas caducs", async () => {
    const fakeDataCrawlerDependencies = await getFakeDataCrawlerDependencies();
    const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_et`;

    // GIVEN
    const etCaduc = `<structureet>
      <nofinesset>100007012</nofinesset>
      <nofinessej>100000983</nofinessej>
      <rs>[Caduque] MAISON DE REPOS ET DE CONVALESCENCE</rs>
      <rslongue xsi:nil="true"/>
      <numvoie xsi:nil="true"/>
      <typvoie xsi:nil="true"/>
      <voie xsi:nil="true"/>
      <ligneacheminement>10400 PONT SUR SEINE</ligneacheminement>
      <libcommune>PONT SUR SEINE</libcommune>
      <libdepartement>AUBE</libdepartement>
      <departement>10</departement>
      <telephone xsi:nil="true"/>
      <courriel xsi:nil="true"/>
      <categetab>001</categetab>
      <libcategetab>Unité Mobile Hospitalière</libcategetab>
      <libcourtcategetab>Unité Mobile Hosp.</libcourtcategetab>
      <categagretab>1204</categagretab>
      <typeet>P</typeet>
      <siret xsi:nil="true"/>
      <codemft>01</codemft>
      <dateouv>1901-02-02</dateouv>
      <libmft>Etablissement Tarif Libre</libmft>
      <nofinessppal xsi:nil="true"/>
      <indcaduc>O</indcaduc>
      <datefermeture xsi:nil="true"/>
    </structureet>`;
    await écritureDuFichierXmlEt([etOuvert1, etOuvert2, etCaduc]);
    const établissementTerritorialFinessLoader = new FinessXmlÉtablissementTerritorialSourceExterneLoader(new NodeXmlToJs(), localPath, fakeLogger, orm);

    // WHEN
    const établissementsTerritoriaux = await établissementTerritorialFinessLoader.récupèreLesÉtablissementsTerritoriauxOuverts(["010008407", "100000983"]);

    // THEN
    expect(établissementsTerritoriaux).toStrictEqual<ÉtablissementTerritorialIdentité[]>([
      {
        adresseAcheminement: "01130 NANTUA",
        adresseNuméroVoie: "50",
        adresseTypeVoie: "R",
        adresseVoie: "PAUL PAINLEVE",
        catégorieÉtablissement: "355",
        codeModeTarification: "03",
        commune: "NANTUA",
        courriel: "",
        domaine: DomaineÉtablissementTerritorial.SANITAIRE,
        département: "AIN",
        libelléCatégorieÉtablissement: "Centre Hospitalier (C.H.)",
        classification: Classification.NON_CALSSIFIE,
        libelléCourtCatégorieÉtablissement: "C.H.",
        libelléModeTarification: "ARS établissements Publics de santé dotation globale",
        numéroFinessEntitéJuridique: "010008407",
        numéroFinessÉtablissementPrincipal: "010000057",
        numéroFinessÉtablissementTerritorial: "010000040",
        raisonSociale: "CENTRE HOSPITALIER NANTUA",
        raisonSocialeCourte: "CH NANTUA",
        siret: "26011021800047",
        typeÉtablissement: "S",
        téléphone: "0474754800",
        codeRégion: "84",
        dateOuverture: "1901-02-02"
      },
      {
        adresseAcheminement: "01100 OYONNAX",
        adresseNuméroVoie: "",
        adresseTypeVoie: "RTE",
        adresseVoie: "DE VEYZIAT",
        catégorieÉtablissement: "001",
        codeModeTarification: "03",
        commune: "OYONNAX",
        courriel: "",
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        département: "AIN",
        libelléCatégorieÉtablissement: "Autres lits de m.R.",
        classification: Classification.NON_CALSSIFIE,
        libelléCourtCatégorieÉtablissement: "C.H.",
        libelléModeTarification: "ARS établissements Publics de santé dotation globale",
        numéroFinessEntitéJuridique: "010008407",
        numéroFinessÉtablissementPrincipal: "010005239",
        numéroFinessÉtablissementTerritorial: "010000057",
        raisonSociale: "CENTRE HOSPITALIER OYONNAX",
        raisonSocialeCourte: "CH OYONNAX",
        siret: "26011021800013",
        typeÉtablissement: "S",
        téléphone: "0474731001",
        codeRégion: "84",
        dateOuverture: "1901-02-02"
      },
    ]);
    supprimerDossier(localPath);
  });

  it("récupère les établissements territoriaux de la source de données FINESS uniquement si leur EJ associée est ouverte donc existe en base", async () => {
    const fakeDataCrawlerDependencies = await getFakeDataCrawlerDependencies();
    const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_et`;

    // GIVEN
    const numéroFinessDeLEjEnBase = "010008407";
    const numéroFinessDeLEjFermé = "010008408";
    const etOuvertAssociéÀLEjExistant = etOuvert1;
    const etOuvertAssociéÀUnEjNonExistant = `<structureet>
        <nofinesset>010000057</nofinesset>
        <nofinessej>${numéroFinessDeLEjFermé}</nofinessej>
        <rs>CH OYONNAX</rs>
        <rslongue>CENTRE HOSPITALIER OYONNAX</rslongue>
        <numvoie xsi:nil="true"/>
        <typvoie>RTE</typvoie>
        <voie>DE VEYZIAT</voie>
        <ligneacheminement>01100 OYONNAX</ligneacheminement>
        <libcommune>OYONNAX</libcommune>
        <libdepartement>AIN</libdepartement>
        <departement>01</departement>
        <telephone>0474731001</telephone>
        <courriel xsi:nil="true"/>
        <categetab>001</categetab>
        <libcategetab>Autres lits de m.R.</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <categagretab>1102</categagretab>
        <typeet>S</typeet>
        <siret>26011021800013</siret>
        <codemft>03</codemft>
        <libmft>ARS établissements Publics de santé dotation globale</libmft>
        <nofinessppal>010005239</nofinessppal>
        <indcaduc xsi:nil="true"/>
        <datefermeture xsi:nil="true"/>
      </structureet>`;
    await écritureDuFichierXmlEt([etOuvertAssociéÀLEjExistant, etOuvertAssociéÀUnEjNonExistant]);
    const établissementTerritorialFinessLoader = new FinessXmlÉtablissementTerritorialSourceExterneLoader(new NodeXmlToJs(), localPath, fakeLogger, orm);

    // WHEN
    const établissementsTerritoriaux = await établissementTerritorialFinessLoader.récupèreLesÉtablissementsTerritoriauxOuverts([numéroFinessDeLEjEnBase]);

    // THEN
    expect(établissementsTerritoriaux).toStrictEqual<ÉtablissementTerritorialIdentité[]>([
      {
        adresseAcheminement: "01130 NANTUA",
        adresseNuméroVoie: "50",
        adresseTypeVoie: "R",
        adresseVoie: "PAUL PAINLEVE",
        catégorieÉtablissement: "355",
        codeModeTarification: "03",
        commune: "NANTUA",
        courriel: "",
        domaine: DomaineÉtablissementTerritorial.SANITAIRE,
        département: "AIN",
        libelléCatégorieÉtablissement: "Centre Hospitalier (C.H.)",
        classification: Classification.NON_CALSSIFIE,
        libelléCourtCatégorieÉtablissement: "C.H.",
        libelléModeTarification: "ARS établissements Publics de santé dotation globale",
        numéroFinessEntitéJuridique: "010008407",
        numéroFinessÉtablissementPrincipal: "010000057",
        numéroFinessÉtablissementTerritorial: "010000040",
        raisonSociale: "CENTRE HOSPITALIER NANTUA",
        raisonSocialeCourte: "CH NANTUA",
        siret: "26011021800047",
        typeÉtablissement: "S",
        téléphone: "0474754800",
        codeRégion: "84",
        dateOuverture: "1901-02-02"
      },
    ]);
    supprimerDossier(localPath);
  });

  it("récupère la raison sociale écourtée si la raison sociale longue n’est pas renseignée", async () => {
    const fakeDataCrawlerDependencies = await getFakeDataCrawlerDependencies();
    const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_et`;
    const etSansRaisonSocialeLongue1 = `<structureet>
      <nofinesset>010000040</nofinesset>
      <nofinessej>010008407</nofinessej>
      <rs>CH NANTUA</rs>
      <rslongue xsi:nil="true"/>
      <numvoie>50</numvoie>
      <typvoie>R</typvoie>
      <voie>PAUL PAINLEVE</voie>
      <ligneacheminement>01130 NANTUA</ligneacheminement>
      <libcommune>NANTUA</libcommune>
      <libdepartement>AIN</libdepartement>
      <departement>01</departement>
      <telephone>0474754800</telephone>
      <courriel xsi:nil="true"/>
      <categetab>355</categetab>
      <libcategetab>Centre Hospitalier (C.H.)</libcategetab>
      <libcourtcategetab>C.H.</libcourtcategetab>
      <categagretab>1102</categagretab>
      <typeet>S</typeet>
      <siret>26011021800047</siret>
      <codemft>03</codemft>
      <libmft>ARS établissements Publics de santé dotation globale</libmft>
      <nofinessppal>010000057</nofinessppal>
      <dateouv>1901-01-01</dateouv>
      <indcaduc xsi:nil="true"/>
      <datefermeture xsi:nil="true"/>
    </structureet>`;
    const etSansRaisonSocialeLongue2 = `<structureet>
      <nofinesset>010000057</nofinesset>
      <nofinessej>010008407</nofinessej>
      <rs>CH OYONNAX</rs>
      <rslongue xsi:nil="true"/>
      <numvoie xsi:nil="true"/>
      <typvoie>RTE</typvoie>
      <voie>DE VEYZIAT</voie>
      <ligneacheminement>01100 OYONNAX</ligneacheminement>
      <libcommune>OYONNAX</libcommune>
      <libdepartement>AIN</libdepartement>
      <departement>01</departement>
      <telephone>0474731001</telephone>
      <courriel xsi:nil="true"/>
      <categetab>001</categetab>
      <libcategetab>Autres lits de m.R.</libcategetab>
      <libcourtcategetab>C.H.</libcourtcategetab>
      <categagretab>1102</categagretab>
      <typeet>S</typeet>
      <siret>26011021800013</siret>
      <dateouv>1901-01-01</dateouv>
      <codemft>03</codemft>
      <libmft>ARS établissements Publics de santé dotation globale</libmft>
      <nofinessppal>010005239</nofinessppal>
      <indcaduc xsi:nil="true"/>
      <datefermeture xsi:nil="true"/>
    </structureet>`;
    await écritureDuFichierXmlEt([etSansRaisonSocialeLongue1, etSansRaisonSocialeLongue2]);
    const établissementTerritorialFinessLoader = new FinessXmlÉtablissementTerritorialSourceExterneLoader(new NodeXmlToJs(), localPath, fakeLogger, orm);

    // WHEN
    const établissementsTerritoriaux = await établissementTerritorialFinessLoader.récupèreLesÉtablissementsTerritoriauxOuverts(["010008407", "010000164"]);

    // THEN
    expect(établissementsTerritoriaux).toStrictEqual<ÉtablissementTerritorialIdentité[]>([
      {
        adresseAcheminement: "01130 NANTUA",
        adresseNuméroVoie: "50",
        adresseTypeVoie: "R",
        adresseVoie: "PAUL PAINLEVE",
        catégorieÉtablissement: "355",
        codeModeTarification: "03",
        commune: "NANTUA",
        courriel: "",
        domaine: DomaineÉtablissementTerritorial.SANITAIRE,
        département: "AIN",
        libelléCatégorieÉtablissement: "Centre Hospitalier (C.H.)",
        classification: Classification.NON_CALSSIFIE,
        libelléCourtCatégorieÉtablissement: "C.H.",
        libelléModeTarification: "ARS établissements Publics de santé dotation globale",
        numéroFinessEntitéJuridique: "010008407",
        numéroFinessÉtablissementPrincipal: "010000057",
        numéroFinessÉtablissementTerritorial: "010000040",
        raisonSociale: "CH NANTUA",
        raisonSocialeCourte: "CH NANTUA",
        siret: "26011021800047",
        typeÉtablissement: "S",
        téléphone: "0474754800",
        codeRégion: "84",
        dateOuverture: "1901-01-01"
      },
      {
        adresseAcheminement: "01100 OYONNAX",
        adresseNuméroVoie: "",
        adresseTypeVoie: "RTE",
        adresseVoie: "DE VEYZIAT",
        catégorieÉtablissement: "001",
        codeModeTarification: "03",
        commune: "OYONNAX",
        courriel: "",
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        département: "AIN",
        libelléCatégorieÉtablissement: "Autres lits de m.R.",
        classification: Classification.NON_CALSSIFIE,
        libelléCourtCatégorieÉtablissement: "C.H.",
        libelléModeTarification: "ARS établissements Publics de santé dotation globale",
        numéroFinessEntitéJuridique: "010008407",
        numéroFinessÉtablissementPrincipal: "010005239",
        numéroFinessÉtablissementTerritorial: "010000057",
        raisonSociale: "CH OYONNAX",
        raisonSocialeCourte: "CH OYONNAX",
        siret: "26011021800013",
        typeÉtablissement: "S",
        téléphone: "0474731001",
        codeRégion: "84",
        dateOuverture: "1901-01-01"
      },
    ]);
    supprimerDossier(localPath);
  });

  it("récupère la date de mise à jour du fichier source", async () => {
    const fakeDataCrawlerDependencies = await getFakeDataCrawlerDependencies();
    const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_et`;

    // GIVEN
    await écritureDuFichierXmlEt();
    const établissementTerritorialFinessLoader = new FinessXmlÉtablissementTerritorialSourceExterneLoader(new NodeXmlToJs(), localPath, fakeLogger, orm);

    // WHEN
    const dateDeMiseÀJourDuFichierSource = await établissementTerritorialFinessLoader.récupèreLaDateDeMiseÀJourDuFichierSource();

    // THEN
    expect(dateDeMiseÀJourDuFichierSource).toBe("20211214");
    supprimerDossier(localPath);
  });
});

async function écritureDuFichierXmlEt(xmlEt: string[] = []): Promise<void> {
  const fakeDataCrawlerDependencies = await getFakeDataCrawlerDependencies();
  const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_et`;
  const finessLocalPath = `${localPath}/finess/simple`;
  créerFichierXMLTest(xmlEt.join(), finessLocalPath, "finess_cs1400102_stock_20211214-0336");
}

async function créationDuFichierXmlEj(): Promise<void> {
  const fakeDataCrawlerDependencies = await getFakeDataCrawlerDependencies();
  const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_et`;
  const nomenclatureLocalPath = `${localPath}/finess/nomenclature`;
  const nomenclCategorieETAvecAgr = `<nomenclcategorieETavecagr>
      <code>355</code>
      <libelle>Centre Hospitalier (C.H.)</libelle>
      <domaine>SAN</domaine>
    </nomenclcategorieETavecagr>
    <nomenclcategorieETavecagr>
      <code>001</code>
      <libelle>Autres lits de m.R.</libelle>
      <domaine>SOC</domaine>
    </nomenclcategorieETavecagr>`;

  créerFichierXMLTest(nomenclCategorieETAvecAgr, nomenclatureLocalPath, "finess_cs1500106_stock_20211214-0417");
}