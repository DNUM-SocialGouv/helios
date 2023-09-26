import { ProfilModel } from "../../../../database/models/ProfilModel";
import { ProfileLoader } from "../gateways/ProfileLoader";

export class ProfilesUseCase {
    constructor(private profileLoader: ProfileLoader) { }

    async getAllProfiles(): Promise<ProfilModel[]> {
        return await this.profileLoader.getAllProfiles();
    }
}