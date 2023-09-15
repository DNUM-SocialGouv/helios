import { Repository } from "typeorm";

import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../database/models/DateMiseÀJourFichierSourceModel";
import { EntitéJuridiqueModel } from "../../../../database/models/EntitéJuridiqueModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { DateMiseÀJourFichierSourceModelTestBuilder } from "../../../../database/test-builder/DateMiseÀJourFichierSourceModelTestBuilder";
import { EntitéJuridiqueModelTestBuilder } from "../../../../database/test-builder/EntitéJuridiqueModelTestBuilder";
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from "../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder";
import { Catégorisation } from "../../../métier/entities/EntitéJuridique";
import { fakeLogger, getOrm, uneEntitéJuridique, uneSecondeEntitéJuridique } from "../../../testHelper";
import { TypeOrmEntitéJuridiqueHeliosRepository } from "./TypeOrmEntitéJuridiqueHeliosRepository";

describe("Sauvegarde des entités juridiques", () => {
  const orm = getOrm();
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>;
  let établissementTerritorialIdentitéRepository: Repository<ÉtablissementTerritorialIdentitéModel>;
  let dateMiseÀJourFichierSourceRepository: Repository<DateMiseÀJourFichierSourceModel>;

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel);
    établissementTerritorialIdentitéRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel);
    dateMiseÀJourFichierSourceRepository = (await orm).getRepository(DateMiseÀJourFichierSourceModel);
  });

  beforeEach(async () => {
    await entitéJuridiqueRepository.query("DELETE FROM entite_juridique;");
    await établissementTerritorialIdentitéRepository.query("DELETE FROM etablissement_territorial;");
    await dateMiseÀJourFichierSourceRepository.query("DELETE FROM date_mise_a_jour_fichier_source;");
  });

  afterAll(async () => {
    await (await orm).destroy();
  });

  it("sauvegarde une entité juridique et sa date de mise à jour FINESS même si elle existe déjà", async () => {
    // GIVEN
    const entitéJuridique = new EntitéJuridiqueModel();
    entitéJuridique.adresseAcheminement = "fake";
    entitéJuridique.adresseNuméroVoie = "fake";
    entitéJuridique.adresseTypeVoie = "fake";
    entitéJuridique.adresseVoie = "fake";
    entitéJuridique.commune = "fake";
    entitéJuridique.département = "fake";
    entitéJuridique.libelléStatutJuridique = "fake";
    entitéJuridique.numéroFinessEntitéJuridique = "010018407";
    entitéJuridique.raisonSociale = "fake";
    entitéJuridique.raisonSocialeCourte = "fake";
    entitéJuridique.siren = "fake";
    entitéJuridique.téléphone = "fake";
    entitéJuridique.catégorisation = "fake";
    await entitéJuridiqueRepository.insert(entitéJuridique);
    await dateMiseÀJourFichierSourceRepository.insert([
      {
        dernièreMiseÀJour: "2020-01-02",
        fichier: FichierSource.FINESS_CS1400101,
      },
    ]);

    const typeOrmEntitéJuridiqueRepository = new TypeOrmEntitéJuridiqueHeliosRepository(orm, fakeLogger);
    const entitésJuridiques = [uneEntitéJuridique, uneSecondeEntitéJuridique];
    const nouvelleDateDeMiseÀJour = "20220728";

    // WHEN
    await typeOrmEntitéJuridiqueRepository.sauvegarde(entitésJuridiques, nouvelleDateDeMiseÀJour);

    // THEN
    const entitésJuridiquesQuery = await entitéJuridiqueRepository.find({ order: { numéroFinessEntitéJuridique: "ASC" } });
    const entitéJuridiqueMisÀJourAttendu1 = new EntitéJuridiqueModel();
    entitéJuridiqueMisÀJourAttendu1.adresseAcheminement = "01117 OYONNAX CEDEX";
    entitéJuridiqueMisÀJourAttendu1.adresseNuméroVoie = "1";
    entitéJuridiqueMisÀJourAttendu1.adresseTypeVoie = "RTE";
    entitéJuridiqueMisÀJourAttendu1.adresseVoie = "DE VEYZIAT";
    entitéJuridiqueMisÀJourAttendu1.catégorisation = "fake";
    entitéJuridiqueMisÀJourAttendu1.commune = "OYONNAX";
    entitéJuridiqueMisÀJourAttendu1.département = "AIN";
    entitéJuridiqueMisÀJourAttendu1.libelléStatutJuridique = "Etablissement Public Intercommunal dHospitalisation";
    entitéJuridiqueMisÀJourAttendu1.numéroFinessEntitéJuridique = "010018407";
    entitéJuridiqueMisÀJourAttendu1.raisonSociale = "CENTRE HOSPITALIER DU HAUT BUGEY";
    entitéJuridiqueMisÀJourAttendu1.raisonSocialeCourte = "CH DU HAUT BUGEY";
    entitéJuridiqueMisÀJourAttendu1.siren = "260104631";
    entitéJuridiqueMisÀJourAttendu1.téléphone = "0102030406";
    entitéJuridiqueMisÀJourAttendu1.codeRégion = "84";
    const entitéJuridiqueMisÀJourAttendu2 = new EntitéJuridiqueModel();
    entitéJuridiqueMisÀJourAttendu2.adresseAcheminement = "59650 VILLENEUVE D ASCQ";
    entitéJuridiqueMisÀJourAttendu2.adresseNuméroVoie = "20";
    entitéJuridiqueMisÀJourAttendu2.adresseTypeVoie = "AV";
    entitéJuridiqueMisÀJourAttendu2.adresseVoie = "DE LA RECONNAISSANCE";
    entitéJuridiqueMisÀJourAttendu2.catégorisation = Catégorisation.PRIVE_NON_LUCRATIF;
    entitéJuridiqueMisÀJourAttendu2.commune = "VILLENEUVE D ASCQ";
    entitéJuridiqueMisÀJourAttendu2.département = "NORD";
    entitéJuridiqueMisÀJourAttendu2.libelléStatutJuridique = "Société Anonyme (S.A.)";
    entitéJuridiqueMisÀJourAttendu2.numéroFinessEntitéJuridique = "590001741";
    entitéJuridiqueMisÀJourAttendu2.raisonSociale = "HOPITAL PRIVE DE VILLENEUVE DASCQ";
    entitéJuridiqueMisÀJourAttendu2.raisonSocialeCourte = "HOPITAL PRIVE DE VILLENEUVE DASCQ";
    entitéJuridiqueMisÀJourAttendu2.siren = "260104632";
    entitéJuridiqueMisÀJourAttendu2.téléphone = "0102030405";
    entitéJuridiqueMisÀJourAttendu2.codeRégion = "84";
    expect(entitésJuridiquesQuery).toStrictEqual([entitéJuridiqueMisÀJourAttendu1, entitéJuridiqueMisÀJourAttendu2]);
    const dateMiseÀJourFichierSourceSauvée = await dateMiseÀJourFichierSourceRepository.find({ where: { fichier: FichierSource.FINESS_CS1400101 } });
    const dateMiseÀJourFichierSourceAttendue = new DateMiseÀJourFichierSourceModel();
    dateMiseÀJourFichierSourceAttendue.fichier = FichierSource.FINESS_CS1400101;
    dateMiseÀJourFichierSourceAttendue.dernièreMiseÀJour = "2022-07-28";
    expect(dateMiseÀJourFichierSourceSauvée).toStrictEqual([dateMiseÀJourFichierSourceAttendue]);
  });

  it("revient à la situation initiale si la sauvegarde des entités échoue", async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = "010018407";
    const entitéJuridique = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
    await entitéJuridiqueRepository.insert([entitéJuridique]);

    await dateMiseÀJourFichierSourceRepository.insert(
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: "2020-01-01",
        fichier: FichierSource.FINESS_CS1400101,
      })
    );
    const entitéJuridiqueMalFormée = {
      ...uneEntitéJuridique,
      numéroFinessEntitéJuridique: "il y a plus de 9 caractères dans ce numéro FINESS",
    };
    const nouvelleDateDeMiseÀJour = "20220728";
    const typeOrmEntitéJuridiqueRepository = new TypeOrmEntitéJuridiqueHeliosRepository(orm, fakeLogger);

    // WHEN
    await typeOrmEntitéJuridiqueRepository.sauvegarde([entitéJuridiqueMalFormée], nouvelleDateDeMiseÀJour);

    // THEN
    const entitésJuridiquesSauvées = await entitéJuridiqueRepository.find();
    const entitéJuridiqueAttendu = new EntitéJuridiqueModel();
    entitéJuridiqueAttendu.adresseAcheminement = "01117 OYONNAX CEDEX";
    entitéJuridiqueAttendu.adresseNuméroVoie = "1";
    entitéJuridiqueAttendu.adresseTypeVoie = "RTE";
    entitéJuridiqueAttendu.adresseVoie = "DE VEYZIAT";
    entitéJuridiqueAttendu.catégorisation = Catégorisation.PUBLIC;
    entitéJuridiqueAttendu.commune = "OYONNAX";
    entitéJuridiqueAttendu.département = "AIN";
    entitéJuridiqueAttendu.libelléStatutJuridique = "Etablissement Public Intercommunal dHospitalisation";
    entitéJuridiqueAttendu.numéroFinessEntitéJuridique = numéroFinessEntitéJuridique;
    entitéJuridiqueAttendu.raisonSociale = "CENTRE HOSPITALIER DU HAUT BUGEY";
    entitéJuridiqueAttendu.raisonSocialeCourte = "CH DU HAUT BUGEY";
    entitéJuridiqueAttendu.siren = "260104631";
    entitéJuridiqueAttendu.codeRégion = "84";
    entitéJuridiqueAttendu.téléphone = "0102030406";
    expect(entitésJuridiquesSauvées).toStrictEqual([entitéJuridiqueAttendu]);

    const dateMiseÀJourFichierSourceSauvée = await dateMiseÀJourFichierSourceRepository.find({ where: { fichier: FichierSource.FINESS_CS1400101 } });
    const dateMiseÀJourFichierSourceAttendue = new DateMiseÀJourFichierSourceModel();
    dateMiseÀJourFichierSourceAttendue.fichier = FichierSource.FINESS_CS1400101;
    dateMiseÀJourFichierSourceAttendue.dernièreMiseÀJour = "2020-01-01";
    expect(dateMiseÀJourFichierSourceSauvée).toStrictEqual([dateMiseÀJourFichierSourceAttendue]);
  });

  it("supprime une entité juridique quand celle-ci est en base", async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = "010018407";
    const entitéJuridique = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique });
    await entitéJuridiqueRepository.insert([entitéJuridique]);

    const typeOrmEntitéJuridiqueRepository = new TypeOrmEntitéJuridiqueHeliosRepository(orm, fakeLogger);

    // WHEN
    await typeOrmEntitéJuridiqueRepository.supprime([numéroFinessEntitéJuridique]);

    // THEN
    await expect(entitéJuridiqueRepository.count()).resolves.toBe(0);
  });

  it("ne signale pas d’alerte si l’entité juridique à supprimer n’est pas en base", async () => {
    // GIVEN
    const numéroFinessEntitéJuridiquePasEnBase = "123456789";

    const typeOrmEntitéJuridiqueRepository = new TypeOrmEntitéJuridiqueHeliosRepository(orm, fakeLogger);

    // WHEN
    await typeOrmEntitéJuridiqueRepository.supprime([numéroFinessEntitéJuridiquePasEnBase]);

    // THEN
    await expect(entitéJuridiqueRepository.count()).resolves.toBe(0);
  });

  it("supprime une entité juridique avec ses établissements territoriaux rattachés", async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = "010018407";
    await entitéJuridiqueRepository.insert([EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })]);

    await établissementTerritorialIdentitéRepository.insert([
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique }),
      ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique }),
    ]);

    const typeOrmEntitéJuridiqueRepository = new TypeOrmEntitéJuridiqueHeliosRepository(orm, fakeLogger);

    // WHEN
    await typeOrmEntitéJuridiqueRepository.supprime([numéroFinessEntitéJuridique]);

    // THEN
    await expect(établissementTerritorialIdentitéRepository.count()).resolves.toBe(0);
  });
});
