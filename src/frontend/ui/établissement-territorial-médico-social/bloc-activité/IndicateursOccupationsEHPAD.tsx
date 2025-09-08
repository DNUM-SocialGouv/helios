import { ÉtablissementTerritorialMédicoSocialActivitéViewModel } from "./ÉtablissementTerritorialMédicoSocialActivitéViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuTauxOccupationAccueilDeJour } from "../InfoBulle/ContenuTauxOccupationAccueilDeJour";
import { ContenuTauxOccupationHébergementPermanent } from "../InfoBulle/ContenuTauxOccupationHébergementPermanent";
import { ContenuTauxOccupationHébergementTemporaire } from "../InfoBulle/ContenuTauxOccupationHébergementTemporaire";


type IndicateursOccupationEHPADProps = Readonly<{
    établissementTerritorialActivitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialActivitéViewModel;
}>;

export const IndicateursOccupationEHPAD = ({ établissementTerritorialActivitéMédicoSocialViewModel }: IndicateursOccupationEHPADProps) => {
    const { wording } = useDependencies();

    return (
        <>
            {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationHébergementPermanentEstIlRenseigné && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationHébergementPermanentEstIlAutorisé ? (
                <IndicateurGraphique
                    contenuInfoBulle={
                        <ContenuTauxOccupationHébergementPermanent
                            dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                            source={wording.CNSA}
                        />
                    }
                    dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                    identifiant="activite-0"
                    nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT}
                    source={wording.CNSA}
                >
                    {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationHébergementPermanent}
                </IndicateurGraphique>
            ) : <></>}
            {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationHébergementTemporaireEstIlRenseigné && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationHébergementTemporaireEstIlAutorisé ? (
                <IndicateurGraphique
                    contenuInfoBulle={
                        <ContenuTauxOccupationHébergementTemporaire
                            dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                            source={wording.CNSA}
                        />
                    }
                    dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                    identifiant="activite-1"
                    nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE}
                    source={wording.CNSA}
                >
                    {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationHébergementTemporaire}
                </IndicateurGraphique>
            ) : <></>}
            {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationAccueilDeJourEstIlRenseigné && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationAccueilDeJourEstIlAutorisé ? (
                <IndicateurGraphique
                    contenuInfoBulle={
                        <ContenuTauxOccupationAccueilDeJour
                            dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                            source={wording.CNSA}
                        />
                    }
                    dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                    identifiant="activite-2"
                    nomDeLIndicateur={wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR}
                    source={wording.CNSA}
                >
                    {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationAccueilDeJour}
                </IndicateurGraphique>
            ) : <></>}
        </>
    );
};
