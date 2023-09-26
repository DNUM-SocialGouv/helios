import { ProfilModel } from "../../../../database/models/ProfilModel";

export interface ProfileLoader {
    getAllProfiles(): Promise<ProfilModel[]>;
}