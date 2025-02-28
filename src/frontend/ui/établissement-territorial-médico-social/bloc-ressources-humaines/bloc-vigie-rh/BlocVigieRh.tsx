import { useEffect, useState } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../../commun/notAuthorized/Notauthorized";
import { ContenuPyramideDesAges } from "../../InfoBulle/ContenuPyramideDesAges";
import styles from "../BlocRessourcesHumainesMédicoSocial.module.css"
import { BlocVigieRHViewModel, DonneesVigieRh } from "./BlocVigieRHViewModel";
import PyramidChart from "./GraphiquePyramide";

type BlocVigieRHProps = Readonly<{
    blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

const ListeIndicateursNonAutorisesOuNonRenseignes = ({
    blocVigieRHViewModel,
}: BlocVigieRHProps) => {
    if (blocVigieRHViewModel.lesDonneesVgRHPasAutorises.length !== 0) {
        return <NotAUthorized indicateurs={blocVigieRHViewModel.lesDonneesVgRHPasAutorises} />
    } else if (blocVigieRHViewModel.lesDonneesVgRHPasRenseignees.length !== 0) {
        return <NoDataCallout indicateurs={blocVigieRHViewModel.lesDonneesVgRHPasRenseignees} />
    } else {
        return <></>
    }
}


export const BlocVigieRH = ({
    blocVigieRHViewModel
}: BlocVigieRHProps) => {
    const { wording } = useDependencies();
    const donneesPyramides = blocVigieRHViewModel.lesDonneesPyramideAges;
    const libelles = blocVigieRHViewModel.lesLibellesTranchesAges;
    const annees = donneesPyramides.map((donneeAnnuel) => donneeAnnuel.annee).sort((a, b) => a - b);
    const [anneeEnCours, setAnneeEnCours] = useState<number>(annees[annees.length - 1]);
    const [donneesAnneeEnCours, setDonneesAnneeEnCours] = useState<DonneesVigieRh>();

    useEffect(() => {
        setDonneesAnneeEnCours(donneesPyramides.filter((donneeAnnuel) => donneeAnnuel.annee === anneeEnCours)[0])
    }, [anneeEnCours])

    if (blocVigieRHViewModel.lesDonneesVigieRHNeSontPasRenseignees) {
        return <div>{wording.INDICATEURS_VIDES}</div>
    }

    return (
        <>
            <ListeIndicateursNonAutorisesOuNonRenseignes blocVigieRHViewModel={blocVigieRHViewModel} />
            <ul className={`indicateurs ${styles["liste-indicateurs-vr"]}`}>
                {!blocVigieRHViewModel.lesAgesNeSontIlsPasRenseignees && !blocVigieRHViewModel.lesAgesNeSontIlsPasAutorisee ? (
                    <IndicateurGraphique
                        années={{ liste: annees, setAnnéeEnCours: setAnneeEnCours }}
                        contenuInfoBulle={
                            <ContenuPyramideDesAges />
                        }
                        identifiant="vr-pyramide-ages"
                        nomDeLIndicateur={wording.PYRAMIDE_DES_AGES}
                    >
                        <>
                            {donneesAnneeEnCours?.effectifFemmeRef && donneesAnneeEnCours?.effectifHomme &&
                                donneesAnneeEnCours?.effectifFemme && donneesAnneeEnCours?.effectifHommeRef &&
                                <PyramidChart effectifFemme={donneesAnneeEnCours?.effectifFemme ?? []}
                                    effectifFemmeRef={donneesAnneeEnCours?.effectifFemmeRef}
                                    effectifHomme={donneesAnneeEnCours?.effectifHomme ?? []}
                                    effectifHommeRef={donneesAnneeEnCours?.effectifHommeRef}
                                    labels={libelles}
                                />}
                        </>
                    </IndicateurGraphique>
                ) : <></>
                }
            </ul >
        </>
    );
};
