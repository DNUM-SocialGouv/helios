import { Institution } from "./Institution";
import { Role } from "./Role";

export type Utilisateur = {
    id: number;
    code: string;
    nom: string;
    prenom: string;
    email: string;
    institution: Institution;
    actif: boolean;
    role: Role;
    password?: string;
    dateCreation: Date;
    dateModification: Date;
    creePar: number;
    modifiePar: number;
};
