import { UtilisateurModel } from '../../../../database/models/UtilisateurModel';

export type RechercheUtilisateur = Omit<UtilisateurModel, 'password' | 'failedAttemps' | 'lockUntil' | 'lastPwdChangeDate'>;

export type ResultatRechercheUtilisateur = {
  data: RechercheUtilisateur[];
  total: number;
  keyWord: string;
  currentPage: number;
  lastPage: number;
  itemsPerPage: number;
};
