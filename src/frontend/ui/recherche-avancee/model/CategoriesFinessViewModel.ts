import { CategoriesFinessModel } from "../../../../../database/models/CategoriesFinessModel";

export class CategoriesFinessViewModel {
    constructor(private readonly categorie: CategoriesFinessModel | null) { }

    public get categorieCode(): string {
        return this.categorie?.code ?? "";
    }

    public get categorieLibelle(): string {
        return this.categorie?.libelle ?? "";
    }

    public get categorieLibelleCourt(): string {
        return this.categorie?.libelleCourt ?? "";
    }

    public get categorieDomaine(): string {
        return this.categorie?.domaine ?? "";
    }

    public get categorieLibelleRecherche(): string {
        return this.categorie?.libelle.replaceAll('.', '').toLowerCase() ?? "";
    }

    public get categorieLibelleCourtRecherche(): string {
        return this.categorie?.libelleCourt.replaceAll('.', '').toLowerCase() ?? "";
    }

}
