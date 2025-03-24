import { ÉtablissementTerritorialMédicoSocialActivitéViewModel } from "./ÉtablissementTerritorialMédicoSocialActivitéViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuDuTauxOccupationESMS } from "../InfoBulle/ContenuTauxOccupationESMS";


type IndicateursOccupationESMSProps = Readonly<{
    établissementTerritorialActivitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialActivitéViewModel;
}>;

export const IndicateursOccupationESMS = ({ établissementTerritorialActivitéMédicoSocialViewModel }: IndicateursOccupationESMSProps) => {
    const { wording } = useDependencies();

    return (
        <>
            {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationExternatEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationExternatEstIlAutorise ? <IndicateurGraphique
                contenuInfoBulle={
                    <ContenuDuTauxOccupationESMS
                        dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                        source={wording.CNSA}
                    />
                }
                dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                identifiant="activite-7"
                nomDeLIndicateur={wording.TAUX_OCCUPATION_EXTERNAT}
                source={wording.CNSA}
            >
                {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationExternat}
            </IndicateurGraphique> : <></>}
            {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationSemiInternatEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationSemiInternatEstIlAutorise ? <IndicateurGraphique
                contenuInfoBulle={
                    <ContenuDuTauxOccupationESMS
                        dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                        source={wording.CNSA}
                    />
                }
                dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                identifiant="activite-8"
                nomDeLIndicateur={wording.TAUX_OCCUPATION_SEMI_INTERNAT}
                source={wording.CNSA}
            >
                {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationSemiInternat}
            </IndicateurGraphique> : <></>}
            {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationInternatEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationInternatEstIlAutorise ? <IndicateurGraphique
                contenuInfoBulle={
                    <ContenuDuTauxOccupationESMS
                        dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                        source={wording.CNSA}
                    />
                }
                dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                identifiant="activite-9"
                nomDeLIndicateur={wording.TAUX_OCCUPATION_INTERNAT}
                source={wording.CNSA}
            >
                {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationInternat}
            </IndicateurGraphique> : <></>}
            {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationAutreEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationAutreEstIlAutorise ? <IndicateurGraphique
                contenuInfoBulle={
                    <ContenuDuTauxOccupationESMS
                        dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                        source={wording.CNSA}
                    />
                }
                dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                identifiant="activite-10"
                nomDeLIndicateur={wording.TAUX_OCCUPATION_AUTRE}
                source={wording.CNSA}
            >
                {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationAutre}
            </IndicateurGraphique> : <></>}
            {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationSeancesEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationSeancesEstIlAutorise ? <IndicateurGraphique
                contenuInfoBulle={
                    <ContenuDuTauxOccupationESMS
                        dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                        source={wording.CNSA}
                    />
                }
                dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
                identifiant="activite-11"
                nomDeLIndicateur={wording.TAUX_OCCUPATION_SEANCES}
                source={wording.CNSA}
            >
                {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationSeances}
            </IndicateurGraphique> : <></>}
        </>
    );
};
