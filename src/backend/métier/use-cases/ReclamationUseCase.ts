import { ReclamationLoader } from "../gateways/ReclamationLoader";

export class ReclamationUseCase {
  constructor(private reclamationLoader: ReclamationLoader) {}

  async createReclamation(row: any): Promise<void> {
    return this.reclamationLoader.createReclamation(row);
  }
}
