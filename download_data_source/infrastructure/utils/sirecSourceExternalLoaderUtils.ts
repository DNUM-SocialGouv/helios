export function containsCommaOrDotNumbers(row: Record<string, any>): boolean {
    const values = Object.values(row);
    return values.some((value) => typeof value === "string" && /^(\d+,\d+|\d+\.\d+)$/.test(value));
}

// Fonction pour vérifier si une année est valide (l'année en cours ou les 3 dernières années)
export function isValidYear(year: number): boolean {
    const currentYear = new Date().getFullYear();
    return year >= currentYear - 4 && year <= currentYear;
}

// Fonction pour vérifier si NDEG_FINESS_RPPS contient un nombre de 9 chiffres
export function isValidFinessRpps(value: string): boolean {
    return /^\d{9}$/.test(value);
}

export function containsNegativeNumbers(row: Record<string, any>): boolean {
    const values = Object.values(row);
    return values.some((value) => (typeof value === "number" && isNaN(value)) || value < 0);
}

export function verifValeursManquantes(row: Record<string, any>) {
    if (
        (parseInt(row["ENCOURS_NB_RECLA_TOTAL"]) ||
            parseInt(row["ENCOURS_NB_RECLA_MOTIF_10"]) ||
            parseInt(row["ENCOURS_NB_RECLA_MOTIF_11"]) ||
            parseInt(row["ENCOURS_NB_RECLA_MOTIF_12"]) ||
            parseInt(row["ENCOURS_NB_RECLA_MOTIF_13"]) ||
            parseInt(row["ENCOURS_NB_RECLA_MOTIF_14"]) ||
            parseInt(row["ENCOURS_NB_RECLA_MOTIF_15"]) ||
            parseInt(row["ENCOURS_NB_RECLA_MOTIF_16"]) ||
            parseInt(row["ENCOURS_NB_RECLA_MOTIF_17"]) ||
            parseInt(row["ENCOURS_NB_RECLA_MOTIF_18"]) ||
            parseInt(row["ENCOURS_NB_RECLA_MOTIF_19"]) ||
            parseInt(row["ENCOURS_NB_RECLA_MOTIF_155"]) ||
            parseInt(row["ENCOURS_NB_RECLA_MOTIF_156"])) &&
        (parseInt(row["CLOT_NB_RECLA_TOTAL"]) ||
            parseInt(row["CLOT_NB_RECLA_MOTIF_10"]) ||
            parseInt(row["CLOT_NB_RECLA_MOTIF_11"]) ||
            parseInt(row["CLOT_NB_RECLA_MOTIF_12"]) ||
            parseInt(row["CLOT_NB_RECLA_MOTIF_13"]) ||
            parseInt(row["CLOT_NB_RECLA_MOTIF_14"]) ||
            parseInt(row["CLOT_NB_RECLA_MOTIF_15"]) ||
            parseInt(row["CLOT_NB_RECLA_MOTIF_16"]) ||
            parseInt(row["CLOT_NB_RECLA_MOTIF_17"]) ||
            parseInt(row["CLOT_NB_RECLA_MOTIF_18"]) ||
            parseInt(row["CLOT_NB_RECLA_MOTIF_19"]) ||
            parseInt(row["CLOT_NB_RECLA_MOTIF_155"]) ||
            parseInt(row["CLOT_NB_RECLA_MOTIF_156"]))
    ) {
        return false;
    }
    return true;
}

// Fonction pour vérifier si ENCOURS_NB_RECLA_TOTAL est égal à la somme
export function verifierSommeEnCoursEgaleTotal(row: Record<string, any>) {
    const total = parseInt(row["ENCOURS_NB_RECLA_TOTAL"]) || 0;
    const somme = calculerSommeEnCours(row);
    return total === somme;
}

// Fonction pour vérifier si Clot_NB_RECLA_TOTAL est égal à la somme
export function verifierSommeClotEgaleTotal(row: Record<string, any>) {
    const total = parseInt(row["CLOT_NB_RECLA_TOTAL"]) || 0;
    const somme = calculerSommeClot(row);
    return total === somme;
}


function calculerSommeClot(row: Record<string, any>): number {
    const colonnes = [
        "CLOT_NB_RECLA_MOTIF_10",
        "CLOT_NB_RECLA_MOTIF_11",
        "CLOT_NB_RECLA_MOTIF_12",
        "CLOT_NB_RECLA_MOTIF_13",
        "CLOT_NB_RECLA_MOTIF_14",
        "CLOT_NB_RECLA_MOTIF_15",
        "CLOT_NB_RECLA_MOTIF_16",
        "CLOT_NB_RECLA_MOTIF_17",
        "CLOT_NB_RECLA_MOTIF_18",
        "CLOT_NB_RECLA_MOTIF_19",
        "CLOT_NB_RECLA_MOTIF_155",
        "CLOT_NB_RECLA_MOTIF_156",
    ];
    let somme = 0;
    colonnes.forEach((colonne) => {
        somme += parseInt(row[colonne]) || 0;
    });
    return somme;
}

// Fonction pour calculer la somme des colonnes spécifiées
function calculerSommeEnCours(row: Record<string, any>) {
    const colonnes = [
        "ENCOURS_NB_RECLA_MOTIF_10",
        "ENCOURS_NB_RECLA_MOTIF_11",
        "ENCOURS_NB_RECLA_MOTIF_12",
        "ENCOURS_NB_RECLA_MOTIF_13",
        "ENCOURS_NB_RECLA_MOTIF_14",
        "ENCOURS_NB_RECLA_MOTIF_15",
        "ENCOURS_NB_RECLA_MOTIF_16",
        "ENCOURS_NB_RECLA_MOTIF_17",
        "ENCOURS_NB_RECLA_MOTIF_18",
        "ENCOURS_NB_RECLA_MOTIF_19",
        "ENCOURS_NB_RECLA_MOTIF_155",
        "ENCOURS_NB_RECLA_MOTIF_156",
    ];
    let somme = 0;
    colonnes.forEach((colonne) => {
        somme += parseInt(row[colonne]) || 0;
    });
    return somme;
}
