import { VigieRhContratModel } from "../../../../../database/models/vigie_rh/VigieRhContratModel";
import { VigieRhContratLoader } from "../../gateways/vigie-rh/VigieRhContratLoader";

export class ContratUseCase {

    constructor(private vigieRhContratLoader: VigieRhContratLoader){}

    async getVigieRhContrat(numFiness:string):Promise<VigieRhContratModel[]>{
        return await this.vigieRhContratLoader.getAllContratParNumFiness(numFiness);
    }
}