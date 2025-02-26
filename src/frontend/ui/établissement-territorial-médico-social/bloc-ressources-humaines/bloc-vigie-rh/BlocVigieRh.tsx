import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuTauxOccupationHébergementPermanent } from "../../InfoBulle/ContenuTauxOccupationHébergementPermanent";
import styles from "../BlocRessourcesHumainesMédicoSocial.module.css"
import { BlocVigieRHViewModel } from "./BlocVigieRHViewModel";
import PyramidChart from "./GraphiquePyramide";
import LineChart from "./GraphiqueLine";
import ColorLabel from "../../../commun/ColorLabel/ColorLabel";
import { SeparatorHorizontal } from "../../../commun/Separateur/SeparatorHorizontal";

type BlocVigieRHProps = Readonly<{
    blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

export const BlocVigieRH = ({
    blocVigieRHViewModel
}: BlocVigieRHProps) => {
    const { wording } = useDependencies();
    return (
        <>
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
                        <PyramidChart />
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
                    identifiant="activite-1"
                    nomDeLIndicateur={wording.EFFECTIFS}
                >
                    <>
                        <ColorLabel
                            classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
                            items={[
                                { color: "#E2CF58", label: "Catégorie" },
                                { color: "#FB926B", label: "Effectifs totaux" }
                            ]}
                        />
                        <div className="fr-grid-row">
                            <LineChart classContainer="fr-col-4 fr-mb-4w" categorieName="Nom de la catégorie" borderRight />
                            <LineChart classContainer="fr-col-4 fr-mb-4w" categorieName="Nom de la catégorie" borderRight />
                            <LineChart classContainer="fr-col-4 fr-mb-4w" categorieName="Nom de la catégorie" />
                            <LineChart classContainer="fr-col-4 fr-mb-4w" categorieName="Nom de la catégorie" borderRight />
                            <LineChart classContainer="fr-col-4 fr-mb-4w" categorieName="Nom de la catégorie" />
                        </div>
                    </>
                </IndicateurGraphique>

            ) : <></>
            }

        </>
    );
};
