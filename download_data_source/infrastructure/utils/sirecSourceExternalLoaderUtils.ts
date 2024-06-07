export function containsCommaOrDotNumbers(row: Record<string, any>): boolean {
    const values = Object.values(row);
    return values.some((value) => typeof value === "string" && /^(\d+,\d+|\d+\.\d+)$/.test(value));
}

<<<<<<< HEAD
// Fonction pour vérifier si une année est valide (l'année en cours ou les 5 dernières années)
export function isValidYear(year: number): boolean {
    const currentYear = new Date().getFullYear();
    return year >= currentYear - 5 && year <= currentYear;
=======
// Fonction pour vérifier si une année est valide (l'année en cours ou les 3 dernières années)
export function isValidYear(year: number): boolean {
    const currentYear = new Date().getFullYear();
    return year >= currentYear - 4 && year <= currentYear;
>>>>>>> origin/master
}

// Fonction pour vérifier si NDEG_FINESS_RPPS contient un nombre de 9 chiffres
export function isValidFinessRpps(value: string): boolean {
    return /^([a-zA-Z0-9_-]){9}$/.test(value);
}

export function containsNegativeNumbers(row: Record<string, any>): boolean {
    const values = Object.values(row);
    return values.some((value) => (typeof value === "number" && isNaN(value)) || value < 0);
}

// Fonction pour vérifier si ENCOURS_NB_RECLA_TOTAL est supérieur ou égal à la somme
export function verifierSommeEnCoursSupOuEgaleTotal(row: Record<string, any>) {
    const total = parseInt(row["ENCOURS_NB_RECLA_TOTAL"]) || 0;
    const somme = calculerSommeEnCours(row);
    return somme >= total;
}

// Fonction pour vérifier si Clot_NB_RECLA_TOTAL est supérieur ou égal à la somme
export function verifierSommeClotSupOuEgaleTotal(row: Record<string, any>) {
    const total = parseInt(row["CLOT_NB_RECLA_TOTAL"]) || 0;
    const somme = calculerSommeClot(row);
    return somme >= total;
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
