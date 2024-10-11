import { Repository } from "typeorm";

import { AutorisationMédicoSocialModel } from "../../../../../database/models/AutorisationMédicoSocialModel";
import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { EntitéJuridiqueModelTestBuilder } from "../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder";
import { ÉtablissementTerritorialAutorisationModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialAutorisationModelTestBuilder";
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from "../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder";
import { getOrm, clearAllTables } from "../../../testHelper";
import { TypeOrmRechercheLoader } from "./TypeOrmRechercheLoader";

describe("La recherche avancée d’entités et d’établissements", () => {
    const orm = getOrm();
    let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>;
    let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>;
    let autorisationMédicoSocialModelRepository: Repository<AutorisationMédicoSocialModel>;

    const premièrePage = 1;

    const termeRecherche = "helios";
    const communeRecherche = "PARIS";
    const type = 'prive_lucratif';


    beforeAll(async () => {
        entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel);
        établissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel);
        autorisationMédicoSocialModelRepository = (await orm).getRepository(AutorisationMédicoSocialModel);
        await clearAllTables(await orm);
        await entitéJuridiqueRepository.insert([
            EntitéJuridiqueModelTestBuilder.crée({
                numéroFinessEntitéJuridique: "000000000",
                raisonSocialeCourte: `${termeRecherche} - entité juridique visible en recherche par terme, commune et type`,
                commune: communeRecherche,
                catégorisation: `${type}`,
            }),
            EntitéJuridiqueModelTestBuilder.crée({
                numéroFinessEntitéJuridique: "000000001",
                raisonSocialeCourte: `${termeRecherche} - entité juridique visible en recherche par terme`,
                catégorisation: `${type}`,
            }),
            EntitéJuridiqueModelTestBuilder.crée({
                numéroFinessEntitéJuridique: "000000002",
                raisonSocialeCourte: "entité juridique pas visible en recherche par terme",
            }),
            EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique: "999999999", raisonSocialeCourte: "entité juridique pas visible en recherche par terme" }),
        ]);

        await établissementTerritorialRepository.insert([
            ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
                numéroFinessEntitéJuridique: "000000000",
                numéroFinessÉtablissementTerritorial: "100000000",
                raisonSocialeCourte: `${termeRecherche} - établissement territorial sanitaire visible en recherche par terme et commune`,
                commune: communeRecherche,
            }),
            ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
                numéroFinessEntitéJuridique: "000000001",
                numéroFinessÉtablissementTerritorial: "100000001",
                raisonSocialeCourte: `${termeRecherche} - établissement territorial sanitaire visible en recherche par terme`,
            }),
            ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({
                numéroFinessEntitéJuridique: "999999999",
                numéroFinessÉtablissementTerritorial: "199999999",
                raisonSocialeCourte: "établissement territorial sanitaire non visible en recherche par terme",
            }),
            ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
                numéroFinessEntitéJuridique: "000000000",
                numéroFinessÉtablissementTerritorial: "200000000",
                raisonSocialeCourte: `${termeRecherche} - établissement territorial médico-social visible en recherche par terme`,
                commune: communeRecherche,
                classificationEtablissement: "publics_en_situation_de_handicap"
            }),
            ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({
                numéroFinessEntitéJuridique: "999999999",
                numéroFinessÉtablissementTerritorial: "299999999",
                raisonSocialeCourte: "établissement territorial médico-social non visible en recherche par terme",
                commune: communeRecherche,
                classificationEtablissement: "non_classifie"

            }),
        ]);
    });

    afterAll(async () => {
        await (await orm).destroy();
    });

    it("par terme de recherche et commune", async () => {
        // GIVEN
        const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

        // WHEN
        const rechercheAvancee = await typeOrmRechercheLoader.rechercheAvancee(termeRecherche, communeRecherche, "", [], [], '', 'ASC', premièrePage);

        //THEN
        expect(rechercheAvancee.nombreDeRésultats).toBe("3");
    });

    it("par terme de recherche, commune et structure", async () => {
        // GIVEN
        const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

        // WHEN
        const rechercheAvancee = await typeOrmRechercheLoader.rechercheAvancee(termeRecherche, communeRecherche, "Médico-social", [], [], '', 'ASC', premièrePage);

        //THEN
        expect(rechercheAvancee.nombreDeRésultats).toBe("1");
    });

    it("par commune et structure", async () => {
        // GIVEN
        const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

        // WHEN
        const rechercheAvancee = await typeOrmRechercheLoader.rechercheAvancee("", communeRecherche, "Médico-social", [], [], '', 'ASC', premièrePage);

        //THEN
        expect(rechercheAvancee.nombreDeRésultats).toBe("2");
    });

    it("par terme de recherche, commune , structure et type", async () => {
        // GIVEN
        const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

        // WHEN
        const rechercheAvancee = await typeOrmRechercheLoader.rechercheAvancee(termeRecherche, communeRecherche, "Entité juridique", ["prive_lucratif"], [], '', 'ASC', premièrePage);

        //THEN
        expect(rechercheAvancee.nombreDeRésultats).toBe("1");
    });

    it("par terme de recherche, structure et type", async () => {
        // GIVEN
        const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

        // WHEN
        const rechercheAvancee = await typeOrmRechercheLoader.rechercheAvancee(termeRecherche, "", "Entité juridique", ["prive_lucratif"], [], '', 'ASC', premièrePage);

        //THEN
        expect(rechercheAvancee.nombreDeRésultats).toBe("2");
    });

    it("par commune  et capacité", async () => {
        // GIVEN
        const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

        await autorisationMédicoSocialModelRepository.insert([
            ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
                capacitéAutoriséeTotale: 120,
                capacitéInstalléeTotale: 120,
                numéroFinessÉtablissementTerritorial: "200000000",
            }),
            ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
                capacitéAutoriséeTotale: 15,
                capacitéInstalléeTotale: 15,
                numéroFinessÉtablissementTerritorial: "200000000",
            }),
            ÉtablissementTerritorialAutorisationModelTestBuilder.créeMédicoSocial({
                capacitéAutoriséeTotale: 100,
                capacitéInstalléeTotale: 10,
                numéroFinessÉtablissementTerritorial: "299999999",
            }),
        ]);

        // WHEN
        const rechercheAvancee = await typeOrmRechercheLoader.rechercheAvancee("", communeRecherche, "", [], [{ classification: 'publics_en_situation_de_handicap', ranges: ['1,30', '>100'] }, { classification: 'non_classifie', ranges: ['1,50', '>199'] }], '', 'ASC', premièrePage);

        //THEN
        expect(rechercheAvancee.nombreDeRésultats).toBe("2");
    });

    it("par terme de recherche, commune et capacité", async () => {
        // GIVEN
        const typeOrmRechercheLoader = new TypeOrmRechercheLoader(orm);

        // WHEN
        const rechercheAvancee = await typeOrmRechercheLoader.rechercheAvancee(termeRecherche, communeRecherche, "", [], [{ classification: 'publics_en_situation_de_handicap', ranges: ['1,30', '>100'] }, { classification: 'non_classifie', ranges: ['1,50', '>199'] }], '', 'ASC', premièrePage);

        //THEN
        expect(rechercheAvancee.nombreDeRésultats).toBe("1");
    });

});