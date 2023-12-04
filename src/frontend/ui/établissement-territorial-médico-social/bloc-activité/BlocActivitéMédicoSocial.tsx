import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { ContenuDuréeMoyenneSéjourAccompagnementPersonnesSorties } from "../InfoBulle/ContenuDuréeMoyenneSéjourAccompagnementPersonnesSorties";
import { ContenuFileActivePersonnesAccompagnées } from "../InfoBulle/ContenuFileActivePersonnesAccompagnées";
import { ContenuNombreMoyenJournéesAbsencePersonnesAccompagnées } from "../InfoBulle/ContenuNombreMoyenJournéesAbsencePersonnesAccompagnées";
import { ContenuTauxOccupationAccueilDeJour } from "../InfoBulle/ContenuTauxOccupationAccueilDeJour";
import { ContenuTauxOccupationHébergementPermanent } from "../InfoBulle/ContenuTauxOccupationHébergementPermanent";
import { ContenuTauxOccupationHébergementTemporaire } from "../InfoBulle/ContenuTauxOccupationHébergementTemporaire";
import { ContenuTauxRéalisationActivité } from "../InfoBulle/ContenuTauxRéalisationActivité";
import styles from "./BlocActivitéMédicoSocial.module.css";
import { ÉtablissementTerritorialMédicoSocialActivitéViewModel } from "./ÉtablissementTerritorialMédicoSocialActivitéViewModel";

type BlocActivitéMédicoSocialProps = Readonly<{
  établissementTerritorialActivitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialActivitéViewModel;
}>;

export const BlocActivitéMédicoSocial = ({ établissementTerritorialActivitéMédicoSocialViewModel }: BlocActivitéMédicoSocialProps) => {
  const { wording } = useDependencies();

  if (établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitéNeSontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_ACTIVITÉ} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      {établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitésPasAutorisés.length !== 0 ? <NotAUthorized indicateurs={établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitésPasAutorisés} /> :
        établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitésPasRenseignees.length !== 0 ? <NoDataCallout indicateurs={établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitésPasRenseignees} /> :
          <></>}
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationHébergementPermanentEstIlRenseigné && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationHébergementPermanentEstIlAutorisé ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuTauxOccupationHébergementPermanent
                dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
                source={wording.CNSA}
              />
            }
            dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
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
                dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementTemporaire}
                source={wording.CNSA}
              />
            }
            dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementTemporaire}
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
                dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationAccueilDeJour}
                source={wording.CNSA}
              />
            }
            dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationAccueilDeJour}
            identifiant="activite-2"
            nomDeLIndicateur={wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR}
            source={wording.CNSA}
          >
            {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationAccueilDeJour}
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
            identifiant="activite-3"
            nomDeLIndicateur={wording.TAUX_RÉALISATION_ACTIVITÉ}
            source={wording.TDB_PERF}
          >
            {établissementTerritorialActivitéMédicoSocialViewModel.tauxRéalisationActivité}
          </IndicateurGraphique>
        ) : <></>}
        {établissementTerritorialActivitéMédicoSocialViewModel.laFileActivePersonnesAccompagnéesEstElleRenseignée && établissementTerritorialActivitéMédicoSocialViewModel.laFileActivePersonnesAccompagnéesEstElleAutorisé ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuFileActivePersonnesAccompagnées
                dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDeLaFileActivePersonnesAccompagnées}
                source={wording.TDB_PERF}
              />
            }
            dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDeLaFileActivePersonnesAccompagnées}
            identifiant="activite-4"
            nomDeLIndicateur={wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES}
            source={wording.TDB_PERF}
          >
            {établissementTerritorialActivitéMédicoSocialViewModel.fileActivePersonnesAccompagnées}
          </IndicateurGraphique>
        ) : <></>}
        {établissementTerritorialActivitéMédicoSocialViewModel.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné && établissementTerritorialActivitéMédicoSocialViewModel.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlAutorisé ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuNombreMoyenJournéesAbsencePersonnesAccompagnées
                dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuNombreMoyenJournéesAbsencePersonnesAccompagnées}
                source={wording.TDB_PERF}
              />
            }
            dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuNombreMoyenJournéesAbsencePersonnesAccompagnées}
            identifiant="activite-5"
            nomDeLIndicateur={wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES}
            source={wording.TDB_PERF}
          >
            {établissementTerritorialActivitéMédicoSocialViewModel.nombreMoyenJournéesAbsencePersonnesAccompagnées}
          </IndicateurGraphique>
        ) : <></>}

        {établissementTerritorialActivitéMédicoSocialViewModel.laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleRenseignée && établissementTerritorialActivitéMédicoSocialViewModel.laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleAutorisé ? (<IndicateurGraphique
          contenuInfoBulle={
            <ContenuDuréeMoyenneSéjourAccompagnementPersonnesSorties
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDeLaDuréeMoyenneSéjourAccompagnementPersonnesSorties}
              source={wording.TDB_PERF}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDeLaDuréeMoyenneSéjourAccompagnementPersonnesSorties}
          identifiant="activite-6"
          nomDeLIndicateur={wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES}
          source={wording.TDB_PERF}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.duréeMoyenneSéjourAccompagnementPersonnesSorties}
        </IndicateurGraphique>
        ) : <></>}
      </ul>
    </Bloc>
  );
};
