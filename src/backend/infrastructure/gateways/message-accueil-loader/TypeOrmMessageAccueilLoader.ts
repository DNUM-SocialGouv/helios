import { DataSource } from "typeorm";

import { MessageAccueilModel } from "../../../../../database/models/MessageAccueilModel";
import { MessageAccueilLoader } from "../../../métier/gateways/MessageAccueilLoader";

export class TypeOrmMessageAccueilLoader implements MessageAccueilLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async save(contenu: string, dateDebut: string, dateFin: string | null, badgeType: string | null, badgeLibelle: string | null): Promise<void> {
    const messageAccueil = new MessageAccueilModel();
    messageAccueil.contenu = contenu;
    messageAccueil.dateDebut = dateDebut;
    messageAccueil.dateFin = dateFin;
    messageAccueil.badgeType = badgeType;
    messageAccueil.badgeLibelle = badgeLibelle;
    await (await this.orm).getRepository(MessageAccueilModel).save(messageAccueil);
  }
}
