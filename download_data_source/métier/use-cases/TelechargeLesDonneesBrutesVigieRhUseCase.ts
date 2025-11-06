import { HeliosError } from "../../infrastructure/HeliosError";
import { DownloadRawData } from "../gateways/DownloadRawData";

export class TelechargeLesDonneesBrutesVigieRhUseCase {
  constructor(private readonly vigieRhDownloadRawData: DownloadRawData) {}

  async exécute() {
    try {
      await this.vigieRhDownloadRawData.exécute();
    } catch (error: any) {
      throw new HeliosError(error.message);
    }
  }
}
