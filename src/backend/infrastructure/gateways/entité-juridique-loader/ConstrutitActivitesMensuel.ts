import { DateMiseÀJourFichierSourceModel } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { ActiviteSanitaireMensuel, ActivitesSanitaireMensuel } from "../../../métier/entities/ActivitesSanitaireMensuel";

export const construisActiviteMensuel = (
    activitesSanitaireMensuel: ActiviteSanitaireMensuel[],
    dateDeMiseAJourMenPmsiMensuel: DateMiseÀJourFichierSourceModel,
): ActivitesSanitaireMensuel => {

    return {
        dateDeMiseAJour: dateDeMiseAJourMenPmsiMensuel.dernièreMiseÀJour || '',
        activitesSanitaireMensuelList: activitesSanitaireMensuel
    };
}