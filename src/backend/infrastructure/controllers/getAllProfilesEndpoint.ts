import { ProfilModel } from "../../../../database/models/ProfilModel";
import { ProfilesUseCase } from "../../métier/use-cases/ProfilesUseCase";
import { Dependencies } from "../dependencies";

export async function getAllProfilesEndpoint(dependencies: Dependencies): Promise<ProfilModel[]> {
    try {
        const ProfileUseCase = new ProfilesUseCase(dependencies.profileLoader);
        return await ProfileUseCase.getAllProfiles();
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
