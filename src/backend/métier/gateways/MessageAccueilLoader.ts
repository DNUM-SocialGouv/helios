export interface MessageAccueilLoader {
  save(contenu: string, dateDebut: string, dateFin: string | null, badgeType: string | null, badgeLibelle: string | null): Promise<void>;
}
