import { Utilisateur } from "./Utilisateur";

export type RésultatLogin = {
  utilisateur: Utilisateur;
} | string;

export enum PasswordStatusEnum {
  OK = "ok",
  EXPIRED = "expired",
  WARNING = "warning",
}

export type PasswordStatus = | { status: PasswordStatusEnum.OK }
  | { status: PasswordStatusEnum.EXPIRED }
  | { status: PasswordStatusEnum.WARNING; daysLeft: number };
