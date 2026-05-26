import { DataSource } from "typeorm";

import { MessageAccueilModel } from "../../../../../database/models/MessageAccueilModel";
import { MessageAccueil, MessageAccueilLoader, MessageAccueilChevauchement } from "../../../métier/gateways/MessageAccueilLoader";

export class TypeOrmMessageAccueilLoader implements MessageAccueilLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async save(contenu: string, dateDebut: string, dateFin: string , badgeType: string | null, badgeLibelle: string | null): Promise<void> {
    const messageAccueil = new MessageAccueilModel();
    messageAccueil.contenu = contenu;
    messageAccueil.dateDebut = dateDebut;
    messageAccueil.dateFin = dateFin;
    messageAccueil.badgeType = badgeType;
    messageAccueil.badgeLibelle = badgeLibelle;
    messageAccueil.isAffiche = true;
    await (await this.orm).getRepository(MessageAccueilModel).save(messageAccueil);
  }

  async findChevauchements(dateDebut: string, dateFin: string): Promise<MessageAccueilChevauchement[]> {
    const repository = (await this.orm).getRepository(MessageAccueilModel);
    const results = await repository
      .createQueryBuilder("m")
      .where("m.is_affiche = true")
      .andWhere(
        "(m.date_debut <= :dateFin AND m.date_fin >= :dateDebut)",
        { dateDebut, dateFin }
      )
      .getMany();

    return results.map((r) => ({
      contenu: r.contenu,
      dateDebut: r.dateDebut,
      dateFin: r.dateFin,
      id: r.id,
    }));
  }

  async desactiverMessages(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    const repository = (await this.orm).getRepository(MessageAccueilModel);
    await repository
      .createQueryBuilder()
      .update(MessageAccueilModel)
      .set({ isAffiche: false })
      .whereInIds(ids)
      .execute();
  }
  
  async getLastMessage(): Promise<MessageAccueil | null> {
    const today = new Date().toISOString().split("T")[0];
    const repository = (await this.orm).getRepository(MessageAccueilModel);
    const results = await repository
      .createQueryBuilder("m")
      .where("m.is_affiche = true")
      .andWhere("m.date_debut <= :today", { today })
      .andWhere("m.date_fin >= :today", { today })
      .orderBy("m.date_creation", "DESC")
      .limit(1)
      .getMany();
    return results[0] || null;
  }
}
