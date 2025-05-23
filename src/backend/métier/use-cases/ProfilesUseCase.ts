import { ProfilModel, ProfileValue } from "../../../../database/models/ProfilModel";
import { ProfileLoader } from "../gateways/ProfileLoader";

export class ProfilesUseCase {
  constructor(private readonly profileLoader: ProfileLoader) { }

  async getAllProfiles(): Promise<ProfilModel[]> {
    return await this.profileLoader.getAllProfiles();
  }

  async getProfileByCode(code: string): Promise<ProfilModel | null> {
    return await this.profileLoader.getProfileByCode(code);
  }

  async updateProfile(code: string, value: ProfileValue, name: string): Promise<void> {
    return await this.profileLoader.updateProfileValue(code, value, name);
  }

  async deleteProfile(idProfile: number): Promise<string> {
    return await this.profileLoader.deleteProfile(idProfile);
  }

  async addNewProfile(label: string, value: ProfileValue, userId: string): Promise<void> {
    return await this.profileLoader.addNewProfile(label, value, userId);
  }
}
