import { ProfilesUseCase } from "../../métier/use-cases/ProfilesUseCase";
import { Dependencies } from "../dependencies";

export async function deleteProfileEndpoint(dependencies: Dependencies, profileId: number): Promise<string | void> {
    try {
        const ProfileUseCase = new ProfilesUseCase(dependencies.profileLoader);
        return await ProfileUseCase.deleteProfile(profileId);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
