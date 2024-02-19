import { ProfileValue } from "../../../../database/models/ProfilModel";
import { ProfilesUseCase } from "../../métier/use-cases/ProfilesUseCase";
import { Dependencies } from "../dependencies";

export async function addProfileEndpoint(dependencies: Dependencies, label: string, value: ProfileValue, userId: string): Promise<void> {
    try {
        const ProfileUseCase = new ProfilesUseCase(dependencies.profileLoader);
        return await ProfileUseCase.addNewProfile(label, value, userId);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
