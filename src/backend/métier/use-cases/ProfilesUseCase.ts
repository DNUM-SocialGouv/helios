import { ProfilModel, ProfileValue } from "../../../../database/models/ProfilModel";
import { ProfileLoader } from "../gateways/ProfileLoader";

export class ProfilesUseCase {
    constructor(private profileLoader: ProfileLoader) { }

    async getAllProfiles(): Promise<ProfilModel[]> {
        return await this.profileLoader.getAllProfiles();
    }

    async getProfileByCode(code: string): Promise<ProfilModel | null> {
        return await this.profileLoader.getProfileByCode(code);
    }

    async updateProfile(code: string, value: ProfileValue): Promise<void> {
        return await this.profileLoader.updateProfileValue(code, value);
    }

    async addNewProfile(label: string, value: ProfileValue): Promise<void> {
        return await this.profileLoader.addNewProfile(label, value);
    }
}