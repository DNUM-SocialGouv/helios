import { Utilisateur } from "./Utilisateur";

export enum LoginStatusEnum {
  BLOCKED = "blocked account",
  WRONG_CREDENTIALS = "wrong credentials",
}

export type RésultatLogin = {
  utilisateur: Utilisateur;
} | LoginStatusEnum;

export enum PasswordStatusEnum {
  OK = "ok",
  EXPIRED = "expired",
  WARNING = "warning",
}

export type PasswordStatus = | { status: PasswordStatusEnum.OK }
  | { status: PasswordStatusEnum.EXPIRED }
  | { status: PasswordStatusEnum.WARNING; daysLeft: number };
