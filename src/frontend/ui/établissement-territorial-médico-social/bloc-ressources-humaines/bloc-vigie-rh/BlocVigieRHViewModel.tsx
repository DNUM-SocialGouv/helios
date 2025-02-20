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

}
