interface Attribues {
    entiteJuridque: string;
    etablissementSanitaire: string;
    etablissementMedicoSocial: string;
    statutPublic: string;
    statutPriveLucratif: string;
    statutPriveNonLucratif: string;
}

export const AttribuesDefaults: Attribues = {
    entiteJuridque: "Entité juridique",
    etablissementMedicoSocial: "Médico-social",
    etablissementSanitaire: "Sanitaire",
    statutPublic: "public",
    statutPriveLucratif: "prive_lucratif",
    statutPriveNonLucratif: "prive_non_lucratif"
}

export const typeStructureTranscodage: Record<string, string> = {
    "Entité juridique": "Etablissements Juridiques",
    "Médico-social": "Etablissements SMS",
    "Sanitaire": "Etablissements Sanitaires"
};