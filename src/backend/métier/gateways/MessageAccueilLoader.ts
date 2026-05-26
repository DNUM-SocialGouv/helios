export interface MessageAccueilChevauchement {
  id: number;
  contenu: string;
  dateDebut: string;
  dateFin: string | null;
}

export interface MessageAccueilLoader {
  save(contenu: string, dateDebut: string, dateFin: string | null, badgeType: string | null, badgeLibelle: string | null): Promise<void>;
  findChevauchements(dateDebut: string, dateFin: string): Promise<MessageAccueilChevauchement[]>;
  desactiverMessages(ids: number[]): Promise<void>;
}
