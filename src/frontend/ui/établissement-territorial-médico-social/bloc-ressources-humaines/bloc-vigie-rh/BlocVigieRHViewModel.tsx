import {
  DepartEmbauche,
  DureeCDD,
  EtablissementTerritorialMedicoSocialVigieRH,
  MotifsRuptureContrat,
  NatureContratsAnnuel,
  NatureContratsTrimestriel,
  ProfessionFiliere,
  TauxRotation,
  TauxRotationTrimestriel,
} from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { Wording } from "../../../../configuration/wording/Wording";
import {
  couleurDuFondHistogrammeJaune,
  couleurExtensionHistogrammeJaune,
  CouleurHistogramme,
  couleurDuFondHistogrammeOrangeClair,
  couleurExtensionHistogrammeOrangeClair,
} from "../../../commun/Graphique/couleursGraphique";
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

export type DepartPrematuresCdiViewModel = Readonly<{
  annee: number;
  valeur: number | null;
}>;

export class BlocVigieRHViewModel {

  public etablissementTerritorialVRMedicoSocial: EtablissementTerritorialMedicoSocialVigieRH;

  constructor(etablissementTerritorialVRMedicoSocial: EtablissementTerritorialMedicoSocialVigieRH, private readonly wording: Wording, private readonly autorisations: any) {
    this.etablissementTerritorialVRMedicoSocial = etablissementTerritorialVRMedicoSocial;
    this.autorisations = autorisations;

  }

  public get lesAgesNeSontIlsPasRenseignees(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ok' && this.etablissementTerritorialVRMedicoSocial.pyramideAges.length === 0;
  }
  public get lesEffectifsNeSontIlsPasRenseignees(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ok' && this.etablissementTerritorialVRMedicoSocial.professionFiliere?.data.length === 0;
  }

  public get lesDepartsEmbauchesNeSontIlsPasRenseignees(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ok' && this.etablissementTerritorialVRMedicoSocial.departsEmbauches.length === 0
  }

  public get lesRotationsNeSontIlsPasRenseignees(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ok' && this.etablissementTerritorialVRMedicoSocial.tauxRotation.length === 0
  }

  public get lesDureesCDDNeSontEllesPasRenseignees(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ok' && this.etablissementTerritorialVRMedicoSocial.dureesCdd.length === 0;
  }

  public get lesMotifsNeSontIlsPasRenseignes(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ok' && this.etablissementTerritorialVRMedicoSocial.motifsRuptureContrat.length === 0;
  }

  public get lesNaturesContratsNeSontPasReseignees(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ok' && this.etablissementTerritorialVRMedicoSocial.natureContratsAnnuel.length === 0;
  }

  public get lesDepartsPrematuresCdiPasRenseignes(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ok' && !this.departsPrematuresCdiDisponibles;
  }

  public get lesAgesNeSontIlsPasAutorisee(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ko'
  }

  public get lesEffectifsNeSontIlsPasAutorisee(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ko'
  }

  public get lesDepartsEmbauchesNeSontIlsPasAutorisee(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ko'
  }

  public get lesRotationsNeSontIlsPasAutorisee(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ko'
  }

  public get lesDureesCDDNeSontEllesPasAutorisee(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ko'
  }

  public get lesMotifsNeSontIlsPasAutorises(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ko';
  }

  public get lesNaturesContratsNeSontPasAutorisees(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ko';
  }

  public get lesDepartsPrematuresCdiPasAutorises(): boolean {
    return this.autorisations.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ko';
  }

  public get graphiqueMotifsAffichable(): boolean {
    return !this.lesMotifsNeSontIlsPasRenseignes && !this.lesMotifsNeSontIlsPasAutorises;
  }

  public get graphiqueRotationsAffichable(): boolean {
    return !this.lesRotationsNeSontIlsPasRenseignees && !this.lesRotationsNeSontIlsPasAutorisee;
  }

  public get graphiqueEffectifsAffichable(): boolean {
    return !this.lesEffectifsNeSontIlsPasRenseignees && !this.lesEffectifsNeSontIlsPasAutorisee
  }

  public get graphiqueDepartsEmbauchesAffichable():boolean {
    return !this.lesDepartsEmbauchesNeSontIlsPasRenseignees && !this.lesDepartsEmbauchesNeSontIlsPasAutorisee
  }

  public get graphiquePyramideAgesAffichable(): boolean {
    return !this.lesAgesNeSontIlsPasRenseignees && !this.lesAgesNeSontIlsPasAutorisee;
  }

  public get graphiqueNatureContratsAffichable(): boolean {
    return !this.lesNaturesContratsNeSontPasAutorisees && !this.lesNaturesContratsNeSontPasReseignees;
  }

  public get graphiqueDepartsPrematuresCdiAffichable(): boolean {
    return !this.lesDepartsEmbauchesNeSontIlsPasAutorisee && this.departsPrematuresCdiDisponibles;
  }

  public get lesDonneesVgRHPasRenseignees(): string[] {
    const nonRenseignees = [];
    if (this.lesAgesNeSontIlsPasRenseignees) nonRenseignees.push(this.wording.PYRAMIDE_DES_AGES);
    if (this.lesEffectifsNeSontIlsPasRenseignees) nonRenseignees.push(this.wording.EFFECTIFS);
    if (this.lesDepartsEmbauchesNeSontIlsPasRenseignees) { nonRenseignees.push(this.wording.DEPARTS_EMBAUCHES) };
    if (this.lesRotationsNeSontIlsPasRenseignees) nonRenseignees.push(this.wording.TAUX_ROTATION);
    if (this.lesDureesCDDNeSontEllesPasRenseignees) nonRenseignees.push(this.wording.DUREE_CDD);
    if (this.lesMotifsNeSontIlsPasRenseignes) nonRenseignees.push(this.wording.MOTIFS_RUPTURE_CONTRAT);
    if (this.lesNaturesContratsNeSontPasReseignees) nonRenseignees.push(this.wording.NATURE_CONTRATS);
    if (this.lesDepartsPrematuresCdiPasRenseignes) nonRenseignees.push(this.wording.DEPARTS_PREMATURES_CDI);

    return nonRenseignees;
  }

  public get lesDonneesVgRHPasAutorises(): string[] {
    const nonAutorises = [];
    if (this.lesAgesNeSontIlsPasAutorisee) nonAutorises.push(this.wording.PYRAMIDE_DES_AGES);
    if (this.lesEffectifsNeSontIlsPasAutorisee) nonAutorises.push(this.wording.EFFECTIFS);
    if (this.lesDepartsEmbauchesNeSontIlsPasAutorisee) nonAutorises.push(this.wording.DEPARTS_EMBAUCHES);
    if (this.lesRotationsNeSontIlsPasAutorisee) nonAutorises.push(this.wording.TAUX_ROTATION);
    if (this.lesDureesCDDNeSontEllesPasAutorisee) nonAutorises.push(this.wording.DUREE_CDD);
    if (this.lesMotifsNeSontIlsPasAutorises) nonAutorises.push(this.wording.MOTIFS_RUPTURE_CONTRAT);
    if (this.lesNaturesContratsNeSontPasAutorisees) nonAutorises.push(this.wording.NATURE_CONTRATS);
    if (this.lesDepartsPrematuresCdiPasAutorises) nonAutorises.push(this.wording.DEPARTS_PREMATURES_CDI);

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
    return this.lesAgesNeSontIlsPasRenseignees && this.lesEffectifsNeSontIlsPasRenseignees && this.lesDepartsEmbauchesNeSontIlsPasRenseignees && this.lesDureesCDDNeSontEllesPasRenseignees && this.lesMotifsNeSontIlsPasRenseignes;
  }

  public get dateDeMiseAJourEffectifs(): string {
    return StringFormater.formatDate(this.etablissementTerritorialVRMedicoSocial.professionFiliere?.dateDeMiseAJour);
  }

  public get lesDonneesEffectifs(): ProfessionFiliere {
    const dataEffectifs = this.etablissementTerritorialVRMedicoSocial.professionFiliere;

    const transformData = (dataEffectifs: ProfessionFiliere): any => {
      const transformSerie = (serie: any[] | undefined, effectifKey: "effectifFiliere" | "effectif") => ({
        dataFiliere: (serie ?? []).map((entry) => Number(entry?.[effectifKey] ?? 0)),
        dataMoisAnnee: (serie ?? []).map(({ mois, annee }) => ({ mois: Number(mois), annee: Number(annee) })),
      });

      return dataEffectifs?.data?.map(({ categorie, dataCategorie, groupes }) => {
        const serieFiliere = transformSerie(dataCategorie, "effectifFiliere");
        const groupesTransformes = groupes?.data
          ?.map((groupe) => ({
            categorie: groupe.categorie,
            dataCategorie: transformSerie(groupe.dataCategorie, "effectif"),
          })) ?? [];

        return {
          categorie,
          dataCategorie: serieFiliere,
          ...(groupesTransformes.length
            ? {
              groupes: {
                data: groupesTransformes,
                dateDeMiseAJour: groupes?.dateDeMiseAJour ?? "",
              },
            }
            : {}),
        };
      });
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

  public get departsPrematuresCdi(): DepartPrematuresCdiViewModel[] {
    return this.etablissementTerritorialVRMedicoSocial.departsEmbauches
      .map(({ annee, departsPrematuresCdi }) => ({ annee, valeur: departsPrematuresCdi ?? null }))
      .sort((a, b) => b.annee - a.annee);
  }

  private get departsPrematuresCdiDisponibles(): boolean {
    return this.departsPrematuresCdi.some(({ valeur }) => valeur !== null && valeur !== undefined);
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
    let variationText = '';

    if (variation) {
      variationText = variation > 0
        ? `+${variation}pts`
        : `${variation}pts`;
    }
    return {
      comparaisonLabel,
      courant: StringFormater.transformInRoundedRate(derniereDonneeComparaison?.rotation) + '%',
      precedent: isoPeriodDonneeComparaison?.rotation ?? '',
      variation: variation,
      variationText: variationText,
      dernierePeriode: `(T${derniereDonneeComparaison?.trimestre}-${derniereDonneeComparaison?.annee})`
    }
  }

  public get lesLibellesDureeCdd(): string[] {
    return this.etablissementTerritorialVRMedicoSocial.dureesCddLibelles;
  }

  public get lesDureesCdd(): DureeCDD[] {
    const durees = this.etablissementTerritorialVRMedicoSocial.dureesCdd;
    const maxAnnee = Math.max(...durees.map(d => d.annee));

    return durees
      .filter(d => d.annee === maxAnnee)
      .sort((a, b) => a.dureeCode - b.dureeCode);
  }

  public get lesLibellesMotifsRupture(): string[] {
    return this.etablissementTerritorialVRMedicoSocial.motifsRuptureContratLibelles;
  }

  public get lesMotifsRuptureContrat(): MotifsRuptureContrat[] {
    const motifs = this.etablissementTerritorialVRMedicoSocial.motifsRuptureContrat;
    const maxAnnee = Math.max(...motifs.map(m => m.annee));

    return motifs
      .filter(m => m.annee === maxAnnee)
      .sort((a, b) => a.motifCode - b.motifCode);
  }

  public get natureContratsAnnuel():NatureContratsAnnuel[]{
    return this.etablissementTerritorialVRMedicoSocial.natureContratsAnnuel;
  }

  public get natureContratsTrimestriel():NatureContratsTrimestriel[]{
    return this.etablissementTerritorialVRMedicoSocial.natureContratsTrimestriel;
  }

  public get paletteNatureContrats(): CouleurHistogramme[] {
    return [
      {
        premierPlan: couleurDuFondHistogrammeJaune,
        secondPlan: couleurExtensionHistogrammeJaune,
      },
      {
        premierPlan: couleurDuFondHistogrammeOrangeClair,
        secondPlan: couleurExtensionHistogrammeOrangeClair,
      },
    ];
  }
}
