import { useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeVerticalABandes } from "../../commun/Graphique/HistogrammeVerticalABandes";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuNombreDeSéjourMCO } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDeSéjourMCO";
import { NombreDeSejourMCOViewModel } from "./NombreDeSejourMCOViewModel";

type GraphiqueNombreDeSejourMCOProps = Readonly<{
    nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
    estEntitéJuridique?: boolean;
}>;
export const GraphiqueNombreDeSejourMCOMensuelV3 = ({ nombreDeSejourMCOViewModel, estEntitéJuridique = false }: GraphiqueNombreDeSejourMCOProps) => {
    const { wording } = useDependencies();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [annéeEnCours, setAnnéeEnCours] = useState<number>(2022);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [moisDeDébut, setMoisDeDébut] = useState<string>("premier semestre");
    const annees = [2021, 2020]

    return (
        <IndicateurGraphique
            années={{ liste: annees, setAnnéeEnCours }}
            contenuInfoBulle={
                <ContenuNombreDeSéjourMCO
                    dateDeMiseÀJour={nombreDeSejourMCOViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique}
                    estEntitéJuridique={estEntitéJuridique}
                    source={wording.PMSI}
                />
            }
            dateDeMiseÀJour={nombreDeSejourMCOViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique}
            identifiant="activite-0"
            nomDeLIndicateur={wording.NOMBRE_DE_SÉJOUR_MCO}
            setSemester={setMoisDeDébut}
            source={wording.PMSI}
        >
            <HistogrammeVerticalABandes
                aRetravailler={true}
                annéesTotales={12}
                créeLeLibelléDuTooltip={nombreDeSejourMCOViewModel.tooltipSéjoursMCO}
                data={nombreDeSejourMCOViewModel.getHistogrammeMensuelV3DataSet(moisDeDébut)}
                id="légende-graphique-sanitaire-journées-séjours-mco-mensuel-v3"
                idDeLaLégende="légende-graphique-sanitaire-journées-séjours-mco-mensuel-v3"
                identifiants={nombreDeSejourMCOViewModel.getIdentifiantTableIndicateur()}
                libellés={nombreDeSejourMCOViewModel.années}
                valeurs={nombreDeSejourMCOViewModel.getValeurTableIndicateur()}
            />
        </IndicateurGraphique>
    );
};
