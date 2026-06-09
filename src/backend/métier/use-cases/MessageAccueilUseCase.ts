import { MessageAccueilChevauchement, MessageAccueilLoader } from "../gateways/MessageAccueilLoader";

export class MessageAccueilUseCase {
  constructor(private readonly messageAccueilLoader: MessageAccueilLoader) {}

  async execute(contenu: string, dateDebut: string, dateFin: string , badgeType: string | null, badgeLibelle: string | null, lienUrl: string | null, lienLibelle: string | null): Promise<void> {
    await this.messageAccueilLoader.save(contenu, dateDebut, dateFin, badgeType, badgeLibelle, lienUrl, lienLibelle);
  }

  async verifierChevauchements(dateDebut: string, dateFin: string): Promise<MessageAccueilChevauchement[]> {
    return this.messageAccueilLoader.findChevauchements(dateDebut, dateFin);
  }

  async desactiverMessages(ids: number[]): Promise<void> {
    await this.messageAccueilLoader.desactiverMessages(ids);
  }
}
