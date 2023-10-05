import { ProfilModel } from "../../../../database/models/ProfilModel";
import { ProfilesUseCase } from "../../métier/use-cases/ProfilesUseCase";
import { Dependencies } from "../dependencies";

export async function getProfileByCodeEndpoint(dependencies: Dependencies, code: string): Promise<ProfilModel | null> {
    try {
        const ProfileUseCase = new ProfilesUseCase(dependencies.profileLoader);
        return await ProfileUseCase.getProfileByCode(code);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
