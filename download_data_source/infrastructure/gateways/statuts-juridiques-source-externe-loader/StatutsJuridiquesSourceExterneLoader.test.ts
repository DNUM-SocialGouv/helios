import { créerFichierXMLTest, getFakeDataCrawlerDependencies, supprimerDossier, fakeLogger } from "../../../testHelper";
import { NodeXmlToJs } from "../xml-to-js/NodeXmlToJs";
import { XMLStatutsJuridiquesSourceExterneLoader } from "./StatutsJuridiquesSourceExterneLoader";

describe("Récupération des niveaux de statuts juridiques de la source de données de FINESS nomenclature", () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies();
  const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_statuts_juridiques`;
  const finessLocalPath = `${localPath}/finess/nomenclature`;
  const filename = "finess_cs1500107_stock_20211214-0333";

  afterEach(() => {
    supprimerDossier(localPath);
  });

  it("récupère les niveaux de statuts juridiques", () => {
    // GIVEN
    const xmlStatutJuridique = `<nomenclstatutavecagr><code>14</code><codeagr2>1200</codeagr2><codeagr1>1000</codeagr1></nomenclstatutavecagr>`;
    const xmlStatutJuridique2 = `<nomenclstatutavecagr><code>44</code><codeagr2>2100</codeagr2><codeagr1>2000</codeagr1></nomenclstatutavecagr>`;
    créerFichierXMLTest(`${xmlStatutJuridique} ${xmlStatutJuridique2}`, finessLocalPath, filename);

    const statutsJuridiquesSourceExterneLoader = new XMLStatutsJuridiquesSourceExterneLoader(new NodeXmlToJs(), localPath, fakeLogger);
    // WHEN
    const niveauxStatutsJuridiques = statutsJuridiquesSourceExterneLoader.récupèreLesNiveauxDesStatutsJuridiques();

    // THEN
    expect(niveauxStatutsJuridiques).toStrictEqual([
      {
        statutJuridique: "14",
        statutJuridiqueNiv1: "1000",
        statutJuridiqueNiv2: "1200",
      },
      {
        statutJuridique: "44",
        statutJuridiqueNiv1: "2000",
        statutJuridiqueNiv2: "2100",
      },
    ]);
  });
});
