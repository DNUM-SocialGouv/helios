import { Utilisateur } from "./Utilisateur";

export type RésultatLogin = {
  utilisateur: Utilisateur | null;
} | null;

export type PasswordStatus = | { status: "ok" }
  | { status: "expired" }
  | { status: "warning"; daysLeft: number };
