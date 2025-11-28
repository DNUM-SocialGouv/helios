import { DataSource } from "typeorm";

import { construitEchelleTemporelleVigieRh } from "./utils/EchelleTemporelleVigieRh";
import { ActivitéMédicoSocialModel } from "../../../../../database/models/ActivitéMédicoSocialModel";
import { AutorisationMédicoSocialModel } from "../../../../../database/models/AutorisationMédicoSocialModel";
import { BudgetEtFinancesMédicoSocialModel } from "../../../../../database/models/BudgetEtFinancesMédicoSocialModel";
import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { EvenementIndesirableETModel } from "../../../../../database/models/EvenementIndesirableModel";
import { InspectionsControlesETModel } from "../../../../../database/models/InspectionsModel";
import { ReclamationETModel } from "../../../../../database/models/ReclamationETModel";
import { RessourcesHumainesMédicoSocialModel } from "../../../../../database/models/RessourcesHumainesMédicoSocialModel";
import { VigieRhRefDureeCddModel } from "../../../../../database/models/vigie_rh/referentiel/VigieRhRefDureeCddModel";
import { VigieRhRefMotifRuptutreContratModel } from "../../../../../database/models/vigie_rh/referentiel/VigieRhRefMotifRuptureContratModel";
import { VigieRhRefProfessionFiliereModel } from "../../../../../database/models/vigie_rh/referentiel/VigieRhRefProfessionFiliereModel";
import {
  VigieRhRefProfessionGroupeModel
} from "../../../../../database/models/vigie_rh/referentiel/VigieRhRefProfessionGroupeModel";
import { VigieRhRefTrancheAgeModel } from "../../../../../database/models/vigie_rh/referentiel/VigieRhRefTrancheAgeModel";
import { VigieRhMouvementsModel } from "../../../../../database/models/vigie_rh/VigieRhMouvementsModel";
import { VigieRhMouvementsTrimestrielsModel } from "../../../../../database/models/vigie_rh/VigieRhMouvementsTrimestrielsModel";
import {
  VigieRhNatureContratsAnnuelModel
} from "../../../../../database/models/vigie_rh/VigieRhNatureContratsAnnuelModel";
import {
  VigieRhNatureContratsTrimestrielModel
} from "../../../../../database/models/vigie_rh/VigieRhNatureContratsTrimestrielModel";
import { VigieRhProfessionFiliereModel } from "../../../../../database/models/vigie_rh/VigieRhProfessionFiliereModel";
import { VigieRhProfessionGroupeModel } from "../../../../../database/models/vigie_rh/VigieRhProfessionGroupeModel";
import { VigieRhPyramideAgesModel } from "../../../../../database/models/vigie_rh/VigieRHPyramideAgeModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { DomaineÉtablissementTerritorial } from "../../../métier/entities/DomaineÉtablissementTerritorial";
import { CadreBudgétaire } from "../../../métier/entities/établissement-territorial-médico-social/CadreBudgétaire";
import {
  EchelleTemporelleVigieRh,
  EtablissementTerritorialMedicoSocialVigieRH,
  ProfessionFiliere,
  ProfessionFiliereData,
  ProfessionGroupeData,
} from "../../../métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { MonoÉtablissement } from "../../../métier/entities/établissement-territorial-médico-social/MonoÉtablissement";
import { ÉtablissementTerritorialMédicoSocialActivité } from "../../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité";
import {
  AutorisationMédicoSocialActivité,
  AutorisationMédicoSocialClientèle,
  AutorisationMédicoSocialDatesEtCapacités,
  AutorisationMédicoSocialDiscipline,
  ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité,
} from "../../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "../../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from "../../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines";
import { ÉtablissementTerritorialIdentité } from "../../../métier/entities/ÉtablissementTerritorialIdentité";
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from "../../../métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée";
import { EvenementsIndesirables, Reclamations, ÉtablissementTerritorialQualite } from "../../../métier/entities/ÉtablissementTerritorialQualite";
import { ÉtablissementTerritorialMédicoSocialLoader } from "../../../métier/gateways/ÉtablissementTerritorialMédicoSocialLoader";

type ResultatQueryDureeCdd = Readonly<{
  numero_finess_etablissement_territorial: string,
  annee: number,
  trimestre: number,
  effectif: number,
  effectif_ref: number,
  duree: string,
  duree_code: number;
}>

type ResultatQueryMotifRupture = Readonly<{
  finess_et: string,
  annee: number,
  trimestre: number,
  effectif: number,
  effectif_ref: number,
  motif: string,
  code: number;
}>

type ModelsBlocVigieRh = Readonly<{
  pyramideAgesModel: VigieRhPyramideAgesModel[];
  tranchesAgeModel: VigieRhRefTrancheAgeModel[];
  mouvementsModel: VigieRhMouvementsModel[];
  vigieRhMouvementsTrimestrielsModel: VigieRhMouvementsTrimestrielsModel[];
  dureesCddModel: ResultatQueryDureeCdd[];
  dureesCddRefModel: VigieRhRefDureeCddModel[];
  motifsRuptureModel: ResultatQueryMotifRupture[];
  motifsLibelleModel: VigieRhRefMotifRuptutreContratModel[];
  professionFiliereModel: ProfessionFiliere;
  natureContratsAnnuel: VigieRhNatureContratsAnnuelModel[];
  natureContratsTrimestriel: VigieRhNatureContratsTrimestrielModel[];
  echelleTemporelle: Record<string, EchelleTemporelleVigieRh>;
}>;
export class TypeOrmÉtablissementTerritorialMédicoSocialLoader implements ÉtablissementTerritorialMédicoSocialLoader {
  constructor(private readonly orm: Promise<DataSource>) { }

  async chargeActivité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialMédicoSocialActivité[]> {
    const activitésÉtablissementTerritorialActivitésModel = await this.chargeLesActivitésModel(numéroFinessÉtablissementTerritorial);
    const dateDeMiseÀJourAnnMsTdpEtModel = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_MS_TDP_ET);
    const dateDeMiseÀJourAnnErrdEjEtModel = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_ERRD_EJ_ET);
    return this.construisActivité(activitésÉtablissementTerritorialActivitésModel, dateDeMiseÀJourAnnMsTdpEtModel, dateDeMiseÀJourAnnErrdEjEtModel);
  }

  async chargeIdentité(
    numéroFinessÉtablissementTerritorial: string
  ): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialMédicoSocialNonTrouvée> {
    const établissementTerritorialIdentitéModel = await this.chargeLIdentitéModel(numéroFinessÉtablissementTerritorial);

    if (!établissementTerritorialIdentitéModel) {
      return new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial);
    }

    const dateDeMiseÀJourIdentitéModel = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400102));
    const dateDeMiseÀJourAnnMsTdpEtModel = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_MS_TDP_ET));
    const domaineÉtablissementPrincipal = await this.chargePrincipaDomaine(établissementTerritorialIdentitéModel.numéroFinessÉtablissementPrincipal);

    return this.construisIdentité(établissementTerritorialIdentitéModel, dateDeMiseÀJourIdentitéModel, dateDeMiseÀJourAnnMsTdpEtModel, domaineÉtablissementPrincipal);
  }

  async chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité> {
    const autorisationsDeLÉtablissementModel = await this.chargeLesAutorisationsModel(numéroFinessÉtablissementTerritorial);
    const dateDeMiseÀJourFinessCs1400105Model = await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400105);

    return {
      autorisations: this.construisLesAutorisations(autorisationsDeLÉtablissementModel, dateDeMiseÀJourFinessCs1400105Model),
      capacités: this.construisLesCapacités(autorisationsDeLÉtablissementModel, dateDeMiseÀJourFinessCs1400105Model),
      numéroFinessÉtablissementTerritorial,
    };
  }

  async estUnMonoÉtablissement(numéroFinessEntitéJuridique: string): Promise<MonoÉtablissement> {
    const nombreDÉtablissementTerritoriauxDansLEntitéJuridique = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .countBy({ numéroFinessEntitéJuridique });
    const dateDeMiseÀJourIdentitéModel = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400102));

    return {
      estMonoÉtablissement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: nombreDÉtablissementTerritoriauxDansLEntitéJuridique === 1,
      },
    };
  }

  async chargeBudgetEtFinances(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialMédicoSocialBudgetEtFinances[]> {
    const budgetEtFinancesModelDeLÉtablissementTerritorial = await this.chargeLesBudgetEtFinancesModel(numéroFinessÉtablissementTerritorial);
    const dateDeMiseÀJourAnnErrdEjEt = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_ERRD_EJ_ET);
    const dateDeMiseÀJourAnnCaEjEt = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_CA_EJ_ET);
    const dateDeMiseÀJourAnnErrdEj = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_ERRD_EJ);

    return this.construisLeBudgetEtFinances(
      budgetEtFinancesModelDeLÉtablissementTerritorial,
      dateDeMiseÀJourAnnErrdEjEt,
      dateDeMiseÀJourAnnErrdEj,
      dateDeMiseÀJourAnnCaEjEt
    );
  }

  async chargeRessourcesHumaines(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialMédicoSocialRessourcesHumaines[]> {
    const ressourceHumainesModelDeLÉtablissementTerritorial = await this.chargeLesRessourcesHumainesModel(numéroFinessÉtablissementTerritorial);
    const dateDeMiseÀJourAnnErrdEjEt = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_ERRD_EJ_ET);
    const dateDeMiseÀJourAnnCaEjEt = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_CA_EJ_ET);
    const dateDeMiseÀJourAnnMsTdpEt = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_MS_TDP_ET);
    const cadreBudgétaire = await this.chargeLeCadreBudgétaireDeLÉtablissement(numéroFinessÉtablissementTerritorial);

    return this.construisLesRessourcesHumaines(
      ressourceHumainesModelDeLÉtablissementTerritorial,
      cadreBudgétaire,
      dateDeMiseÀJourAnnErrdEjEt,
      dateDeMiseÀJourAnnCaEjEt,
      dateDeMiseÀJourAnnMsTdpEt
    );
  }

  private async chargeLesActivitésModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm).getRepository(ActivitéMédicoSocialModel).find({
      order: { année: "ASC" },
      where: { numéroFinessÉtablissementTerritorial },
    });
  }

  private async chargeLIdentitéModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm).getRepository(ÉtablissementTerritorialIdentitéModel).findOne({
      relations: { cpom: true },
      where: {
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        numéroFinessÉtablissementTerritorial,
      },
    });
  }

  private async chargePrincipaDomaine(numéroFinessÉtablissementTerritorial: string): Promise<string> {
    const etablissementPrincipal = await (await this.orm).getRepository(ÉtablissementTerritorialIdentitéModel).findOneBy({
      numéroFinessÉtablissementTerritorial,
    });

    return etablissementPrincipal ? etablissementPrincipal.domaine : "";
  }

  private async chargeLesAutorisationsModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm).getRepository(AutorisationMédicoSocialModel).find({
      order: { disciplineDÉquipement: "ASC" },
      where: { numéroFinessÉtablissementTerritorial },
    });
  }

  private async chargeLesBudgetEtFinancesModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm).getRepository(BudgetEtFinancesMédicoSocialModel).find({
      order: { année: "ASC" },
      where: { numéroFinessÉtablissementTerritorial },
    });
  }

  private async chargeLesRessourcesHumainesModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm).getRepository(RessourcesHumainesMédicoSocialModel).find({
      order: { année: "ASC" },
      where: { numéroFinessÉtablissementTerritorial },
    });
  }

  async chargeLesDonneesVigieRH(numeroFinessET: string) {
    const pyramideAges = await (await this.orm).getRepository(VigieRhPyramideAgesModel).find({
      order: { annee: "ASC" },
      where: { numeroFinessET },
    });

    const tranchesAge = await (await this.orm).getRepository(VigieRhRefTrancheAgeModel).find({
      order: { trancheAge: "DESC" },
    });
    const professionFiliere = await this.getProfessionFiliere(numeroFinessET);

    const departsEmbauches = await (await this.orm).getRepository(VigieRhMouvementsModel).find({
      order: { annee: "ASC" },
      where: { numeroFinessET },
    });

    const departsEmbauchesTrimestriels = await (await this.orm).getRepository(VigieRhMouvementsTrimestrielsModel).find({
      order: { annee: "ASC", trimestre: "ASC" },
      where: { numeroFinessET },
    });

    const dureesCdd = await (await this.orm).query(`
      select * from (    
          SELECT *
          FROM vigierh_duree_cdd d
          WHERE (d.annee, d.trimestre) IN (
            SELECT d1.annee, MAX(d1.trimestre)
            FROM vigierh_duree_cdd d1
            WHERE d1.annee = (SELECT MAX(d2.annee) FROM vigierh_duree_cdd d2)
            GROUP BY d1.annee
            UNION ALL
            SELECT (MAX(d1.annee) - 1) AS annee,
                  MAX(d1.trimestre) AS trimestre
            FROM vigierh_duree_cdd d1
            WHERE d1.annee = (SELECT MAX(d2.annee) FROM vigierh_duree_cdd d2)
          )
          AND d.numero_finess_etablissement_territorial = '${numeroFinessET}'
          ORDER BY d.annee DESC, d.trimestre ASC, d.duree_code ASC) val
          JOIN vigierh_referentiel_duree_cdd ref ON val.duree_code = ref.duree_code;`
    )

    const dureeLibelles = await (await this.orm).getRepository(VigieRhRefDureeCddModel).find({
      order: { dureeCode: "ASC" },
    });

    const motifsRupture = await (await this.orm).query(`
      select * from (    
          SELECT *
          FROM vigierh_motifs_ruptures m
          WHERE (m.annee, m.trimestre) IN (
            SELECT m1.annee, MAX(m1.trimestre)
            FROM vigierh_motifs_ruptures m1
            WHERE m1.annee = (SELECT MAX(m2.annee) FROM vigierh_motifs_ruptures m2)
            GROUP BY m1.annee
            UNION ALL
            SELECT (MAX(m1.annee) - 1) AS annee,
                  MAX(m1.trimestre) AS trimestre
            FROM vigierh_motifs_ruptures m1
            WHERE m1.annee = (SELECT MAX(m2.annee) FROM vigierh_motifs_ruptures m2)
          )
          AND m.finess_et = '${numeroFinessET}'
          ORDER BY m.annee DESC, m.trimestre ASC, m.motif_code ASC) val
          JOIN vigierh_ref_motifs_ruptures ref ON val.motif_code = ref.code;`
    )

    const motifsLibelles = await (await this.orm).getRepository(VigieRhRefMotifRuptutreContratModel).find({
      order: { code: "ASC" },
    });

    const natureContratsAnnuel = await (await this.orm).getRepository(VigieRhNatureContratsAnnuelModel).find({ where: { numeroFiness: numeroFinessET } });
    const natureContratsTrimestriel = await (await this.orm).getRepository(VigieRhNatureContratsTrimestrielModel).find({ where: { numeroFiness: numeroFinessET } });
    const professionFiliereModel = professionFiliere as unknown as ProfessionFiliere;
    const echelleTemporelle = await construitEchelleTemporelleVigieRh(this.orm, numeroFinessET);
    return this.construisLesDonneesVigieRH({
      pyramideAgesModel: pyramideAges,
      tranchesAgeModel: tranchesAge,
      mouvementsModel: departsEmbauches,
      vigieRhMouvementsTrimestrielsModel: departsEmbauchesTrimestriels,
      dureesCddModel: dureesCdd,
      dureesCddRefModel: dureeLibelles,
      motifsRuptureModel: motifsRupture,
      motifsLibelleModel: motifsLibelles,
      professionFiliereModel: professionFiliereModel,
      natureContratsAnnuel,
      natureContratsTrimestriel,
      echelleTemporelle
    });
  }

  private async construisLesDonneesVigieRH(models : ModelsBlocVigieRh): Promise<EtablissementTerritorialMedicoSocialVigieRH> {

    const pyramideAges = models.pyramideAgesModel.map((pyramideModel: VigieRhPyramideAgesModel) => {
      return {
        annee: pyramideModel.annee,
        trancheLibelle: pyramideModel.trancheAgeRef.trancheAge ?? '',
        effectifHomme: pyramideModel.effectifHomme,
        effectifFemme: pyramideModel.effectifFemme,
        effectifHommeRef: pyramideModel.effectifHommeRef,
        effectifFemmeRef: pyramideModel.effectifFemmeRef,
      }
    })

    const tranchesAgesLibelles = models.tranchesAgeModel.map((trancheModel: VigieRhRefTrancheAgeModel) => {
      return trancheModel.trancheAge ?? '';
    })

    const professionFiliere = await this.construisProfessionFiliere(models.professionFiliereModel);

    const departsEmbauches = models.mouvementsModel.map((departEmbaucheModel: VigieRhMouvementsModel) => {
      return {
        annee: departEmbaucheModel.annee,
        depart: departEmbaucheModel.depart,
        departRef: departEmbaucheModel.departRef,
        embauche: departEmbaucheModel.embauche,
        embaucheRef: departEmbaucheModel.embaucheRef,
        departsPrematuresCdi: departEmbaucheModel.departsPrematuresCdi ?? null,
      }
    })

    const departsEmbauchesTrimestriels = models.vigieRhMouvementsTrimestrielsModel.map((departEmbaucheModel: VigieRhMouvementsTrimestrielsModel) => {
      return {
        annee: departEmbaucheModel.annee,
        trimestre: departEmbaucheModel.trimestre,
        depart: departEmbaucheModel.depart,
        departRef: departEmbaucheModel.departRef,
        embauche: departEmbaucheModel.embauche,
        embaucheRef: departEmbaucheModel.embaucheRef
      }
    });

    const tauxRotation = models.mouvementsModel.map((departEmbaucheModel: VigieRhMouvementsModel) => {
      return {
        annee: departEmbaucheModel.annee,
        rotation: departEmbaucheModel.rotation,
        rotationRef: departEmbaucheModel.rotationRef,
      }
    })

    const tauxRotationTrimestriel = models.vigieRhMouvementsTrimestrielsModel.map((mouvementTrimestrielsModel: VigieRhMouvementsTrimestrielsModel) => {
      return {
        annee: mouvementTrimestrielsModel.annee,
        trimestre: mouvementTrimestrielsModel.trimestre,
        rotation: mouvementTrimestrielsModel.rotation,
        rotationRef: mouvementTrimestrielsModel.rotationRef,
      }
    })

    const dureesCdd = models.dureesCddModel.map((dureeCddModel: ResultatQueryDureeCdd) => {
      return {
        annee: dureeCddModel.annee,
        trimestre: dureeCddModel.trimestre,
        dureeLibelle: dureeCddModel.duree,
        dureeCode: dureeCddModel.duree_code,
        effectif: dureeCddModel.effectif,
        effectifRef: dureeCddModel.effectif_ref,
      }
    })

    const motifsRuptureContrat = models.motifsRuptureModel.map((motifRuptureModel: ResultatQueryMotifRupture) => {
      return {
        annee: motifRuptureModel.annee,
        trimestre: motifRuptureModel.trimestre,
        motifLibelle: motifRuptureModel.motif,
        motifCode: motifRuptureModel.code,
        effectif: motifRuptureModel.effectif,
        effectifRef: motifRuptureModel.effectif_ref,
      }
    })

    const dureesCddLibelles = models.dureesCddRefModel.map((dureeLibelleModel: VigieRhRefDureeCddModel) => {
      return dureeLibelleModel.duree ?? '';
    })

    const motifsRuptureContratLibelles = models.motifsLibelleModel.map((motifLibelleModel: VigieRhRefMotifRuptutreContratModel) => {
      return motifLibelleModel.motif ?? '';
    })

    const natureContratsAnnuel = models.natureContratsAnnuel.map((natureContratModel: VigieRhNatureContratsAnnuelModel) => {
      return {
        annee: natureContratModel.annee,
        effectif: natureContratModel.effectif,
        effectifRef: natureContratModel.effectifRef,
        natureLibelle: natureContratModel.nature.libelle,
        natureCode: natureContratModel.nature.code,
      };
    });

    const natureContratsTrimestriel = models.natureContratsTrimestriel.map((natureContratModel: VigieRhNatureContratsTrimestrielModel) => {
      return {
        annee: natureContratModel.annee,
        trimestre: natureContratModel.trimestre,
        effectif: natureContratModel.effectif,
        effectifRef: natureContratModel.effectifRef,
        natureLibelle: natureContratModel.nature.libelle,
        natureCode: natureContratModel.nature.code,
      }
    });


    return {
      pyramideAges,
      tranchesAgesLibelles,
      departsEmbauches,
      departsEmbauchesTrimestriels,
      professionFiliere,
      tauxRotation,
      tauxRotationTrimestriel,
      dureesCdd,
      dureesCddLibelles,
      motifsRuptureContrat,
      motifsRuptureContratLibelles,
      natureContratsAnnuel,
      natureContratsTrimestriel,
      echelleTemporelle: models.echelleTemporelle
    }
  }

  private async construisProfessionFiliere(professionFiliereModel: ProfessionFiliere): Promise<{ data: ProfessionFiliereData[]; dateDeMiseAJour: string }> {
    const dateDeMiseÀJourGroupesModel = await this.chargeLaDateDeMiseÀJourModel(FichierSource.VIGIE_RH_PROFESSION_GROUPE);
    const dateDeMiseÀJourGroupes = dateDeMiseÀJourGroupesModel?.dernièreMiseÀJour ?? "";

    const professionFiliereFiltree: ProfessionFiliereData[] = professionFiliereModel.data
      .filter((item: ProfessionFiliereData | null) => item !== null) // Filtre les éléments null
      .map((item: ProfessionFiliereData) => ({
        categorie: item.categorie,
        dataCategorie: item.dataCategorie ? item.dataCategorie.map(profession => ({
          annee: profession.annee,
          mois: profession.mois,
          effectifFiliere: profession.effectifFiliere,
        })) : [],
        ...(this.extractProfessionsGroupes(item, dateDeMiseÀJourGroupes)),
      }));

    const dateDeMiseÀJourprofessionFiliereModel = await this.chargeLaDateDeMiseÀJourModel(FichierSource.VIGIE_RH_PROFESSION_FILIERE);

    return {
      data: professionFiliereFiltree,
      dateDeMiseAJour: dateDeMiseÀJourprofessionFiliereModel.dernièreMiseÀJour
    };
  }

  private extractProfessionsGroupes(item: ProfessionFiliereData, dateDeMiseÀJour: string): Partial<ProfessionFiliereData> {
    const groupesSource = (item as any)?.groupes;
    const dataGroupes: ProfessionGroupeData[] = (groupesSource?.data ?? [])
      .filter((g: ProfessionGroupeData | null) => g !== null)
      .map((g: any) => ({
        categorie: g.categorie,
        dataCategorie: (g.dataCategorie ?? []).map((profession: any) => ({
          annee: Number(profession.annee),
          mois: Number(profession.mois),
          effectif: Number(profession.effectif ?? profession.effectifFiliere ?? 0),
        })),
      }));

    if (!dataGroupes.length) {
      return {};
    }

    return {
      groupes: {
        data: dataGroupes,
        dateDeMiseAJour: dateDeMiseÀJour,
      },
    };
  }

  async getProfessionFiliere(numeroFinessET: string) {
    const refProfessionFiliere = await (await this.orm).getRepository(VigieRhRefProfessionFiliereModel).find({
      order: { code: "ASC" }
    });

    const dateDeMiseAJourProfessionFiliere = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_MS_TDP_ET);

    const data = await Promise.all(refProfessionFiliere.map(async (itemRef: VigieRhRefProfessionFiliereModel) => {

      const professionFiliere = await (await this.orm).getRepository(VigieRhProfessionFiliereModel).find({
        order: { annee: "ASC", mois: "ASC" },
        where: { numeroFiness: numeroFinessET, profession: { code: itemRef.code } },
      });

      const groupes = await this.getProfessionsGroupe(numeroFinessET, itemRef.code);

      if (professionFiliere.length === 0 && (groupes?.data?.length ?? 0) === 0) {
        return null;
      }

      return {
        categorie: itemRef.label,
        dataCategorie: professionFiliere,
        groupes,
      };
    }))

    return { data: data, dateDeMiseAJour: dateDeMiseAJourProfessionFiliere }
  }

  async getProfessionsGroupe(numeroFinessET: string, codeFiliere: number): Promise<{ data: ProfessionGroupeData[]; dateDeMiseAJour: string }> {
    const refProfessionGroupe = await (await this.orm).getRepository(VigieRhRefProfessionGroupeModel).find({
      order: { code: "ASC" },
      where: { filiere:{code: codeFiliere} }
    });

    const dateDeMiseAJourProfessionGroupe = await this.chargeLaDateDeMiseÀJourModel(FichierSource.VIGIE_RH_PROFESSION_GROUPE);

    const data = (await Promise.all(refProfessionGroupe.map(async (itemRef: VigieRhRefProfessionGroupeModel) => {

      const professionGroup = await (await this.orm).getRepository(VigieRhProfessionGroupeModel).find({
        order: { annee: "ASC", mois: "ASC" },
        where: { numeroFiness: numeroFinessET, profession: { code: itemRef.code } },
      });

      if (professionGroup.length === 0) {
        return null;
      }

      return {
        categorie: itemRef.label,
        dataCategorie: professionGroup,
      };
    }))).filter((item) => item !== null);

    return {
      data :  data as ProfessionGroupeData[],
      dateDeMiseAJour: dateDeMiseAJourProfessionGroupe?.dernièreMiseÀJour ?? "",
    };
  }

  private async chargeLaDateDeMiseÀJourModel(source: FichierSource): Promise<DateMiseÀJourFichierSourceModel> {
    return (await (await this.orm).getRepository(DateMiseÀJourFichierSourceModel).findOneBy({ fichier: source })) as DateMiseÀJourFichierSourceModel;
  }

  private async chargeLeCadreBudgétaireDeLÉtablissement(numéroFinessÉtablissementTerritorial: string): Promise<CadreBudgétaire> {
    const budgetEtFinancesModel = await (await this.orm)
      .getRepository(BudgetEtFinancesMédicoSocialModel)
      .find({ order: { année: "DESC" }, select: { cadreBudgétaire: true }, where: { numéroFinessÉtablissementTerritorial } });

    return budgetEtFinancesModel.length > 0 ? budgetEtFinancesModel[0].cadreBudgétaire : CadreBudgétaire.ERRD;
  }

  async chargeQualite(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialQualite> {
    const reclamations = await (await this.orm)
      .getRepository(ReclamationETModel)
      .find({ where: { numéroFinessÉtablissementTerritorial } });

    const dateMisAJour = (await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.SIREC })) as DateMiseÀJourFichierSourceModel;

    const evenementsIndesirables = await (await this.orm)
      .getRepository(EvenementIndesirableETModel)
      .find({ where: { numéroFinessÉtablissementTerritorial } });

    const dateMiseAjourSIVSS = (await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.SIVSS })) as DateMiseÀJourFichierSourceModel;

    const inspectionsEtControles = await (await this.orm)
      .getRepository(InspectionsControlesETModel)
      .find({ where: { numéroFinessÉtablissementTerritorial } });

    const dateMiseAjourSIICEA = (await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.SIICEA })) as DateMiseÀJourFichierSourceModel;

    return this.construitsQualite(
      reclamations,
      dateMisAJour.dernièreMiseÀJour,
      evenementsIndesirables,
      dateMiseAjourSIVSS.dernièreMiseÀJour,
      inspectionsEtControles,
      dateMiseAjourSIICEA.dernièreMiseÀJour
    );
  }

  private construisIdentité(
    établissementTerritorialIdentitéModel: ÉtablissementTerritorialIdentitéModel,
    dateDeMiseÀJourIdentitéModel: DateMiseÀJourFichierSourceModel,
    dateDeMiseÀJourAnnMsTdpEtModel: DateMiseÀJourFichierSourceModel,
    domaineÉtablissementPrincipal: string
  ): ÉtablissementTerritorialIdentité {
    return {
      adresseAcheminement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseAcheminement,
      },
      adresseNuméroVoie: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseNuméroVoie,
      },
      adresseTypeVoie: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseTypeVoie,
      },
      adresseVoie: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseVoie,
      },
      catégorieÉtablissement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.catégorieÉtablissement,
      },
      codeModeTarification: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.codeModeTarification,
      },
      courriel: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.courriel,
      },
      dateDEntréeEnVigueurDuCpom: {
        dateMiseÀJourSource: dateDeMiseÀJourAnnMsTdpEtModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.cpom ? établissementTerritorialIdentitéModel.cpom.dateDEntréeEnVigueur : "",
      },
      libelléCatégorieÉtablissement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.libelléCatégorieÉtablissement,
      },
      libelléModeTarification: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.libelléModeTarification,
      },
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementPrincipal: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.numéroFinessÉtablissementPrincipal,
      },
      domaineÉtablissementPrincipal: domaineÉtablissementPrincipal,
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.numéroFinessÉtablissementTerritorial,
      },
      raisonSociale: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.raisonSociale,
      },
      raisonSocialeCourte: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.raisonSocialeCourte,
      },
      siret: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.siret,
      },
      typeÉtablissement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.typeÉtablissement,
      },
      téléphone: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.téléphone,
      },
      dateOuverture: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.dateOuverture,
      },
      codeRegion: établissementTerritorialIdentitéModel.codeRégion,
    };
  }

  private construisActivité(
    établissementTerritorialActivitésModel: ActivitéMédicoSocialModel[],
    dateDeMiseAJourAnnMsTdpEtModel: DateMiseÀJourFichierSourceModel,
    dateDeMiseAJourAnnErrdEjEtModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialMédicoSocialActivité[] {
    return établissementTerritorialActivitésModel.map<ÉtablissementTerritorialMédicoSocialActivité>((établissementTerritorialModel) => ({
      année: établissementTerritorialModel.année,
      duréeMoyenneSéjourAccompagnementPersonnesSorties: {
        dateMiseÀJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.duréeMoyenneSéjourAccompagnementPersonnesSorties,
      },
      fileActivePersonnesAccompagnées: {
        dateMiseÀJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.fileActivePersonnesAccompagnées,
      },
      nombreMoyenJournéesAbsencePersonnesAccompagnées: {
        dateMiseÀJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreMoyenJournéesAbsencePersonnesAccompagnées,
      },
      numéroFinessÉtablissementTerritorial: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
      tauxOccupationAccueilDeJour: {
        dateMiseÀJourSource: dateDeMiseAJourAnnErrdEjEtModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.tauxOccupationAccueilDeJour,
      },
      tauxOccupationHébergementPermanent: {
        dateMiseÀJourSource: dateDeMiseAJourAnnErrdEjEtModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.tauxOccupationHébergementPermanent,
      },
      tauxOccupationHébergementTemporaire: {
        dateMiseÀJourSource: dateDeMiseAJourAnnErrdEjEtModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.tauxOccupationHébergementTemporaire,
      },
      tauxRéalisationActivité: {
        dateMiseÀJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.tauxRéalisationActivité,
      },
      tauxOccupationExternat: {
        value: établissementTerritorialModel.tauxOccupationExternat,
      },
      tauxOccupationSemiInternat: {
        value: établissementTerritorialModel.tauxOccupationSemiInternat,
      },
      tauxOccupationInternat: {
        value: établissementTerritorialModel.tauxOccupationInternat,
      },
      tauxOccupationAutre: {
        value: établissementTerritorialModel.tauxOccupationAutre,
      },
      tauxOccupationSeances: {
        value: établissementTerritorialModel.tauxOccupationSeances,
      },
    }));
  }

  private construisLesAutorisations(
    autorisationsModel: AutorisationMédicoSocialModel[],
    dateMiseÀJourSource: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité["autorisations"] {
    const disciplinesDeLÉtablissement: AutorisationMédicoSocialDiscipline[] = [];

    autorisationsModel.forEach((autorisationModel: AutorisationMédicoSocialModel) => {
      const codeDiscipline = autorisationModel.disciplineDÉquipement;
      const codeActivité = autorisationModel.activité;
      const codeClientèle = autorisationModel.clientèle;

      const disciplineCréée = disciplinesDeLÉtablissement.find((discipline) => discipline.code === codeDiscipline);

      if (!disciplineCréée) {
        disciplinesDeLÉtablissement.push(this.construisLaDisciplineDUneAutorisation(autorisationModel));
      } else {
        const activitéCréée = disciplineCréée.activités.find((activité) => activité.code === codeActivité);

        if (!activitéCréée) {
          disciplineCréée.activités.push(this.construisLActivitéDUneAutorisation(autorisationModel));
        } else {
          const clientèleCréée = activitéCréée.clientèles.find((clientèle) => clientèle.code === codeClientèle);

          if (!clientèleCréée) {
            activitéCréée.clientèles.push(this.construisLaClientèleDUneAutorisation(autorisationModel));
          }
        }
      }
    });

    return {
      dateMiseÀJourSource: dateMiseÀJourSource.dernièreMiseÀJour,
      disciplines: disciplinesDeLÉtablissement,
    };
  }

  private construisLesCapacités(
    autorisationsModel: AutorisationMédicoSocialModel[],
    dateMiseÀJourSource: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité["capacités"] {
    const capacitéParActivité = autorisationsModel
      .reduce((activités: { capacité: number; libellé: string }[], autorisation: AutorisationMédicoSocialModel) => {
        if (!autorisation.capacitéInstalléeTotale) return activités;
        if (autorisation.estInstallée) {
          const activité = activités.find((capacitéParActivité) => capacitéParActivité.libellé === autorisation.libelléActivité);

          if (!activité) {
            activités.push({
              capacité: autorisation.capacitéInstalléeTotale,
              libellé: autorisation.libelléActivité,
            });
          } else {
            activité.capacité += autorisation.capacitéInstalléeTotale;
          }
        }
        return activités;
      }, [])
      .sort((a, b) => a.libellé.localeCompare(b.libellé));

    return {
      capacitéParActivité,
      dateMiseÀJourSource: dateMiseÀJourSource.dernièreMiseÀJour,
    };
  }

  private construisLaDisciplineDUneAutorisation(autorisationModel: AutorisationMédicoSocialModel): AutorisationMédicoSocialDiscipline {
    return {
      activités: [this.construisLActivitéDUneAutorisation(autorisationModel)],
      code: autorisationModel.disciplineDÉquipement,
      libellé: autorisationModel.libelléDisciplineDÉquipement,
    };
  }

  private construisLActivitéDUneAutorisation(autorisationModel: AutorisationMédicoSocialModel): AutorisationMédicoSocialActivité {
    return {
      clientèles: [this.construisLaClientèleDUneAutorisation(autorisationModel)],
      code: autorisationModel.activité,
      libellé: autorisationModel.libelléActivité,
    };
  }

  private construisLaClientèleDUneAutorisation(autorisationModel: AutorisationMédicoSocialModel): AutorisationMédicoSocialClientèle {
    return {
      code: autorisationModel.clientèle,
      datesEtCapacités: this.construisLesDatesEtCapacitésDUneAutorisation(autorisationModel),
      libellé: autorisationModel.libelléClientèle,
    };
  }

  private construisLesDatesEtCapacitésDUneAutorisation(autorisationModel: AutorisationMédicoSocialModel): AutorisationMédicoSocialDatesEtCapacités {
    return {
      capacitéAutoriséeTotale: autorisationModel.capacitéAutoriséeTotale,
      capacitéInstalléeTotale: autorisationModel.capacitéInstalléeTotale,
      dateDAutorisation: autorisationModel.dateDAutorisation,
      dateDeDernièreInstallation: autorisationModel.dateDeDernièreInstallation,
      dateDeMiseÀJourDAutorisation: autorisationModel.dateDeMiseÀJourDAutorisation,
      estInstallée: autorisationModel.estInstallée,
    };
  }

  private construitsQualite(reclamations: ReclamationETModel[], dateMisAJour: string, evenementsIndesirables: EvenementIndesirableETModel[], dateMiseAjourSIVSS: string, inspections: InspectionsControlesETModel[], dateMiseAjourSiicea: string): ÉtablissementTerritorialQualite {
    return {
      reclamations: this.construitsReclamations(reclamations, dateMisAJour),
      evenementsIndesirables: this.construitsEvenementsIndesirables(evenementsIndesirables, dateMiseAjourSIVSS),
      inspectionsEtControles: this.construisInspections(inspections, dateMiseAjourSiicea)
    }
  }

  private construitsReclamations(
    reclamations: ReclamationETModel[],
    dateMisAJour: string
  ): Reclamations[] {
    return reclamations.map((reclamation) => {
      return {
        numéroFinessÉtablissementTerritorial: reclamation.numéroFinessÉtablissementTerritorial,
        année: reclamation.annee,
        totalClotures: reclamation.clotTotal,
        totalEncours: reclamation.encoursTotal,
        dateMiseÀJourSource: dateMisAJour,
        details: [{
          motif: "MOTIF_10",
          clot: reclamation.clotMotif10,
          encours: reclamation.encoursMotif10,
        },
        {
          motif: "MOTIF_11",
          clot: reclamation.clotMotif11,
          encours: reclamation.encoursMotif11,
        },
        {
          motif: "MOTIF_12",
          clot: reclamation.clotMotif12,
          encours: reclamation.encoursMotif12,
        },
        {
          motif: "MOTIF_13",
          clot: reclamation.clotMotif13,
          encours: reclamation.encoursMotif13,
        },
        {
          motif: "MOTIF_14",
          clot: reclamation.clotMotif14,
          encours: reclamation.encoursMotif14,
        },
        {
          motif: "MOTIF_15",
          clot: reclamation.clotMotif15,
          encours: reclamation.encoursMotif15,
        },
        {
          motif: "MOTIF_16",
          clot: reclamation.clotMotif16,
          encours: reclamation.encoursMotif16,
        },
        {
          motif: "MOTIF_17",
          clot: reclamation.clotMotif17,
          encours: reclamation.encoursMotif17,
        },
        {
          motif: "MOTIF_18",
          clot: reclamation.clotMotif18,
          encours: reclamation.encoursMotif18,
        },
        {
          motif: "MOTIF_19",
          clot: reclamation.clotMotif19,
          encours: reclamation.encoursMotif19,
        },
        {
          motif: "MOTIF_155",
          clot: reclamation.clotMotif155,
          encours: reclamation.encoursMotif155,
        },
        {
          motif: "MOTIF_156",
          clot: reclamation.clotMotif156,
          encours: reclamation.encoursMotif156,
        },],
      }
    })
  }

  private construitsEvenementsIndesirables(
    evenementsIndesirables: EvenementIndesirableETModel[],
    dateMisAJour: string,
  ): EvenementsIndesirables[] {

    const evenementsIndesirableAssocieAuxSoins: EvenementsIndesirables = {
      dateMiseAJourSource: dateMisAJour,
      libelle: 'Evènements indésirables/graves associés aux soins',
      evenementsEncours: [],
      evenementsClotures: []
    };
    const evenementsIndesirableParET: EvenementsIndesirables = {
      dateMiseAJourSource: dateMisAJour,
      libelle: 'Evénements/incidents dans un établissement ou organisme',
      evenementsEncours: [],
      evenementsClotures: []
    };
    evenementsIndesirables.forEach(evenement => {
      if (evenement.famillePrincipale === evenementsIndesirableParET.libelle) {
        if (evenement.etat === 'EN_COURS') evenementsIndesirableParET.evenementsEncours.push(this.constuisLevenementIndesirable(evenement));
        else evenementsIndesirableParET.evenementsClotures.push(this.constuisLevenementIndesirable(evenement));
      } else if (evenement.etat === 'EN_COURS') evenementsIndesirableAssocieAuxSoins.evenementsEncours.push(this.constuisLevenementIndesirable(evenement));
      else evenementsIndesirableAssocieAuxSoins.evenementsClotures.push(this.constuisLevenementIndesirable(evenement));
    });
    return [evenementsIndesirableAssocieAuxSoins, evenementsIndesirableParET]
  }

  private constuisLevenementIndesirable(evenement: EvenementIndesirableETModel) {
    return {
      famille: evenement.famillePrincipale,
      nature: evenement.naturePrincipale,
      numeroSIVSS: evenement.numeroSIVSS,
      annee: evenement.annee,
      etat: evenement.etat,
      clotDate: evenement.dateCloture,
      clotMotif: evenement.motifCloture,
      est_EIGS: evenement.isEIGS
    }
  }

  private construisInspections(inspections: InspectionsControlesETModel[], dateMisAJour: string) {
    const inspectionsEtControles = inspections.map((inspection: InspectionsControlesETModel) => {
      return {
        typeMission: inspection.typeMission,
        themeRegional: inspection.themeRegional,
        typePlannification: inspection.typePlannification,
        statutMission: inspection.statutMission,
        modaliteMission: inspection.modaliteMission,
        dateVisite: inspection.dateVisite,
        dateRapport: inspection.dateRapport,
        nombreEcart: inspection.nombreEcart,
        nombreRemarque: inspection.nombreRemarque,
        injonction: inspection.injonction,
        prescription: inspection.prescription,
        recommandation: inspection.recommandation,
        saisineCng: inspection.saisineCng,
        saisineJuridiction: inspection.saisineJuridiction,
        saisineParquet: inspection.saisineParquet,
        saisineAutre: inspection.saisineAutre
      }
    })
    return { dateMiseAJourSource: dateMisAJour, inspectionsEtControles: inspectionsEtControles };
  }

  private construisLeBudgetEtFinances(
    budgetEtFinancesModel: BudgetEtFinancesMédicoSocialModel[],
    dateDeMiseÀJourAnnErrdEjEt: DateMiseÀJourFichierSourceModel,
    dateDeMiseÀJourAnnErrdEj: DateMiseÀJourFichierSourceModel,
    dateDeMiseÀJourAnnCaEjEt: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialMédicoSocialBudgetEtFinances[] {
    return budgetEtFinancesModel.map((budgetEtFinancesModel) => {
      return {
        année: budgetEtFinancesModel.année,
        cadreBudgétaire: budgetEtFinancesModel.cadreBudgétaire,
        chargesEtProduits: {
          charges: budgetEtFinancesModel.charges,
          dateMiseÀJourSource: dateDeMiseÀJourAnnCaEjEt.dernièreMiseÀJour,
          produits: budgetEtFinancesModel.produits,
        },
        contributionAuxFraisDeSiège: {
          dateMiseÀJourSource: dateDeMiseÀJourAnnErrdEjEt.dernièreMiseÀJour,
          valeur: budgetEtFinancesModel.contributionFraisDeSiègeGroupement,
        },
        fondsDeRoulement: {
          dateMiseÀJourSource: dateDeMiseÀJourAnnErrdEj.dernièreMiseÀJour,
          valeur: budgetEtFinancesModel.fondsDeRoulement,
        },
        recettesEtDépenses: {
          dateMiseÀJourSource:
            budgetEtFinancesModel.cadreBudgétaire === CadreBudgétaire.ERRD
              ? dateDeMiseÀJourAnnErrdEjEt.dernièreMiseÀJour
              : dateDeMiseÀJourAnnCaEjEt.dernièreMiseÀJour,
          dépensesGroupe1: budgetEtFinancesModel.dépensesGroupe1,
          dépensesGroupe2: budgetEtFinancesModel.dépensesGroupe2,
          dépensesGroupe3: budgetEtFinancesModel.dépensesGroupe3,
          recettesGroupe1: budgetEtFinancesModel.recettesGroupe1,
          recettesGroupe2: budgetEtFinancesModel.recettesGroupe2,
          recettesGroupe3: budgetEtFinancesModel.recettesGroupe3,
        },
        résultatNetComptable: {
          dateMiseÀJourSource:
            budgetEtFinancesModel.cadreBudgétaire === CadreBudgétaire.ERRD
              ? dateDeMiseÀJourAnnErrdEjEt.dernièreMiseÀJour
              : dateDeMiseÀJourAnnCaEjEt.dernièreMiseÀJour,
          valeur: budgetEtFinancesModel.résultatNetComptable,
        },
        tauxDeCafNette: {
          dateMiseÀJourSource:
            budgetEtFinancesModel.cadreBudgétaire === CadreBudgétaire.ERRD
              ? dateDeMiseÀJourAnnErrdEj.dernièreMiseÀJour
              : dateDeMiseÀJourAnnCaEjEt.dernièreMiseÀJour,
          valeur: budgetEtFinancesModel.tauxDeCaf,
        },
        tauxDeVétustéConstruction: {
          dateMiseÀJourSource:
            budgetEtFinancesModel.cadreBudgétaire === CadreBudgétaire.ERRD
              ? dateDeMiseÀJourAnnErrdEj.dernièreMiseÀJour
              : dateDeMiseÀJourAnnCaEjEt.dernièreMiseÀJour,
          valeur: budgetEtFinancesModel.tauxDeVétustéConstruction,
        },
      };
    });
  }

  private construisLesRessourcesHumaines(
    ressourcesHumainesModel: RessourcesHumainesMédicoSocialModel[],
    cadreBudgétaire: CadreBudgétaire,
    dateDeMiseÀJourAnnErrdEjEt: DateMiseÀJourFichierSourceModel,
    dateDeMiseÀJourAnnCaEjEt: DateMiseÀJourFichierSourceModel,
    dateDeMiseÀJourAnnMsTdpEt: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialMédicoSocialRessourcesHumaines[] {
    const dateDuFichierAnnMsTdpEt = dateDeMiseÀJourAnnMsTdpEt.dernièreMiseÀJour;
    const dateDeMiseÀJourDuNombreDEtpRéalisés =
      cadreBudgétaire === CadreBudgétaire.ERRD ? dateDeMiseÀJourAnnErrdEjEt.dernièreMiseÀJour : dateDeMiseÀJourAnnCaEjEt.dernièreMiseÀJour;
    return ressourcesHumainesModel.map((ressourceHumaineModel) => {
      return {
        année: ressourceHumaineModel.année,
        nombreDEtpRéalisés: {
          dateMiseÀJourSource: dateDeMiseÀJourDuNombreDEtpRéalisés,
          valeur: ressourceHumaineModel.nombreDEtpRéalisés,
        },
        nombreDeCddDeRemplacement: {
          dateMiseÀJourSource: dateDuFichierAnnMsTdpEt,
          valeur: ressourceHumaineModel.nombreDeCddDeRemplacement,
        },
        tauxDAbsentéisme: {
          dateMiseÀJourSource: dateDuFichierAnnMsTdpEt,
          horsFormation: ressourceHumaineModel.tauxDAbsentéismeHorsFormation,
          pourAccidentMaladieProfessionnelle: ressourceHumaineModel.tauxDAbsentéismePourAccidentEtMaladieProfessionelle,
          pourCongésSpéciaux: ressourceHumaineModel.tauxDAbsentéismePourCongésSpéciaux,
          pourMaladieCourteDurée: ressourceHumaineModel.tauxDAbsentéismePourMaladieCourteDurée,
          pourMaladieLongueDurée: ressourceHumaineModel.tauxDAbsentéismePourMaladieLongueDurée,
          pourMaladieMoyenneDurée: ressourceHumaineModel.tauxDAbsentéismePourMaladieMoyenneDurée,
          pourMaternitéPaternité: ressourceHumaineModel.tauxDAbsentéismePourMaternitéPaternité,
        },
        tauxDEtpVacants: {
          dateMiseÀJourSource: dateDuFichierAnnMsTdpEt,
          valeur: ressourceHumaineModel.tauxDEtpVacants,
        },
        tauxDePrestationsExternes: {
          dateMiseÀJourSource: dateDuFichierAnnMsTdpEt,
          valeur: ressourceHumaineModel.tauxDePrestationsExternes,
        },
        tauxDeRotationDuPersonnel: {
          dateMiseÀJourSource: dateDuFichierAnnMsTdpEt,
          valeur: ressourceHumaineModel.tauxDeRotationDuPersonnel,
        },
      };
    });
  }
}
