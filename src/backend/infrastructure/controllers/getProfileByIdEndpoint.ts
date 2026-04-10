import { ProfilModel } from "../../../../database/models/ProfilModel";
import { ProfilesUseCase } from "../../métier/use-cases/ProfilesUseCase";
import { Dependencies } from "../dependencies";

export async function getProfileByIdEndpoint(dependencies: Dependencies, id: number): Promise<ProfilModel | null> {
  try {
    const ProfileUseCase = new ProfilesUseCase(dependencies.profileLoader);
    return await ProfileUseCase.getProfileById(id);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
