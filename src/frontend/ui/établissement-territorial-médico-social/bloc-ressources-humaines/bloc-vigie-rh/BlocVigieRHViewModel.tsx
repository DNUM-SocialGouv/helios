import { StringFormater } from "../../../commun/StringFormater";


export class BlocVigieRHViewModel {

    public get lesAgesSontIlsRenseignees(): boolean {
        return true;
    }

    public get lesAgesSontIlsAutorisee(): boolean {
        return true;
    }

    public get dateDeMiseAJourPyramideDesAges(): string {
        return StringFormater.formatDate("2024-11-22");
    }

    public get lesEffectifsSontIlsRenseignees(): boolean {
        return true;
    }

    public get lesEffectifsSontIlsAutorisee(): boolean {
        return true;
    }

    public get dateDeMiseAJourEffectifs(): string {
        return StringFormater.formatDate("2024-11-22");
    }

}
