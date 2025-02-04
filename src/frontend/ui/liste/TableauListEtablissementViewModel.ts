import { RechercheViewModel } from "../home/RechercheViewModel";

export class TableauListEtalblissementViewModel {
    constructor(readonly recherche: RechercheViewModel, readonly dateCreation: Date) { }
}