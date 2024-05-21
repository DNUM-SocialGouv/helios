import { HeliosError } from "../../infrastructure/HeliosError";
import { DownloadRawData } from "../gateways/DownloadRawData";

export class TéléchargeLesDonnéesBrutesSiiceaUseCase {
  constructor(private readonly siiceaDownloadRawData: DownloadRawData) { }

  async exécute() {
    try {
      await this.siiceaDownloadRawData.exécute();
    } catch (error) {
      throw new HeliosError(error.message);
    }
  }
}
