import { ProfileValue } from "../../../../database/models/ProfilModel";
import { ProfilesUseCase } from "../../métier/use-cases/ProfilesUseCase";
import { Dependencies } from "../dependencies";

export async function updateProfileEndpoint(dependencies: Dependencies, code: string, value: ProfileValue, name: string): Promise<void> {
    try {
        const ProfileUseCase = new ProfilesUseCase(dependencies.profileLoader);
        return await ProfileUseCase.updateProfile(code, value, name);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
