import { ÉtablissementTerritorialMédicoSocialActivitéViewModel } from "./ÉtablissementTerritorialMédicoSocialActivitéViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuDuTauxOccupationESMS } from "../InfoBulle/ContenuTauxOccupationESMS";
import { ContenuTauxOccupationGlobal } from "../InfoBulle/ContenuTauxOccupationGlobal";


type IndicateursOccupationESMSProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  établissementTerritorialActivitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialActivitéViewModel;
}>;

export const IndicateursOccupationESMS = ({ etabFiness, etabTitle, établissementTerritorialActivitéMédicoSocialViewModel }: IndicateursOccupationESMSProps) => {
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
        identifiant="activite-0"
        nomDeLIndicateur={wording.TAUX_OCCUPATION_EXTERNAT}
        source={wording.CNSA}
      >
        {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationExternatHistogramme(etabFiness, etabTitle)}
      </IndicateurGraphique> : <></>}
      {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationSemiInternatEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationSemiInternatEstIlAutorise ? <IndicateurGraphique
        contenuInfoBulle={
          <ContenuDuTauxOccupationESMS
            dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
            source={wording.CNSA}
          />
        }
        dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
        identifiant="activite-1"
        nomDeLIndicateur={wording.TAUX_OCCUPATION_SEMI_INTERNAT}
        source={wording.CNSA}
      >
        {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationSemiInternatHistogramme(etabFiness, etabTitle)}
      </IndicateurGraphique> : <></>}
      {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationInternatEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationInternatEstIlAutorise ? <IndicateurGraphique
        contenuInfoBulle={
          <ContenuDuTauxOccupationESMS
            dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
            source={wording.CNSA}
          />
        }
        dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
        identifiant="activite-2"
        nomDeLIndicateur={wording.TAUX_OCCUPATION_INTERNAT}
        source={wording.CNSA}
      >
        {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationInternatHistogramme(etabFiness, etabTitle)}
      </IndicateurGraphique> : <></>}
      {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationAutreEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationAutreEstIlAutorise ? <IndicateurGraphique
        contenuInfoBulle={
          <ContenuDuTauxOccupationESMS
            dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
            source={wording.CNSA}
          />
        }
        dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
        identifiant="activite-3"
        nomDeLIndicateur={wording.TAUX_OCCUPATION_AUTRE}
        source={wording.CNSA}
      >
        {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationAutreHistogramme(etabFiness, etabTitle)}
      </IndicateurGraphique> : <></>}
      {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationSeancesEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationSeancesEstIlAutorise ? <IndicateurGraphique
        contenuInfoBulle={
          <ContenuDuTauxOccupationESMS
            dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
            source={wording.CNSA}
          />
        }
        dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourCNSA}
        identifiant="activite-4"
        nomDeLIndicateur={wording.TAUX_OCCUPATION_SEANCES}
        source={wording.CNSA}
      >
        {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationSeancesHistogramme(etabFiness, etabTitle)}
      </IndicateurGraphique> : <></>}
      {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationGlobalEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationGlobalEstIlAutorisé ? (
        <IndicateurGraphique
          contenuInfoBulle={
            <ContenuTauxOccupationGlobal
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationGlobal}
              source={wording.CNSA}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationGlobal}
          identifiant="activite-9"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_GLOBAL}
          source={wording.CNSA}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationGlobalHistrogramme(etabFiness, etabTitle)}
        </IndicateurGraphique>
      ) : <></>}
    </>
  );
};
