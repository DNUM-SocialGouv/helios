import { InstitutionModel } from "../../../../database/models/InstitutionModel";
import { InstitutionLoader } from "../gateways/InstitutionLoader";

export class InstitutionsUseCase {
  constructor(private readonly institutionLoader: InstitutionLoader) { }

  async getInstitutionByCode(code: string): Promise<InstitutionModel | null> {
    return await this.institutionLoader.getInstitutionByCode(code);
  }
}
