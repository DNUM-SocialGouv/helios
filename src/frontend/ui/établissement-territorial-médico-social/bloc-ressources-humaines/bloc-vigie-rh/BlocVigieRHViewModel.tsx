import { EtablissementTerritorialMedicoSocialVigieRH } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { Wording } from "../../../../configuration/wording/Wording";

export type DonneesVigieRh = {
    annee: number;
    effectifHomme: number[];
    effectifFemme: number[];
    effectifHommeRef: number[];
    effectifFemmeRef: number[];
}
export class BlocVigieRHViewModel {

    public etablissementTerritorialVRMedicoSocial: EtablissementTerritorialMedicoSocialVigieRH;

    constructor(etablissementTerritorialVRMedicoSocial: EtablissementTerritorialMedicoSocialVigieRH, private readonly wording: Wording) {
        this.etablissementTerritorialVRMedicoSocial = etablissementTerritorialVRMedicoSocial;
    }

    public get lesAgesNeSontIlsPasRenseignees(): boolean {
        return this.etablissementTerritorialVRMedicoSocial.tranchesAgesLibelles[0] !== 'ko' && this.etablissementTerritorialVRMedicoSocial.pyramideAges.length === 0;
    }

    public get lesAgesNeSontIlsPasAutorisee(): boolean {
        return this.etablissementTerritorialVRMedicoSocial.tranchesAgesLibelles[0] === 'ko'
    }

    public get lesDonneesVgRHPasRenseignees(): string[] {
        const nonRenseignees = [];
        if (this.lesAgesNeSontIlsPasRenseignees) nonRenseignees.push(this.wording.PYRAMIDE_DES_AGES);

        return nonRenseignees;
    }

    public get lesDonneesVgRHPasAutorises(): string[] {
        const nonAutorises = [];
        if (this.lesAgesNeSontIlsPasAutorisee) nonAutorises.push(this.wording.PYRAMIDE_DES_AGES);

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
                            effectifHomme: Array(labels.length).fill(-1),
                            effectifFemme: Array(labels.length).fill(-1),
                            effectifHommeRef: Array(labels.length).fill(-1),
                            effectifFemmeRef: Array(labels.length).fill(-1),
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
        return this.lesAgesNeSontIlsPasRenseignees;
    }

}
