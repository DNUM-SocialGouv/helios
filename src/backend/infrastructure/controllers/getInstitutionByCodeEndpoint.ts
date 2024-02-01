import { InstitutionModel } from "../../../../database/models/InstitutionModel";
import { InstitutionsUseCase } from "../../métier/use-cases/InstitutionsUseCase";
import { Dependencies } from "../dependencies";

export async function getInstitutionByCodeEndpoint(dependencies: Dependencies, code: string): Promise<InstitutionModel | null> {
  try {
    const InstitutionUseCase = new InstitutionsUseCase(dependencies.institutionLoader);
    return await InstitutionUseCase.getInstitutionByCode(code);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
