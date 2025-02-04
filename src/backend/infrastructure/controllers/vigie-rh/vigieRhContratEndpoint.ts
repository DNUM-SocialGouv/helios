import { VigieRhContratModel } from "../../../../../database/models/vigie_rh/VigieRhContratModel";
import { ContratUseCase } from "../../../métier/use-cases/vigie-rh/ContratUseCase";
import { Dependencies } from "../../dependencies";

export async function vigieRhContratEndpoint(dependencies: Dependencies, numFiness: string): Promise<VigieRhContratModel[]> {
    try {
        const vigieRhContratUseCase = new ContratUseCase(dependencies.vigieRhContratLoader);
        return await vigieRhContratUseCase.getVigieRhContrat(numFiness);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}