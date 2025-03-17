import { VigieRhContratModel } from "../../../../../database/models/vigie_rh/VigieRhContratModel";

export interface VigieRhContratLoader {
  getAllContratParNumFiness(numeroFiness : string):Promise<VigieRhContratModel[]>;
}