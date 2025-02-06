import { ProfilModel } from "../../../../database/models/ProfilModel";
import { DatesMisAjourSources, ResultatDeComparaison } from "../entities/ResultatDeComparaison";
import { ComparaisonLoader } from "../gateways/ComparaisonLoader";

export class ComparaisonEtablissementsUseCase {
    constructor(private comparaisonLoader: ComparaisonLoader) { }

    async exécute(
        type: string,
        numerosFiness: string[],
        annee: string,
        page: number,
        order: string,
        orderBy: string,
        forExport: boolean,
        codeRegion: string,
        profiles: ProfilModel[]
    ): Promise<ResultatDeComparaison> {
        return await this.comparaisonLoader.compare(type, numerosFiness, annee, page, order, orderBy, forExport, codeRegion, profiles);
    }

    async getAnneesComparaison(
        type: string,
        numerosFiness: string[],
    ): Promise<string[]> {
        return await this.comparaisonLoader.listeAnnees(type, numerosFiness);
    }

    async getDatesMisAJourSourcesComparaison(): Promise<DatesMisAjourSources> {
        return await this.comparaisonLoader.getDatesMisAJourSourcesComparaison();
    }

}
