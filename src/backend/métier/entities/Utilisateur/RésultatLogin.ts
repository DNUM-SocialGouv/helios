import { Utilisateur } from "./Utilisateur";

export type RésultatLogin = {
    utilisateur: Utilisateur | null;
} | null;
