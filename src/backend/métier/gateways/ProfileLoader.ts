import { ProfilModel } from "../../../../database/models/ProfilModel";

export interface ProfileLoader {
    getAllProfiles(): Promise<ProfilModel[]>;
    getProfileByCode(code: string): Promise<ProfilModel | null>;
}