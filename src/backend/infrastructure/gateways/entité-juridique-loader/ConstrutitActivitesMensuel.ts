import { DateMiseÀJourFichierSourceModel } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { ActiviteSanitaireMensuel, ActivitesSanitaireMensuel } from "../../../métier/entities/ActivitesSanitaireMensuel";

export const construisActiviteMensuel = (
    activitesSanitaireMensuelCumulé: ActiviteSanitaireMensuel[],
    dateDeMiseAJourMenPmsiMensuel: DateMiseÀJourFichierSourceModel,
): ActivitesSanitaireMensuel => {
    const previousValues: { [key: string]: number } = {};
    let previousYear: number | null = null;

    const activitesSanitaireMensuel = activitesSanitaireMensuelCumulé.map((entry, index) => {
        const newEntry: any = { année: entry.année, mois: entry.mois };

        for (const [key, value] of Object.entries(entry)) {
            if (key === 'année' || key === 'mois' || key === 'numeroFinessEtablissementTerritorial') {
                continue;
            }

            if (index === 0 || entry.année !== previousYear) {
                newEntry[key] = entry[key as keyof ActiviteSanitaireMensuel];
            } else {
                newEntry[key] = entry[key as keyof ActiviteSanitaireMensuel] - (previousValues[key] || 0);
            }

            previousValues[key] = value;
        }

        previousYear = entry.année;

        return newEntry;
    });

    return {
        dateDeMiseAJour: dateDeMiseAJourMenPmsiMensuel.dernièreMiseÀJour || '',
        activitesSanitaireMensuelList: activitesSanitaireMensuel
    };
}