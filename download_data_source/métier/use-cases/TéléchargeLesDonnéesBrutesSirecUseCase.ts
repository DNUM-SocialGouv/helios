import { HeliosError } from "../../infrastructure/HeliosError";
import { DownloadRawData } from "../gateways/DownloadRawData";

export class TéléchargeLesDonnéesBrutesSirecUseCase {
  constructor(private readonly sirecDownloadRawData: DownloadRawData) {}

  async exécute() {
    try {
      await this.sirecDownloadRawData.exécute();
    } catch (error) {
      throw new HeliosError(error.message);
    }
  }
}
