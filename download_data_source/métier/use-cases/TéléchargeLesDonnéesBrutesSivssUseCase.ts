import { HeliosError } from "../../infrastructure/HeliosError";
import { DownloadRawData } from "../gateways/DownloadRawData";

export class TéléchargeLesDonnéesBrutesSivssUseCase {
  constructor(private readonly sivssDownloadRawData: DownloadRawData) { }

  async exécute() {
    try {
      await this.sivssDownloadRawData.exécute();
    } catch (error) {
      throw new HeliosError(error.message);
    }
  }
}
