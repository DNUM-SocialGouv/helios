import { HeliosError } from "../../infrastructure/HeliosError";
import { DownloadRawData } from "../gateways/DownloadRawData";
import { UnzipRawData } from "../gateways/UnzipRawData";

export class TéléchargeLesDonnéesBrutesDeFinessUseCase {
  constructor(private readonly finessDownloadRawData: DownloadRawData, private readonly unzipRawData: UnzipRawData) {}

  async exécute() {
    try {
      await this.finessDownloadRawData.exécute();
    } catch (error) {
      throw new HeliosError(error.message);
    }

    try {
      await this.unzipRawData.exécute("FINESS", "finess");
    } catch (error) {
      throw new HeliosError(error.message);
    }
  }
}
