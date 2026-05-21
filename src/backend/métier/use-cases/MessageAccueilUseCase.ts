import { MessageAccueilLoader } from "../gateways/MessageAccueilLoader";

export class MessageAccueilUseCase {
  constructor(private readonly messageAccueilLoader: MessageAccueilLoader) {}

  async exécute(contenu: string, dateDebut: string, dateFin: string | null, badgeType: string | null, badgeLibelle: string | null): Promise<void> {
    await this.messageAccueilLoader.save(contenu, dateDebut, dateFin, badgeType, badgeLibelle);
  }
}
