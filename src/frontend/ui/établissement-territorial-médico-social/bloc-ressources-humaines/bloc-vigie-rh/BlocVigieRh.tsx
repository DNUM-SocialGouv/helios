import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuTauxOccupationHébergementPermanent } from "../../InfoBulle/ContenuTauxOccupationHébergementPermanent";
import styles from "../BlocRessourcesHumainesMédicoSocial.module.css"
import { BlocVigieRHViewModel } from "./BlocVigieRHViewModel";
import PyramidChart from "./GraphiquePyramide";
import LineChart from "./GraphiqueLine";

type BlocVigieRHProps = Readonly<{
    blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

export const BlocVigieRH = ({
    blocVigieRHViewModel
}: BlocVigieRHProps) => {
    const { wording } = useDependencies();
    return (
        <ul className={`indicateurs ${styles["liste-indicateurs-vr"]}`}>
            {blocVigieRHViewModel.lesAgesSontIlsRenseignees && blocVigieRHViewModel.lesAgesSontIlsAutorisee ? (
                <IndicateurGraphique
                    années={{ liste: [2023, 2024, 2025], setAnnéeEnCours: () => { } }}
                    contenuInfoBulle={
                        <ContenuTauxOccupationHébergementPermanent
                            dateDeMiseÀJour={blocVigieRHViewModel.dateDeMiseAJourPyramideDesAges}
                            source={wording.CNSA}
                        />
                    }
                    identifiant="activite-0"
                    nomDeLIndicateur={wording.PYRAMIDE_DES_AGES}
                >
                    <>
                    <PyramidChart />
                    <LineChart/>
                    </>
                </IndicateurGraphique>
            ) : <></>
            }
        </ul >
    );
};
