import { DepartEmbauche, EtablissementTerritorialMedicoSocialVigieRH, ProfessionFiliere, TauxRotation, TauxRotationTrimestriel } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { Wording } from "../../../../configuration/wording/Wording";
import { couleurDuFondHistogrammeJaune, couleurExtensionHistogrammeJaune, CouleurHistogramme } from "../../../commun/Graphique/couleursGraphique";
import { StringFormater } from "../../../commun/StringFormater";

export type DonneesVigieRh = {
  annee: number;
  effectifHomme: number[];
  effectifFemme: number[];
  effectifHommeRef: number[];
  effectifFemmeRef: number[];
}

export type DepartEmbaucheTrimestrielViewModel = {
  trimestre: string;
  depart: number;
  departRef: number;
  embauche: number;
  embaucheRef: number;
}

export class BlocVigieRHViewModel {

  public etablissementTerritorialVRMedicoSocial: EtablissementTerritorialMedicoSocialVigieRH;

  constructor(etablissementTerritorialVRMedicoSocial: EtablissementTerritorialMedicoSocialVigieRH, private readonly wording: Wording) {
    this.etablissementTerritorialVRMedicoSocial = etablissementTerritorialVRMedicoSocial;
  }

  public get lesAgesNeSontIlsPasRenseignees(): boolean {
    return this.etablissementTerritorialVRMedicoSocial.tranchesAgesLibelles[0] !== 'ko' && this.etablissementTerritorialVRMedicoSocial.pyramideAges.length === 0;
  }
  public get lesEffectifsNeSontIlsPasRenseignees(): boolean {
    return this.etablissementTerritorialVRMedicoSocial.professionFiliere?.dateDeMiseAJour !== 'ko' && this.etablissementTerritorialVRMedicoSocial.professionFiliere?.data.length === 0;
  }

  public get lesAgesNeSontIlsPasAutorisee(): boolean {
    return this.etablissementTerritorialVRMedicoSocial.tranchesAgesLibelles[0] === 'ko'
  }

  public get lesEffectifsNeSontIlsPasAutorisee(): boolean {
    return this.etablissementTerritorialVRMedicoSocial.professionFiliere?.dateDeMiseAJour === 'ko'
  }

  public get lesDepartsEmbauchesNeSontIlsPasRenseignees(): boolean {
    return this.etablissementTerritorialVRMedicoSocial.departsEmbauches.length === 0;
  }

  public get lesDepartsEmbauchesNeSontIlsPasAutorisee(): boolean {
    return this.etablissementTerritorialVRMedicoSocial.departsEmbauches[0]?.annee === -1
  }

  public get lesDonneesVgRHPasRenseignees(): string[] {
    const nonRenseignees = [];
    if (this.lesAgesNeSontIlsPasRenseignees) nonRenseignees.push(this.wording.PYRAMIDE_DES_AGES);
    if (this.lesEffectifsNeSontIlsPasRenseignees) nonRenseignees.push(this.wording.EFFECTIFS);
    if (this.lesDepartsEmbauchesNeSontIlsPasRenseignees) nonRenseignees.push(this.wording.DEPARTS_EMBAUCHES);
    return nonRenseignees;
  }

  public get lesDonneesVgRHPasAutorises(): string[] {
    const nonAutorises = [];
    if (this.lesAgesNeSontIlsPasAutorisee) nonAutorises.push(this.wording.PYRAMIDE_DES_AGES);
    if (this.lesEffectifsNeSontIlsPasAutorisee) nonAutorises.push(this.wording.EFFECTIFS);
    if (this.lesDepartsEmbauchesNeSontIlsPasAutorisee) nonAutorises.push(this.wording.DEPARTS_EMBAUCHES);
    return nonAutorises;
  }

  public get lesLibellesTranchesAges(): string[] {
    return this.etablissementTerritorialVRMedicoSocial.tranchesAgesLibelles;
  }

  public get lesDonneesPyramideAges(): DonneesVigieRh[] {
    const labels = this.etablissementTerritorialVRMedicoSocial.tranchesAgesLibelles;
    if (this.etablissementTerritorialVRMedicoSocial.pyramideAges !== null)
      return Object.values(
        this.etablissementTerritorialVRMedicoSocial.pyramideAges.reduce((acc: { [key: number]: DonneesVigieRh }, item) => {
          const { annee, trancheLibelle, effectifHomme, effectifFemme, effectifHommeRef, effectifFemmeRef } = item;

          if (!acc[annee]) {
            acc[annee] = {
              annee,
              effectifHomme: new Array(labels.length).fill(-1),
              effectifFemme: new Array(labels.length).fill(-1),
              effectifHommeRef: new Array(labels.length).fill(-1),
              effectifFemmeRef: new Array(labels.length).fill(-1),
            };
          }

          const labelIndex = labels.indexOf(trancheLibelle);

          acc[annee].effectifHomme[labelIndex] = effectifHomme;
          acc[annee].effectifFemme[labelIndex] = effectifFemme;
          acc[annee].effectifHommeRef[labelIndex] = effectifHommeRef;
          acc[annee].effectifFemmeRef[labelIndex] = effectifFemmeRef;
          return acc;
        }, {})
      );
    else return [];
  }

  public get lesDonneesVigieRHNeSontPasRenseignees(): boolean {
    return this.lesAgesNeSontIlsPasRenseignees && this.lesEffectifsNeSontIlsPasRenseignees;
  }

  public get dateDeMiseAJourEffectifs(): string {
    return StringFormater.formatDate(this.etablissementTerritorialVRMedicoSocial.professionFiliere?.dateDeMiseAJour);
  }

  public get lesDonneesEffectifs(): ProfessionFiliere {
    const dataEffectifs = this.etablissementTerritorialVRMedicoSocial.professionFiliere;

    const transformData = (dataEffectifs: ProfessionFiliere): any => {
      return dataEffectifs?.data?.map(({ categorie, dataCategorie }) => ({
        categorie,
        dataCategorie: {
          dataFiliere: dataCategorie?.map(entry => entry.effectifFiliere),
          dataMoisAnnee: dataCategorie?.map(({ mois, annee }) => ({ mois, annee })),
        },
      }));
    };

    let transformedData = [];
    if (this.etablissementTerritorialVRMedicoSocial.professionFiliere?.data !== null) {
      transformedData = transformData(dataEffectifs)
    }

    return { ...dataEffectifs, data: transformedData }
  }

  public get lesDonneesDepartsEmbauches(): DepartEmbauche[] {
    return this.etablissementTerritorialVRMedicoSocial.departsEmbauches ?? [];
  }

  public get donneesDepartsEmbauchesTrimestriels(): DepartEmbaucheTrimestrielViewModel[] {
    const donneesTrimestrielles = this.etablissementTerritorialVRMedicoSocial.departsEmbauchesTrimestriels ?? [];
    return donneesTrimestrielles.map(({ annee, trimestre, depart, departRef, embauche, embaucheRef }) => {
      return {
        trimestre: `${annee}-T${trimestre}`,
        depart,
        departRef,
        embauche,
        embaucheRef,
      }
    });
  }

  public get donneesTauxRotation(): TauxRotation[] {
    return this.etablissementTerritorialVRMedicoSocial.tauxRotation ?? [];
  }

  public get donneesTauxRotationTrimestrielles(): TauxRotationTrimestriel[] {
    return this.etablissementTerritorialVRMedicoSocial.tauxRotationTrimestriel ?? [];
  }

  tickFormatter = (type: string, index: number): string => {
    if (type === this.wording.ANNUEL) return '' + this.donneesTauxRotation[index].annee
    else return 'T' + this.donneesTauxRotationTrimestrielles[index].trimestre
  }

  tickX2Formatter = (type: string, index: number): string => {
    if (type === this.wording.TRIMESTRIEL && this.donneesTauxRotationTrimestrielles[index].trimestre === 1)
      return '' + this.donneesTauxRotationTrimestrielles[index].annee
    else
      return ''
  }

  couleursDeLHistogramme = (donnees: (TauxRotationTrimestriel | TauxRotation)[]): CouleurHistogramme[] => {
    return donnees.map(() => {
      return {
        premierPlan: couleurDuFondHistogrammeJaune,
        secondPlan: couleurExtensionHistogrammeJaune,
      };
    });
  }

  public get topIndicateurTauxRotation() {
    const derniereDonneeComparaison = this.donneesTauxRotationTrimestrielles[this.donneesTauxRotationTrimestrielles.length - 1]
    const isoPeriodDonneeComparaison = this.donneesTauxRotationTrimestrielles.find(donnee => donnee.annee === derniereDonneeComparaison?.annee - 1 && donnee.trimestre === derniereDonneeComparaison?.trimestre);
    const comparaisonLabel = isoPeriodDonneeComparaison ? `au T${isoPeriodDonneeComparaison.trimestre}-${isoPeriodDonneeComparaison.annee}` : '';
    const variation = isoPeriodDonneeComparaison ? StringFormater.transformInRoundedRate(StringFormater.transformInRoundedRate(derniereDonneeComparaison?.rotation) - StringFormater.transformInRoundedRate(isoPeriodDonneeComparaison?.rotation)) : 0;
    return {
      comparaisonLabel,
      courant: StringFormater.transformInRoundedRate(derniereDonneeComparaison?.rotation) + '%',
      precedent: isoPeriodDonneeComparaison?.rotation ?? '',
      variation: variation,
      variationText: variation > 0 ? `+${variation}pts` : variation < 0 ? `${variation}pts` : '0pts',
      dernierePeriode: `(T${derniereDonneeComparaison?.trimestre}-${derniereDonneeComparaison?.annee})`
    }
  }
}
