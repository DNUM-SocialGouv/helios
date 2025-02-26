import { useEffect, useState } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuTauxOccupationHébergementPermanent } from "../../InfoBulle/ContenuTauxOccupationHébergementPermanent";
import styles from "../BlocRessourcesHumainesMédicoSocial.module.css"
import { BlocVigieRHViewModel, DonneesVigieRh } from "./BlocVigieRHViewModel";
import PyramidChart from "./GraphiquePyramide";

type BlocVigieRHProps = Readonly<{
    blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

export const BlocVigieRH = ({
    blocVigieRHViewModel
}: BlocVigieRHProps) => {
    const { wording } = useDependencies();
    const donneesPyramides = blocVigieRHViewModel.lesDonneesPyramideAges;
    const annees = donneesPyramides.map((donneeAnnuel) => donneeAnnuel.annee).sort((a, b) => a - b);
    const [anneeEnCours, setAnneeEnCours] = useState<number>(annees[annees.length - 1]);
    const [donneesAnneeEnCours, setDonneesAnneeEnCours] = useState<DonneesVigieRh>();

    useEffect(() => {
        setDonneesAnneeEnCours(donneesPyramides.filter((donneeAnnuel) => donneeAnnuel.annee === anneeEnCours)[0])
    }, [anneeEnCours])

    return (
        <ul className={`indicateurs ${styles["liste-indicateurs-vr"]}`}>
            {blocVigieRHViewModel.lesAgesSontIlsRenseignees && blocVigieRHViewModel.lesAgesSontIlsAutorisee ? (
                <IndicateurGraphique
                    années={{ liste: annees, setAnnéeEnCours: setAnneeEnCours }}
                    contenuInfoBulle={
                        <ContenuTauxOccupationHébergementPermanent
                            dateDeMiseÀJour={blocVigieRHViewModel.dateDeMiseAJourPyramideDesAges}
                            source={wording.CNSA}
                        />
                    }
                    identifiant="vr-pyramide-ages"
                    nomDeLIndicateur={wording.PYRAMIDE_DES_AGES}
                >
                    <>
                        {donneesAnneeEnCours?.effectifFemmeRef && donneesAnneeEnCours?.effectifHomme &&
                            <PyramidChart effectifFemme={donneesAnneeEnCours?.effectifFemme ?? []}
                                effectifFemmeRef={donneesAnneeEnCours?.effectifFemmeRef}
                                effectifHomme={donneesAnneeEnCours?.effectifHomme ?? []}
                                effectifHommeRef={donneesAnneeEnCours?.effectifHommeRef}
                            />}
                    </>
                </IndicateurGraphique>
            ) : <></>
            }
        </ul >
    );
};
