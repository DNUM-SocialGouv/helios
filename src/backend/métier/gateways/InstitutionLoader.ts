import { InstitutionModel } from "../../../../database/models/InstitutionModel";

export interface InstitutionLoader {
  getInstitutionByCode(code: string): Promise<InstitutionModel | null>;
}
