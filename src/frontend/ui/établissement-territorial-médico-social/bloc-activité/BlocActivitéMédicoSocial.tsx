import styles from "./BlocActivitéMédicoSocial.module.css";
import { ÉtablissementTerritorialMédicoSocialActivitéViewModel } from "./ÉtablissementTerritorialMédicoSocialActivitéViewModel";
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
import { ContenuDuTauxOccupationESMS } from "../InfoBulle/ContenuTauxOccupationESMS";
import { ContenuTauxOccupationHébergementPermanent } from "../InfoBulle/ContenuTauxOccupationHébergementPermanent";
import { ContenuTauxOccupationHébergementTemporaire } from "../InfoBulle/ContenuTauxOccupationHébergementTemporaire";
import { ContenuTauxRéalisationActivité } from "../InfoBulle/ContenuTauxRéalisationActivité";

type BlocActivitéMédicoSocialProps = Readonly<{
  établissementTerritorialActivitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialActivitéViewModel;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

const ListeIndicateursNonAutorisesOuNonRenseignes = ({
  établissementTerritorialActivitéMédicoSocialViewModel,
}: BlocActivitéMédicoSocialProps) => {
  if (établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitésPasAutorisés.length !== 0) {
    return <NotAUthorized indicateurs={établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitésPasAutorisés} />
  } else if (établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitésPasRenseignees.length !== 0) {
    return <NoDataCallout indicateurs={établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitésPasRenseignees} />
  } else {
    return <></>
  }
}

export const BlocActivitéMédicoSocial = ({ établissementTerritorialActivitéMédicoSocialViewModel, opnedBloc, toggelBlocs }: BlocActivitéMédicoSocialProps) => {
  const { wording } = useDependencies();

  if (établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitéNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_ACTIVITÉ} toggelBlocs={toggelBlocs} />;
  }

  return (
    <Bloc opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_ACTIVITÉ} toggelBlocs={toggelBlocs}>
      <ListeIndicateursNonAutorisesOuNonRenseignes établissementTerritorialActivitéMédicoSocialViewModel={établissementTerritorialActivitéMédicoSocialViewModel} />
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
        {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationExternatEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationExternatEstIlAutorise ? <IndicateurGraphique
          contenuInfoBulle={
            <ContenuDuTauxOccupationESMS
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
              source={wording.CNSA}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
          identifiant="activite-7"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_EXTERNAT}
          source={wording.CNSA}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationExternat}
        </IndicateurGraphique> : <></>}
        {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationSemiInternatEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationSemiInternatEstIlAutorise ? <IndicateurGraphique
          contenuInfoBulle={
            <ContenuDuTauxOccupationESMS
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
              source={wording.CNSA}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
          identifiant="activite-8"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_SEMI_INTERNAT}
          source={wording.CNSA}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationSemiInternat}
        </IndicateurGraphique> : <></>}
        {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationInternatEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationInternatEstIlAutorise ? <IndicateurGraphique
          contenuInfoBulle={
            <ContenuDuTauxOccupationESMS
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
              source={wording.CNSA}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
          identifiant="activite-9"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_INTERNAT}
          source={wording.CNSA}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationInternat}
        </IndicateurGraphique> : <></>}
        {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationAutreEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationAutreEstIlAutorise ? <IndicateurGraphique
          contenuInfoBulle={
            <ContenuDuTauxOccupationESMS
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
              source={wording.CNSA}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
          identifiant="activite-10"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_AUTRE}
          source={wording.CNSA}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationAutre}
        </IndicateurGraphique> : <></>}
        {établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationSeancesEstIlRenseigne && établissementTerritorialActivitéMédicoSocialViewModel.leTauxOccupationSeancesEstIlAutorise ? <IndicateurGraphique
          contenuInfoBulle={
            <ContenuDuTauxOccupationESMS
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
              source={wording.CNSA}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
          identifiant="activite-11"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_SEANCES}
          source={wording.CNSA}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationSeances}
        </IndicateurGraphique> : <></>}
      </ul>
    </Bloc>
  );
};
