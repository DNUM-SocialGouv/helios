import { useEffect, useState } from "react";

import { ColorLabel } from "../../../commun/ColorLabel/ColorLabel";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { SeparatorHorizontal } from "../../../commun/Separateur/SeparatorHorizontal";
import { ContenuTauxOccupationHébergementPermanent } from "../../InfoBulle/ContenuTauxOccupationHébergementPermanent";
import styles from "../BlocRessourcesHumainesMédicoSocial.module.css"
import { BlocVigieRHViewModel, DonneesVigieRh } from "./BlocVigieRHViewModel";
import LineChart from "./GraphiqueLine";
import PyramidChart from "./GraphiquePyramide";

type BlocVigieRHProps = Readonly<{
    blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

export const BlocVigieRH = ({
    blocVigieRHViewModel
}: BlocVigieRHProps) => {
    const { wording } = useDependencies();
    const donneesPyramides = blocVigieRHViewModel.lesDonneesPyramideAges;
    const libelles = blocVigieRHViewModel.lesLibellesTranchesAges;
    const annees = donneesPyramides.map((donneeAnnuel) => donneeAnnuel.annee).sort((a, b) => a - b);
    const [anneeEnCours, setAnneeEnCours] = useState<number>(annees[annees.length - 1]);
    const [donneesAnneeEnCours, setDonneesAnneeEnCours] = useState<DonneesVigieRh>();

    const donneesEffectifs = blocVigieRHViewModel.lesDonneesEffectifs;

    const couleurCategorie = "#E2CF58"  // jaune
    const couleurEffectifsTottaux = "#FB926B"  // orange

    useEffect(() => {
        setDonneesAnneeEnCours(donneesPyramides.filter((donneeAnnuel) => donneeAnnuel.annee === anneeEnCours)[0])
    }, [anneeEnCours])

    return (
        <>
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
                                    labels={libelles}
                                />}
                        </>
                    </IndicateurGraphique>
                ) : <></>
                }
            </ul >

            <SeparatorHorizontal></SeparatorHorizontal>

            {blocVigieRHViewModel.lesEffectifsSontIlsRenseignees && blocVigieRHViewModel.lesEffectifsSontIlsAutorisee ? (
                <IndicateurGraphique
                    contenuInfoBulle={
                        <ContenuTauxOccupationHébergementPermanent
                            dateDeMiseÀJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                            source={wording.CNSA}
                        />
                    }
                    identifiant="vr-effectifs"
                    nomDeLIndicateur={wording.EFFECTIFS}
                >
                    <>
                        <ColorLabel
                            classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
                            items={[
                                { color: couleurCategorie, label: wording.VIGIE_RH_CATEGORIE },
                                { color: couleurEffectifsTottaux, label: wording.EFFECTIFS_TOTAUX }
                            ]}
                        />

                        <div className="fr-grid-row">
                            {donneesEffectifs.map((item, index) => (
                                <LineChart
                                    borderRight={!( (index + 1) % 3 === 0 || index === donneesEffectifs.length - 1 )}
                                    categorieName={item.categorie}
                                    couleurCategorie={couleurCategorie}
                                    couleurEffectifsTottaux={couleurEffectifsTottaux}
                                    classContainer="fr-col-4 fr-mb-4w"
                                    dataEffectifs={item.data}
                                    key={item.categorie}
                                />
                            ))}
                        </div>
                    </>
                </IndicateurGraphique>

            ) : <></>
            }

        </>
    );
};
