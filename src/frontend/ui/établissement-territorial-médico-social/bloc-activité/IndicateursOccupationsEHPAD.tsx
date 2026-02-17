import { ÉtablissementTerritorialMédicoSocialActivitéViewModel } from "./ÉtablissementTerritorialMédicoSocialActivitéViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuTauxOccupationAccueilDeJour } from "../InfoBulle/ContenuTauxOccupationAccueilDeJour";
import { ContenuTauxOccupationHébergementPermanent } from "../InfoBulle/ContenuTauxOccupationHébergementPermanent";
import { ContenuTauxOccupationHébergementTemporaire } from "../InfoBulle/ContenuTauxOccupationHébergementTemporaire";
import { ContenuTauxRéalisationActivité } from "../InfoBulle/ContenuTauxRéalisationActivité";


type IndicateursOccupationEHPADProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  établissementTerritorialActivitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialActivitéViewModel;
}>;

export const IndicateursOccupationEHPAD = ({ etabFiness, etabTitle, établissementTerritorialActivitéMédicoSocialViewModel }: IndicateursOccupationEHPADProps) => {
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
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationHébergementPermanentHistogramme(etabFiness, etabTitle)}
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
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationHébergementTemporaireHistogramme(etabFiness, etabTitle)}
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
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationAccueilDeJourHistogramme(etabFiness, etabTitle)}
        </IndicateurGraphique>
      ) : <></>}
      {établissementTerritorialActivitéMédicoSocialViewModel.leTauxRéalisationActivitéEstIlRenseigné && établissementTerritorialActivitéMédicoSocialViewModel.leTauxRéalisationActivitéEstIlAutorisé ? (
        <IndicateurGraphique
          contenuInfoBulle={
            <ContenuTauxRéalisationActivité
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxRéalisationActivité}
              source={wording.TDB_PERF}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxRéalisationActivité}
          identifiant="activite-5"
          nomDeLIndicateur={wording.TAUX_RÉALISATION_ACTIVITÉ}
          source={wording.TDB_PERF}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxRéalisationActivitéHistrogramme(etabFiness, etabTitle)}
        </IndicateurGraphique>
      ) : <></>}
    </>
  );
};
