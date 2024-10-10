import { HeliosError } from "../../infrastructure/HeliosError";
import { DownloadRawData } from "../gateways/DownloadRawData";

export class TéléchargeLesDonnéesBrutesHapiUseCase {
  constructor(private readonly hapiDownloadRawData: DownloadRawData) { }

  async exécute() {
    try {
      await this.hapiDownloadRawData.exécute();
    } catch (error) {
      throw new HeliosError(error.message);
    }
  }
}
