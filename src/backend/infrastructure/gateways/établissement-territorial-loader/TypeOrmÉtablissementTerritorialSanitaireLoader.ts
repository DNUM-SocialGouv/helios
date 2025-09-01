import { DataSource } from "typeorm";

import { ActiviteSanitaireMensuelModel } from "../../../../../database/models/ActiviteSanitaireMensuelModel";
import { ActivitéSanitaireModel } from "../../../../../database/models/ActivitéSanitaireModel";
import { AllocationRessourceETModel } from "../../../../../database/models/AllocationRessourceETModel";
import { AutorisationSanitaireModel } from "../../../../../database/models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "../../../../../database/models/AutreActivitéSanitaireModel";
import { BudgetEtFinancesSanitaireModel } from "../../../../../database/models/BudgetEtFinancesSanitaireModel";
import { CapacitéAutorisationSanitaireModel } from "../../../../../database/models/CapacitéAutorisationSanitaireModel";
import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { EvenementIndesirableETModel } from "../../../../../database/models/EvenementIndesirableModel";
import { InspectionsControlesETModel } from "../../../../../database/models/InspectionsModel";
import { ReclamationETModel } from "../../../../../database/models/ReclamationETModel";
import { ReconnaissanceContractuelleSanitaireModel } from "../../../../../database/models/ReconnaissanceContractuelleSanitaireModel";
import { ÉquipementMatérielLourdSanitaireModel } from "../../../../../database/models/ÉquipementMatérielLourdSanitaireModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { ActivitesSanitaireMensuel } from "../../../métier/entities/ActivitesSanitaireMensuel";
import { AllocationRessource, AllocationRessourceData } from "../../../métier/entities/AllocationRessource";
import { DomaineÉtablissementTerritorial } from "../../../métier/entities/DomaineÉtablissementTerritorial";
import { EntitéJuridiqueBudgetFinance } from "../../../métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { ÉtablissementTerritorialSanitaireActivité } from "../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import {
  AutorisationSanitaireForme,
  AutorisationSanitaireModalité,
  AutorisationÉquipementMatérielLourd,
  AutreActivitéSanitaire,
  ÉquipementMatérielLourd,
  ÉtablissementTerritorialSanitaireAutorisationEtCapacité,
  AutorisationSanitaireActivité,
  AutreActivitéSanitaireActivité,
  AutreActivitéSanitaireModalité,
  AutreActivitéSanitaireForme,
  ReconnaissanceContractuelleSanitaireActivité,
  ReconnaissanceContractuelleSanitaireForme,
  ReconnaissanceContractuelleSanitaireModalité,
  ReconnaissanceContractuelleSanitaire,
  AutorisationSanitaire,
  CapacitéSanitaire,
} from "../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { ÉtablissementTerritorialIdentité } from "../../../métier/entities/ÉtablissementTerritorialIdentité";
import { EvenementsIndesirables, Reclamations, ÉtablissementTerritorialQualite } from "../../../métier/entities/ÉtablissementTerritorialQualite";
import { ÉtablissementTerritorialSanitaireNonTrouvée } from "../../../métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée";
import { ÉtablissementTerritorialSanitaireLoader } from "../../../métier/gateways/ÉtablissementTerritorialSanitaireLoader";
import { construisActiviteMensuel } from "../entité-juridique-loader/ConstrutitActivitesMensuel";

export class TypeOrmEtablissementTerritorialSanitaireLoader implements ÉtablissementTerritorialSanitaireLoader {
  constructor(private readonly orm: Promise<DataSource>) { }

  async chargeActivité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireActivité[]> {
    const activitésÉtablissementTerritorialActivitésModel = await this.chargeLesActivitésModel(numéroFinessÉtablissementTerritorial);
    const dateDeMiseAJourAnnRpuModel = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_RPU)) as DateMiseÀJourFichierSourceModel;
    const dateDeMiseAJourMenPmsiAnnuelModel = (await this.chargeLaDateDeMiseÀJourModel(
      FichierSource.DIAMANT_MEN_PMSI_ANNUEL
    )) as DateMiseÀJourFichierSourceModel;
    const dateDeMiseAJourAnnSaeModel = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_SAE)) as DateMiseÀJourFichierSourceModel;

    return this.construisActivité(activitésÉtablissementTerritorialActivitésModel, dateDeMiseAJourAnnRpuModel, dateDeMiseAJourMenPmsiAnnuelModel, dateDeMiseAJourAnnSaeModel);
  }

  async chargeActivitéMensuel(numeroFinessEtablissementTerritorial: string): Promise<ActivitesSanitaireMensuel> {

    const activitéSanitaireMensuelModel = await (await this.orm)
      .getRepository(ActiviteSanitaireMensuelModel)
      .createQueryBuilder("activite_sanitaire_mensuel")
      .where("numero_finess_etablissement_territorial = :finess", { finess: numeroFinessEtablissementTerritorial })
      .orderBy('annee', 'ASC')
      .addOrderBy('mois', 'ASC')
      .getMany();

    const dateDeMiseAJourMenPmsiMensuel = (await this.chargeLaDateDeMiseÀJourModel(
      FichierSource.DIAMANT_MEN_PMSI_MENCUMU,
    )) as DateMiseÀJourFichierSourceModel;

    const activitesSanitaireMensuelCumulé = activitéSanitaireMensuelModel.map((activite) => {
      return {
        année: activite.année,
        mois: activite.mois,
        nombreJournéesPartiellesSsr: activite.nombreJournéesPartiellesSsr,
        nombreJournéesCompletesSsr: activite.nombreJournéesCompletesSsr,
        nombreSéjoursCompletsChirurgie: activite.nombreSéjoursCompletsChirurgie,
        nombreSéjoursCompletsMédecine: activite.nombreSéjoursCompletsMédecine,
        nombreSéjoursCompletsObstétrique: activite.nombreSéjoursCompletsObstétrique,
        nombreSéjoursPartielsChirurgie: activite.nombreSéjoursPartielsChirurgie,
        nombreSéjoursPartielsMédecine: activite.nombreSéjoursPartielsMédecine,
        nombreSéjoursPartielsObstétrique: activite.nombreSéjoursPartielsObstétrique,
      }
    })

    return construisActiviteMensuel(activitesSanitaireMensuelCumulé, dateDeMiseAJourMenPmsiMensuel);
  }

  async chargeIdentité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialSanitaireNonTrouvée> {
    const établissementTerritorialIdentitéModel = await this.chargeLIdentitéModel(numéroFinessÉtablissementTerritorial);

    if (!établissementTerritorialIdentitéModel) {
      return new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessÉtablissementTerritorial);
    }

    const dateDeMiseÀJourIdentitéModel = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400102)) as DateMiseÀJourFichierSourceModel;
    const domaineÉtablissementPrincipal = await this.chargePrincipaDomaine(établissementTerritorialIdentitéModel.numéroFinessÉtablissementPrincipal);

    return this.construisIdentité(établissementTerritorialIdentitéModel, dateDeMiseÀJourIdentitéModel, domaineÉtablissementPrincipal);
  }

  async chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireAutorisationEtCapacité> {
    const autorisationsDeLÉtablissementModel = await this.chargeLesAutorisationsModel(numéroFinessÉtablissementTerritorial);
    const équipementsDeLÉtablissementModel = await this.chargeLesÉquipementsMatérielsLourdsModel(numéroFinessÉtablissementTerritorial);
    const autresActivitésDeLÉtablissementModel = await this.chargeLesAutresActivitésModel(numéroFinessÉtablissementTerritorial);
    const reconnaissancesContractuellesDeLÉtablissementModel = await this.chargeLesReconnaissancesContractuellesModel(numéroFinessÉtablissementTerritorial);
    const capacitésDeLÉtablissementModel = await this.chargeLesCapacitésModel(numéroFinessÉtablissementTerritorial);
    const dateDeMiseÀJourFinessCs1400103Model = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400103)) as DateMiseÀJourFichierSourceModel;
    const dateDeMiseÀJourFinessCs1400104Model = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400104)) as DateMiseÀJourFichierSourceModel;
    const dateDeMiseÀJourFinessCs1600101Mode1 = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1600101)) as DateMiseÀJourFichierSourceModel;
    const dateDeMiseÀJourFinessCs1600102Mode1 = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1600102)) as DateMiseÀJourFichierSourceModel;
    const dateDeMiseÀJourDiamantAnnSaeModel = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_SAE)) as DateMiseÀJourFichierSourceModel;

    return {
      autorisations: this.construisLesAutorisations(autorisationsDeLÉtablissementModel, dateDeMiseÀJourFinessCs1400103Model),
      autresActivités: this.construisLesAutresActivités(autresActivitésDeLÉtablissementModel, dateDeMiseÀJourFinessCs1600101Mode1),
      capacités: this.construisLesCapacités(capacitésDeLÉtablissementModel, dateDeMiseÀJourDiamantAnnSaeModel),
      numéroFinessÉtablissementTerritorial,
      reconnaissancesContractuelles: this.construisLesReconnaissancesContractuelles(
        reconnaissancesContractuellesDeLÉtablissementModel,
        dateDeMiseÀJourFinessCs1600102Mode1
      ),
      équipementsMatérielsLourds: this.construisLesÉquipementsMatérielsLourds(équipementsDeLÉtablissementModel, dateDeMiseÀJourFinessCs1400104Model),
    };
  }

  async chargeQualite(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialQualite> {
    const reclamations = await (await this.orm)
      .getRepository(ReclamationETModel)
      .find({ where: { numéroFinessÉtablissementTerritorial } });

    const evenementsIndesirables = await (await this.orm)
      .getRepository(EvenementIndesirableETModel)
      .find({ where: { numéroFinessÉtablissementTerritorial } });

    const dateMiseAjourSIVSS = (await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.SIVSS })) as DateMiseÀJourFichierSourceModel;

    const dateMisAJour = (await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.SIREC })) as DateMiseÀJourFichierSourceModel;

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

  private async chargeLesCapacitésModel(numéroFinessÉtablissementTerritorial: string): Promise<CapacitéAutorisationSanitaireModel[]> {
    return await (await this.orm).getRepository(CapacitéAutorisationSanitaireModel).find({ where: { numéroFinessÉtablissementTerritorial } });
  }

  private async chargeLesÉquipementsMatérielsLourdsModel(numéroFinessÉtablissementTerritorial: string): Promise<ÉquipementMatérielLourdSanitaireModel[]> {
    return await (await this.orm).getRepository(ÉquipementMatérielLourdSanitaireModel).find({
      order: {
        codeÉquipementMatérielLourd: "ASC",
        numéroAutorisationArhgos: "ASC",
      },
      where: { numéroFinessÉtablissementTerritorial },
    });
  }

  private construitsQualite(
    reclamations: ReclamationETModel[],
    dateMisAJour: string,
    evenementsIndesirables: EvenementIndesirableETModel[],
    dateMiseAjourSIVSS: string,
    inspections: InspectionsControlesETModel[],
    dateMiseAjourSiicea: string

  ): ÉtablissementTerritorialQualite {
    return {
      reclamations: this.construitsReclamations(reclamations, dateMisAJour),
      evenementsIndesirables: this.construitsEvenementsIndesirables(evenementsIndesirables, dateMiseAjourSIVSS),
      inspectionsEtControles: this.construisInspections(inspections, dateMiseAjourSiicea)
    }
  }

  private construitsReclamations(
    reclamations: ReclamationETModel[],
    dateMisAJour: string,
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

  private constuisLevenementIndesirable = (evenement: EvenementIndesirableETModel) => {
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
      } else {
        if (evenement.etat === 'EN_COURS') evenementsIndesirableAssocieAuxSoins.evenementsEncours.push(this.constuisLevenementIndesirable(evenement));
        else evenementsIndesirableAssocieAuxSoins.evenementsClotures.push(this.constuisLevenementIndesirable(evenement));
      }
    });
    return [evenementsIndesirableAssocieAuxSoins, evenementsIndesirableParET]
  }

  private construisInspections = (inspections: InspectionsControlesETModel[], dateMisAJour: string) => {
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

  private async chargeLesReconnaissancesContractuellesModel(
    numéroFinessÉtablissementTerritorial: string
  ): Promise<ReconnaissanceContractuelleSanitaireModel[]> {
    return await (await this.orm).getRepository(ReconnaissanceContractuelleSanitaireModel).find({
      // eslint-disable-next-line sort-keys
      order: { codeActivité: "ASC", codeModalité: "ASC", codeForme: "ASC" },
      where: { numéroFinessÉtablissementTerritorial },
    });
  }

  private async chargeLesAutresActivitésModel(numéroFinessÉtablissementTerritorial: string): Promise<AutreActivitéSanitaireModel[]> {
    return await (await this.orm).getRepository(AutreActivitéSanitaireModel).find({
      // eslint-disable-next-line sort-keys
      order: { codeActivité: "ASC", codeModalité: "ASC", codeForme: "ASC" },
      where: { numéroFinessÉtablissementTerritorial },
    });
  }

  private async chargeLesAutorisationsModel(numéroFinessÉtablissementTerritorial: string): Promise<AutorisationSanitaireModel[]> {
    return await (await this.orm).getRepository(AutorisationSanitaireModel).find({
      // eslint-disable-next-line sort-keys
      order: { codeActivité: "ASC", codeModalité: "ASC", codeForme: "ASC" },
      where: { numéroFinessÉtablissementTerritorial },
    });
  }

  private async chargeLesActivitésModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm).getRepository(ActivitéSanitaireModel).find({
      order: { année: "ASC" },
      where: { numéroFinessÉtablissementTerritorial },
    });
  }

  private async chargeLIdentitéModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm).getRepository(ÉtablissementTerritorialIdentitéModel).findOneBy({
      domaine: DomaineÉtablissementTerritorial.SANITAIRE,
      numéroFinessÉtablissementTerritorial,
    });
  }

  private async chargeLaDateDeMiseÀJourModel(fichierSource: FichierSource): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm).getRepository(DateMiseÀJourFichierSourceModel).findOneBy({ fichier: fichierSource });
  }

  private async chargePrincipaDomaine(numéroFinessÉtablissementTerritorial: string): Promise<string> {
    const etablissementPrincipal = await (await this.orm).getRepository(ÉtablissementTerritorialIdentitéModel).findOneBy({
      numéroFinessÉtablissementTerritorial,
    });

    return etablissementPrincipal ? etablissementPrincipal.domaine : "";
  }

  private construisIdentité(
    établissementTerritorialIdentitéModel: ÉtablissementTerritorialIdentitéModel,
    dateDeMiseÀJourIdentitéModel: DateMiseÀJourFichierSourceModel,
    domaineÉtablissementPrincipal: string,
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
        dateMiseÀJourSource: "",
        value: "",
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
      codeRegion: établissementTerritorialIdentitéModel.codeRégion
    };
  }

  private construisActivité(
    établissementTerritorialActivitésModel: ActivitéSanitaireModel[],
    dateDeMiseAJourAnnRpuModel: DateMiseÀJourFichierSourceModel,
    dateDeMiseAJourMenPmsiAnnuelModel: DateMiseÀJourFichierSourceModel,
    dateDeMiseAJourAnnSaeModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireActivité[] {
    return établissementTerritorialActivitésModel.map<ÉtablissementTerritorialSanitaireActivité>((établissementTerritorialModel) => ({
      année: établissementTerritorialModel.année,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreDePassagesAuxUrgences,
      },
      nombreJournéesCompletePsy: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuelModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreJournéesCompletePsy,
      },
      nombreJournéesCompletesSsr: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuelModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreJournéesCompletesSsr,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuelModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreJournéesPartiellesPsy,
      },
      nombreJournéesPartielsSsr: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuelModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreJournéesPartielsSsr,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuelModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreSéjoursCompletsChirurgie,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuelModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreSéjoursCompletsMédecine,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuelModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreSéjoursCompletsObstétrique,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuelModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreSéjoursPartielsChirurgie,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuelModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreSéjoursPartielsMédecine,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuelModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreSéjoursPartielsObstétrique,
      },
      nombreJourneesUsld: {
        dateMiseÀJourSource: dateDeMiseAJourAnnSaeModel.dernièreMiseÀJour,
        value: établissementTerritorialModel.nombreJourneesUsld,
      },
      numéroFinessÉtablissementTerritorial: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
    }));
  }

  private construisLesAutorisations(
    autorisationSanitaireModels: AutorisationSanitaireModel[],
    dateMiseÀJourSourceModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité["autorisations"] {
    const autorisationsGroupéesDeLÉtablissement: AutorisationSanitaireActivité[] = [];

    autorisationSanitaireModels.forEach((autorisationModel: AutorisationSanitaireModel) => {
      const activitéEstConnue = autorisationsGroupéesDeLÉtablissement.find((activité) => activité.code === autorisationModel.codeActivité);

      if (!activitéEstConnue) {
        this.ajouteLAutorisationÀUneNouvelleActivité(autorisationsGroupéesDeLÉtablissement, autorisationModel);
      } else {
        this.ajouteLAutorisationÀLActivitéExistante(activitéEstConnue, autorisationModel);
      }
    });

    return {
      activités: autorisationsGroupéesDeLÉtablissement,
      dateMiseÀJourSource: dateMiseÀJourSourceModel.dernièreMiseÀJour,
    };
  }

  private ajouteLAutorisationÀLActivitéExistante(activitéSanitaire: AutorisationSanitaireActivité, autorisationModel: AutorisationSanitaireModel) {
    const modalitéEstDéjàCréée = activitéSanitaire.modalités.find((modalité) => modalité.code === autorisationModel.codeModalité);

    if (!modalitéEstDéjàCréée) {
      this.ajouteLAutorisationÀUneNouvelleModalité(activitéSanitaire, autorisationModel);
    } else {
      this.ajouteLAutorisationÀLaModalitéExistante(modalitéEstDéjàCréée, autorisationModel);
    }
  }

  private ajouteLAutorisationÀLaModalitéExistante(modalitéSanitaire: AutorisationSanitaireModalité, autorisationModel: AutorisationSanitaireModel) {
    const formeEstDéjàCréée = modalitéSanitaire.formes.find((forme) => forme.code === autorisationModel.codeForme);

    if (!formeEstDéjàCréée) {
      this.ajouteLAutorisationÀUneNouvelleForme(modalitéSanitaire, autorisationModel);
    }
  }

  private ajouteLAutorisationÀUneNouvelleForme(modalitéSanitaire: AutorisationSanitaireModalité, autorisationModel: AutorisationSanitaireModel) {
    modalitéSanitaire.formes.push(this.construisLaFormeDUneAutorisation(autorisationModel));
  }

  private ajouteLAutorisationÀUneNouvelleModalité(activitéSanitaire: AutorisationSanitaireActivité, autorisationModel: AutorisationSanitaireModel) {
    activitéSanitaire.modalités.push(this.construisLaModalitéDUneAutorisation(autorisationModel));
  }

  private ajouteLAutorisationÀUneNouvelleActivité(activitésSanitaires: AutorisationSanitaireActivité[], autorisationModel: AutorisationSanitaireModel) {
    activitésSanitaires.push(this.construisLActivitéDUneAutorisation(autorisationModel));
  }

  private construisLActivitéDUneAutorisation(autorisationModel: AutorisationSanitaireModel): AutorisationSanitaireActivité {
    return {
      code: autorisationModel.codeActivité,
      libellé: autorisationModel.libelléActivité,
      modalités: [this.construisLaModalitéDUneAutorisation(autorisationModel)],
    };
  }

  private construisLaModalitéDUneAutorisation(autorisationModel: AutorisationSanitaireModel): AutorisationSanitaireModalité {
    return {
      code: autorisationModel.codeModalité,
      formes: [this.construisLaFormeDUneAutorisation(autorisationModel)],
      libellé: autorisationModel.libelléModalité,
    };
  }

  private construisLaFormeDUneAutorisation(autorisationModel: AutorisationSanitaireModel): AutorisationSanitaireForme {
    return {
      autorisationSanitaire: this.construisUneAutorisation(autorisationModel),
      code: autorisationModel.codeForme,
      libellé: autorisationModel.libelléForme,
    };
  }

  private construisUneAutorisation(autorisationModel: AutorisationSanitaireModel): AutorisationSanitaire {
    return {
      dateDAutorisation: autorisationModel.dateAutorisation,
      dateDeFin: autorisationModel.dateFin,
      dateDeMiseEnOeuvre: autorisationModel.dateMiseEnOeuvre,
      numéroArhgos: autorisationModel.numéroAutorisationArhgos,
    };
  }

  private construisLesAutresActivités(
    autreActivitéSanitaireModels: AutreActivitéSanitaireModel[],
    dateMiseÀJourSourceModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité["autresActivités"] {
    const autresActivitésGroupéesDeLÉtablissement: AutreActivitéSanitaireActivité[] = [];

    autreActivitéSanitaireModels.forEach((autreActivitéModel: AutreActivitéSanitaireModel) => {
      const activitéConnue = autresActivitésGroupéesDeLÉtablissement.find((activité) => activité.code === autreActivitéModel.codeActivité);

      if (!activitéConnue) {
        this.ajouteLAutreActivitéÀUneNouvelleActivité(autresActivitésGroupéesDeLÉtablissement, autreActivitéModel);
      } else {
        this.ajouteLAutreActivitéÀLActivitéExistante(activitéConnue, autreActivitéModel);
      }
    });

    return {
      activités: autresActivitésGroupéesDeLÉtablissement,
      dateMiseÀJourSource: dateMiseÀJourSourceModel.dernièreMiseÀJour,
    };
  }

  private ajouteLAutreActivitéÀLActivitéExistante(activitéSanitaire: AutreActivitéSanitaireActivité, autreActivitéModel: AutreActivitéSanitaireModel) {
    const modalitéConnue = activitéSanitaire.modalités.find((modalité) => modalité.code === autreActivitéModel.codeModalité);

    if (!modalitéConnue) {
      this.ajouteLAutreActivitéÀUneNouvelleModalité(activitéSanitaire, autreActivitéModel);
    } else {
      this.ajouteLAutreActivitéÀLaModalitéExistante(modalitéConnue, autreActivitéModel);
    }
  }

  private ajouteLAutreActivitéÀLaModalitéExistante(modalitéSanitaire: AutreActivitéSanitaireModalité, autreActivitéModel: AutreActivitéSanitaireModel) {
    const formeConnue = modalitéSanitaire.formes.find((forme) => forme.code === autreActivitéModel.codeForme);

    if (!formeConnue) {
      this.ajouteLAutreActivitéÀUneNouvelleForme(modalitéSanitaire, autreActivitéModel);
    }
  }

  private ajouteLAutreActivitéÀUneNouvelleActivité(
    autresActivitésSanitaires: AutreActivitéSanitaireActivité[],
    autreActivitéModel: AutreActivitéSanitaireModel
  ) {
    autresActivitésSanitaires.push(this.construisLActivitéDUneAutreActivité(autreActivitéModel));
  }

  private ajouteLAutreActivitéÀUneNouvelleModalité(activitéSanitaire: AutreActivitéSanitaireActivité, autreActivitéModel: AutreActivitéSanitaireModel) {
    activitéSanitaire.modalités.push(this.construisLaModalitéDUneAutreActivité(autreActivitéModel));
  }

  private ajouteLAutreActivitéÀUneNouvelleForme(modalitéSanitaire: AutreActivitéSanitaireModalité, autreActivitéModel: AutreActivitéSanitaireModel) {
    modalitéSanitaire.formes.push(this.construisLaFormeDUneAutreActivité(autreActivitéModel));
  }

  private construisLActivitéDUneAutreActivité(autreActivitéModel: AutreActivitéSanitaireModel): AutreActivitéSanitaireActivité {
    return {
      code: autreActivitéModel.codeActivité,
      libellé: autreActivitéModel.libelléActivité,
      modalités: [this.construisLaModalitéDUneAutreActivité(autreActivitéModel)],
    };
  }

  private construisLaModalitéDUneAutreActivité(autreActivitéModel: AutreActivitéSanitaireModel): AutreActivitéSanitaireModalité {
    return {
      code: autreActivitéModel.codeModalité,
      formes: [this.construisLaFormeDUneAutreActivité(autreActivitéModel)],
      libellé: autreActivitéModel.libelléModalité,
    };
  }

  private construisLaFormeDUneAutreActivité(autreActivitéModel: AutreActivitéSanitaireModel): AutreActivitéSanitaireForme {
    return {
      autreActivitéSanitaire: this.construisUneAutreActivité(autreActivitéModel),
      code: autreActivitéModel.codeForme,
      libellé: autreActivitéModel.libelléForme,
    };
  }

  private construisUneAutreActivité(autreActivitéModel: AutreActivitéSanitaireModel): AutreActivitéSanitaire {
    return {
      dateDAutorisation: autreActivitéModel.dateAutorisation,
      dateDeFin: autreActivitéModel.dateFin,
      dateDeMiseEnOeuvre: autreActivitéModel.dateMiseEnOeuvre,
    };
  }

  private construisLesReconnaissancesContractuelles(
    reconnaissanceContractuelleSanitaireModels: ReconnaissanceContractuelleSanitaireModel[],
    dateMiseÀJourSourceModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité["reconnaissancesContractuelles"] {
    const reconnaissancesContractuellesGroupéesDeLÉtablissement: ReconnaissanceContractuelleSanitaireActivité[] = [];

    reconnaissanceContractuelleSanitaireModels.forEach((reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel) => {
      const activitéConnue = reconnaissancesContractuellesGroupéesDeLÉtablissement.find(
        (activité) => activité.code === reconnaissanceContractuelle.codeActivité
      );

      if (!activitéConnue) {
        this.ajouteLaReconnaissanceContractuelleÀUneNouvelleActivité(reconnaissancesContractuellesGroupéesDeLÉtablissement, reconnaissanceContractuelle);
      } else {
        this.ajouteLaReconnaissanceContractuelleÀLActivitéExistante(activitéConnue, reconnaissanceContractuelle);
      }
    });

    return {
      activités: reconnaissancesContractuellesGroupéesDeLÉtablissement,
      dateMiseÀJourSource: dateMiseÀJourSourceModel.dernièreMiseÀJour,
    };
  }

  private ajouteLaReconnaissanceContractuelleÀLActivitéExistante(
    activitéSanitaire: ReconnaissanceContractuelleSanitaireActivité,
    reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ) {
    const modalitéConnue = activitéSanitaire.modalités.find((modalité) => modalité.code === reconnaissanceContractuelleModel.codeModalité);

    if (!modalitéConnue) {
      this.ajouteLaReconnaissanceContractuelleÀUneNouvelleModalité(activitéSanitaire, reconnaissanceContractuelleModel);
    } else {
      this.ajouteLaReconnaissanceContractuelleÀUneModalitéExistante(modalitéConnue, reconnaissanceContractuelleModel);
    }
  }

  private ajouteLaReconnaissanceContractuelleÀUneModalitéExistante(
    modalitéSanitaire: ReconnaissanceContractuelleSanitaireModalité,
    reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ) {
    const formeConnue = modalitéSanitaire.formes.find((forme) => forme.code === reconnaissanceContractuelleModel.codeForme);

    if (!formeConnue) {
      this.ajouteLaReconnaissanceContractuelleÀUneNouvelleForme(modalitéSanitaire, reconnaissanceContractuelleModel);
    }
  }

  private ajouteLaReconnaissanceContractuelleÀUneNouvelleActivité(
    reconnaissancesContractuellesSanitaires: ReconnaissanceContractuelleSanitaireActivité[],
    reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ) {
    reconnaissancesContractuellesSanitaires.push(this.construisLActivitéDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel));
  }

  private ajouteLaReconnaissanceContractuelleÀUneNouvelleModalité(
    activitéSanitaire: ReconnaissanceContractuelleSanitaireActivité,
    reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ) {
    activitéSanitaire.modalités.push(this.construisLaModalitéDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel));
  }

  private ajouteLaReconnaissanceContractuelleÀUneNouvelleForme(
    modalitéSanitaire: ReconnaissanceContractuelleSanitaireModalité,
    reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ) {
    modalitéSanitaire.formes.push(this.construisLaFormeDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel));
  }

  private construisLActivitéDUneReconnaissanceContractuelle(
    reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ): ReconnaissanceContractuelleSanitaireActivité {
    return {
      code: reconnaissanceContractuelleModel.codeActivité,
      libellé: reconnaissanceContractuelleModel.libelléActivité,
      modalités: [this.construisLaModalitéDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel)],
    };
  }

  private construisLaModalitéDUneReconnaissanceContractuelle(
    reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ): ReconnaissanceContractuelleSanitaireModalité {
    return {
      code: reconnaissanceContractuelleModel.codeModalité,
      formes: [this.construisLaFormeDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel)],
      libellé: reconnaissanceContractuelleModel.libelléModalité,
    };
  }

  private construisLaFormeDUneReconnaissanceContractuelle(
    reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ): ReconnaissanceContractuelleSanitaireForme {
    return {
      code: reconnaissanceContractuelleModel.codeForme,
      libellé: reconnaissanceContractuelleModel.libelléForme,
      reconnaissanceContractuelleSanitaire: this.construisUneReconnaissanceContractuelle(reconnaissanceContractuelleModel),
    };
  }

  private construisUneReconnaissanceContractuelle(
    reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ): ReconnaissanceContractuelleSanitaire {
    return {
      capacitéAutorisée: reconnaissanceContractuelleModel.capacitéAutorisée,
      dateDEffetAsr: reconnaissanceContractuelleModel.dateEffetAsr,
      dateDEffetCpom: reconnaissanceContractuelleModel.dateEffetCpom,
      dateDeFinCpom: reconnaissanceContractuelleModel.dateFinCpom,
      numéroArhgos: reconnaissanceContractuelleModel.numéroAutorisationArhgos,
      numéroCpom: reconnaissanceContractuelleModel.numéroCpom,
    };
  }

  private construisLesÉquipementsMatérielsLourds(
    équipementMatérielLourdSanitaireModels: ÉquipementMatérielLourdSanitaireModel[],
    dateMiseÀJourSourceModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité["équipementsMatérielsLourds"] {
    const équipementsGroupésDeLÉtablissement: ÉquipementMatérielLourd[] = [];

    équipementMatérielLourdSanitaireModels.forEach((équipementMatérielLourd: ÉquipementMatérielLourdSanitaireModel) => {
      const équipementConnu = équipementsGroupésDeLÉtablissement.find((équipement) => équipement.code === équipementMatérielLourd.codeÉquipementMatérielLourd);

      if (!équipementConnu) {
        this.ajouteLAutorisationDÉquipementMatérielLourdÀUnNouvelÉquipement(équipementsGroupésDeLÉtablissement, équipementMatérielLourd);
      } else {
        this.ajouteLAutorisationDÉquipementMatérielLourdÀUnÉquipementExistant(équipementConnu, équipementMatérielLourd);
      }
    });

    return {
      dateMiseÀJourSource: dateMiseÀJourSourceModel.dernièreMiseÀJour,
      équipements: équipementsGroupésDeLÉtablissement,
    };
  }

  private ajouteLAutorisationDÉquipementMatérielLourdÀUnÉquipementExistant(
    équipementMatérielLourdSanitaire: ÉquipementMatérielLourd,
    équipementMatérielLourd: ÉquipementMatérielLourdSanitaireModel
  ) {
    équipementMatérielLourdSanitaire.autorisations.push(this.construisUnÉquipementMatérielLourd(équipementMatérielLourd));
  }

  private ajouteLAutorisationDÉquipementMatérielLourdÀUnNouvelÉquipement(
    équipementsGroupés: ÉquipementMatérielLourd[],
    équipementMatérielLourd: ÉquipementMatérielLourdSanitaireModel
  ) {
    équipementsGroupés.push(this.construisLÉquipementMatérielLourd(équipementMatérielLourd));
  }

  private construisLÉquipementMatérielLourd(équipementMatérielLourd: ÉquipementMatérielLourdSanitaireModel): ÉquipementMatérielLourd {
    return {
      autorisations: [this.construisUnÉquipementMatérielLourd(équipementMatérielLourd)],
      code: équipementMatérielLourd.codeÉquipementMatérielLourd,
      libellé: équipementMatérielLourd.libelléÉquipementMatérielLourd,
    };
  }

  private construisUnÉquipementMatérielLourd(équipementMatérielLourd: ÉquipementMatérielLourdSanitaireModel): AutorisationÉquipementMatérielLourd {
    return {
      dateDAutorisation: équipementMatérielLourd.dateAutorisation,
      dateDeFin: équipementMatérielLourd.dateFin,
      dateDeMiseEnOeuvre: équipementMatérielLourd.dateMiseEnOeuvre,
      numéroArhgos: équipementMatérielLourd.numéroAutorisationArhgos,
    };
  }

  private construisLesCapacités(
    capacitésDeLÉtablissementModel: CapacitéAutorisationSanitaireModel[],
    dateDeMiseÀJourDiamantAnnSaeModel: DateMiseÀJourFichierSourceModel
  ): CapacitéSanitaire[] {
    return capacitésDeLÉtablissementModel.map((capacités) => ({
      année: capacités.année,
      dateMiseÀJourSource: dateDeMiseÀJourDiamantAnnSaeModel.dernièreMiseÀJour,
      nombreDeLitsEnChirurgie: capacités.nombreDeLitsEnChirurgie,
      nombreDeLitsEnMédecine: capacités.nombreDeLitsEnMédecine,
      nombreDeLitsEnObstétrique: capacités.nombreDeLitsEnObstétrique,
      nombreDeLitsEnSsr: capacités.nombreDeLitsEnSsr,
      nombreDeLitsEnUsld: capacités.nombreDeLitsEnUsld,
      nombreDeLitsOuPlacesEnPsyHospitalisationComplète: capacités.nombreDeLitsOuPlacesEnPsyHospitalisationComplète,
      nombreDePlacesEnChirurgie: capacités.nombreDePlacesEnChirurgie,
      nombreDePlacesEnMédecine: capacités.nombreDePlacesEnMédecine,
      nombreDePlacesEnObstétrique: capacités.nombreDePlacesEnObstétrique,
      nombreDePlacesEnPsyHospitalisationPartielle: capacités.nombreDePlacesEnPsyHospitalisationPartielle,
      nombreDePlacesEnSsr: capacités.nombreDePlacesEnSsr,
    }));
  }

  async chargeBudgetFinance(numéroFinessEtablissementTerritorial: string): Promise<EntitéJuridiqueBudgetFinance[]> {
    const budgetFinance = await (await this.orm).getRepository(BudgetEtFinancesSanitaireModel).find({
      where: { numéroFinessEtablissementTerritorial },
    });

    const dateMisAJour = (await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.DIAMANT_QUO_SAN_FINANCE })) as DateMiseÀJourFichierSourceModel;

    return this.construisBudgetFinanceSanitaire(budgetFinance, dateMisAJour);
  }

  private construisBudgetFinanceSanitaire(
    budgetFinance: BudgetEtFinancesSanitaireModel[],
    dateMisAJour: DateMiseÀJourFichierSourceModel
  ): EntitéJuridiqueBudgetFinance[] {
    return budgetFinance.map((budget) => ({
      année: budget.année,
      dateMiseÀJourSource: dateMisAJour.dernièreMiseÀJour,
      depensesTitreIGlobal: budget.depensesTitreIGlobal,
      depensesTitreIIGlobal: budget.depensesTitreIIGlobal,
      depensesTitreIIIGlobal: budget.depensesTitreIIIGlobal,
      depensesTitreIVGlobal: budget.depensesTitreIVGlobal,
      totalDepensesGlobal: budget.depensesTitreIGlobal + budget.depensesTitreIIGlobal + budget.depensesTitreIIIGlobal + budget.depensesTitreIVGlobal,

      recettesTitreIGlobal: budget.recettesTitreIGlobal,
      recettesTitreIIGlobal: budget.recettesTitreIIGlobal,
      recettesTitreIIIGlobal: budget.recettesTitreIIIGlobal,
      recettesTitreIVGlobal: budget.recettesTitreIVGlobal,
      totalRecettesGlobal: budget.recettesTitreIGlobal + budget.recettesTitreIIGlobal + budget.recettesTitreIIIGlobal + budget.recettesTitreIVGlobal,

      depensesTitreIPrincipales: budget.depensesTitreIH,
      depensesTitreIIPrincipales: budget.depensesTitreIIH,
      depensesTitreIIIPrincipales: budget.depensesTitreIIIH,
      depensesTitreIVPrincipales: budget.depensesTitreIVH,
      totalDepensesPrincipales: budget.depensesTitreIH + budget.depensesTitreIIH + budget.depensesTitreIIIH + budget.depensesTitreIVH,

      recettesTitreIPrincipales: budget.recettesTitreIH,
      recettesTitreIIPrincipales: budget.recettesTitreIIH,
      recettesTitreIIIPrincipales: budget.recettesTitreIIIH,
      totalRecettesPrincipales: budget.recettesTitreIH + budget.recettesTitreIIH + budget.recettesTitreIIIH,

      depensesTitreIAnnexe: budget.depensesTitreIGlobal - budget.depensesTitreIH,
      depensesTitreIIAnnexe: budget.depensesTitreIIGlobal - budget.depensesTitreIIH,
      depensesTitreIIIAnnexe: budget.depensesTitreIIIGlobal - budget.depensesTitreIIIH,
      depensesTitreIVAnnexe: budget.depensesTitreIVGlobal - budget.depensesTitreIVH,
      totalDepensesAnnexe:
        budget.depensesTitreIGlobal -
        budget.depensesTitreIH +
        (budget.depensesTitreIIGlobal - budget.depensesTitreIIH) +
        (budget.depensesTitreIIIGlobal - budget.depensesTitreIIIH) +
        (budget.depensesTitreIVGlobal - budget.depensesTitreIVH),

      recettesTitreIAnnexe: budget.recettesTitreIGlobal - budget.recettesTitreIH,
      recettesTitreIIAnnexe: budget.recettesTitreIIGlobal - budget.recettesTitreIIH,
      recettesTitreIIIAnnexe: budget.recettesTitreIIIGlobal - budget.recettesTitreIIIH,
      recettesTitreIVAnnexe: budget.recettesTitreIVGlobal,
      totalRecettesAnnexe:
        budget.recettesTitreIGlobal -
        budget.recettesTitreIH +
        (budget.recettesTitreIIGlobal - budget.recettesTitreIIH) +
        (budget.recettesTitreIIIGlobal - budget.recettesTitreIIIH) +
        budget.recettesTitreIVGlobal,
      resultatNetComptable: budget.resultatNetComptableSan,
      ratioDependanceFinanciere: budget.ratioDependanceFinanciere,
      tauxDeCafNetSan: budget.tauxDeCafNetteSan,
    }));
  }

  async chargeAllocationRessource(numéroFiness: string): Promise<AllocationRessource> {
    const allocation = await (await this.orm)
      .getRepository(AllocationRessourceETModel)
      .createQueryBuilder("allocation_ressource_et")
      .select(["enveloppe", "sous_enveloppe", "mode_delegation", "annee"])
      .addSelect("SUM(montant)", "montant_annuel")
      .where("numero_finess_etablissement_territorial = :finess", { finess: numéroFiness })
      .groupBy("enveloppe")
      .addGroupBy("sous_enveloppe")
      .addGroupBy("mode_delegation")
      .addGroupBy("annee")
      .getRawMany();

    const dateMiseAJourMenHapi = (await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.DIAMANT_MEN_HAPI })) as DateMiseÀJourFichierSourceModel;

    return this.construisEtablissementSanitaireAllocation(allocation, dateMiseAJourMenHapi);
  }

  private construisEtablissementSanitaireAllocation(
    allocations: any[],
    dateDeMiseÀJourDiamantMenHapiModel: DateMiseÀJourFichierSourceModel
  ): AllocationRessource {
    const allocationRessource = allocations
      .reduce((acc: AllocationRessourceData[], curr: any) => {
        let allocationRessourceAnnuel = acc.find((allocation) => allocation.année === curr.annee);

        if (!allocationRessourceAnnuel) {
          allocationRessourceAnnuel = { année: curr.annee, allocationRessoure: [] }
          acc.push(allocationRessourceAnnuel);
        }
        allocationRessourceAnnuel.allocationRessoure.push({
          enveloppe: curr.enveloppe,
          sousEnveloppe: curr.sous_enveloppe,
          modeDeDélégation: curr.mode_delegation,
          montantNotifié: curr.montant_annuel,
        });
        return acc;
      }, [])

    return {
      dateMiseÀJourSource: dateDeMiseÀJourDiamantMenHapiModel.dernièreMiseÀJour,
      data: allocationRessource
    }
  }
}
