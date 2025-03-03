import { DataSource } from "typeorm";

import { ActivitéMédicoSocialModel } from "../../../../../database/models/ActivitéMédicoSocialModel";
import { AutorisationMédicoSocialModel } from "../../../../../database/models/AutorisationMédicoSocialModel";
import { BudgetEtFinancesMédicoSocialModel } from "../../../../../database/models/BudgetEtFinancesMédicoSocialModel";
import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { EvenementIndesirableETModel } from "../../../../../database/models/EvenementIndesirableModel";
import { InspectionsControlesETModel } from "../../../../../database/models/InspectionsModel";
import { ReclamationETModel } from "../../../../../database/models/ReclamationETModel";
import { RessourcesHumainesMédicoSocialModel } from "../../../../../database/models/RessourcesHumainesMédicoSocialModel";
import { VigieRhRefProfessionFiliereModel } from "../../../../../database/models/vigie_rh/referentiel/VigieRhRefProfessionFiliereModel";
import { VigieRhRefTrancheAgeModel } from "../../../../../database/models/vigie_rh/referentiel/VigieRhRefTrancheAgeModel";
import { VigieRhProfessionFiliereModel } from "../../../../../database/models/vigie_rh/VigieRhProfessionFiliereModel";
import { VigieRhPyramideAgesModel } from "../../../../../database/models/vigie_rh/VigieRHPyramideAgeModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { DomaineÉtablissementTerritorial } from "../../../métier/entities/DomaineÉtablissementTerritorial";
import { CadreBudgétaire } from "../../../métier/entities/établissement-territorial-médico-social/CadreBudgétaire";
import { EtablissementTerritorialMedicoSocialVigieRH, ProfessionFiliere } from "../../../métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
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
    const professionFiliere = await this.getProfessionFiliere(numeroFinessET)
    return this.construisLesDonneesVigieRH(pyramideAges, tranchesAge, professionFiliere)
  }

  private construisLesDonneesVigieRH(pyramideAgesModel: VigieRhPyramideAgesModel[], tranchesAgeModel: VigieRhRefTrancheAgeModel[], professionFiliereModel: any): EtablissementTerritorialMedicoSocialVigieRH {

    const pyramideAges = pyramideAgesModel.map((pyramideModel: VigieRhPyramideAgesModel) => {
      return {
        annee: pyramideModel.annee,
        trancheLibelle: pyramideModel.trancheAgeRef.trancheAge ?? '',
        effectif: pyramideModel.effectif,
        effectifHomme: pyramideModel.effectifHomme,
        effectifFemme: pyramideModel.effectifFemme,
        effectifHommeRef: pyramideModel.effectifHommeRef,
        effectifFemmeRef: pyramideModel.effectifFemmeRef,
      }
    })

    const professionFiliere: ProfessionFiliere[] = professionFiliereModel
    .filter((item: ProfessionFiliere | null) => item !== null) // Filtre les éléments null
    .map((item: ProfessionFiliere) => ({
      categorie: item.categorie,
      data: item.data ? item.data.map(profession => ({
        annee: profession.annee,
        mois: profession.mois,
        effectifFiliere: profession.effectifFiliere,
        effectifEtab: profession.effectifEtab,
      })) : []
    }));

    const tranchesAgesLibelles = tranchesAgeModel.map((trancheModel: VigieRhRefTrancheAgeModel) => {
      return trancheModel.trancheAge ?? '';
    })

    return {
      pyramideAges,
      tranchesAgesLibelles,
      professionFiliere
    }
  }

  async getProfessionFiliere(numeroFinessET: string) {
    const refProfessionFiliere = await (await this.orm).getRepository(VigieRhRefProfessionFiliereModel).find({
      order: { code: "ASC" }
    });

    const data = await Promise.all(refProfessionFiliere.map(async (itemRef: VigieRhRefProfessionFiliereModel) => {

      const professionFiliere = await (await this.orm).getRepository(VigieRhProfessionFiliereModel).find({
        order: { annee: "ASC", mois: "ASC" },
        where: { numeroFiness: numeroFinessET, professionCode: itemRef.code },
        take: 36, // Limite à 36 mois
      });

      // Vérifier si professionFiliere est vide
      if (professionFiliere.length === 0) {
        return null;
      }

      return {
        categorie: itemRef.label,
        data: professionFiliere
      }
    }))

    return data
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
