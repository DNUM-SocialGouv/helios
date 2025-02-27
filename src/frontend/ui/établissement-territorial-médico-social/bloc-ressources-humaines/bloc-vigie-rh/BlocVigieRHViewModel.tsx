import { EtablissementTerritorialMedicoSocialVigieRH } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { StringFormater } from "../../../commun/StringFormater";

export type DonneesVigieRh = {
    annee: number;
    effectifHomme: number[];
    effectifFemme: number[];
    effectifHommeRef: number[];
    effectifFemmeRef: number[];
}
export class BlocVigieRHViewModel {

    public etablissementTerritorialVRMedicoSocial: EtablissementTerritorialMedicoSocialVigieRH;

    constructor(etablissementTerritorialVRMedicoSocial: EtablissementTerritorialMedicoSocialVigieRH) {
        this.etablissementTerritorialVRMedicoSocial = etablissementTerritorialVRMedicoSocial;
    }


    public get lesAgesSontIlsRenseignees(): boolean {
        return true;
    }

    public get lesAgesSontIlsAutorisee(): boolean {
        return true;
    }

    public get dateDeMiseAJourPyramideDesAges(): string {
        return StringFormater.formatDate("2024-11-22");
    }

    public get lesLibellesTranchesAges(): string[] {
        return this.etablissementTerritorialVRMedicoSocial.tranchesAgesLibelles;
    }

    public get lesDonneesPyramideAges(): DonneesVigieRh[] {
        const labels = this.etablissementTerritorialVRMedicoSocial.tranchesAgesLibelles;
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
    }

}
