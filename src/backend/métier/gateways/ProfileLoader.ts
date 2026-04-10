import { ProfilModel, ProfileValue } from "../../../../database/models/ProfilModel";

export interface ProfileLoader {
  getAllProfiles(): Promise<ProfilModel[]>;
  getProfileByCode(code: string): Promise<ProfilModel | null>;
  getProfileById(idProfile: number): Promise<ProfilModel | null>;
  updateProfileValue(code: string, value: ProfileValue, name: string): Promise<void>;
  addNewProfile(label: string, value: ProfileValue, userId: string): Promise<void>;
  deleteProfile(idProfile: number): Promise<string>;
}
