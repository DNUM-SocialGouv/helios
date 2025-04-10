import styles from "./BlocActivitéMédicoSocial.module.css";
import { IndicateursOccupationESMS } from "./IndicateursOccupationESMS";
import { IndicateursOccupationEHPAD } from "./IndicateursOccupationsEHPAD";
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
import { ContenuTauxRéalisationActivité } from "../InfoBulle/ContenuTauxRéalisationActivité";

type BlocActivitéMédicoSocialProps = Readonly<{
  categorie: string;
  établissementTerritorialActivitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialActivitéViewModel;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

type GestionnaireListeIndicateursProps = Readonly<{
  estEHPAD: boolean;
  établissementTerritorialActivitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialActivitéViewModel;
}>;

type ListeIndicateursNonAutorisesOuNonRenseignesProps = Readonly<{
  notAuthorizedData: string[];
  missingData: string[];
}>;

const ListeIndicateursNonAutorisesOuNonRenseignes = ({
  notAuthorizedData, missingData,
}: ListeIndicateursNonAutorisesOuNonRenseignesProps) => {
  if (notAuthorizedData.length !== 0) {
    return <NotAUthorized indicateurs={notAuthorizedData} />;
  } else if (missingData.length !== 0) {
    return <NoDataCallout indicateurs={missingData} />;
  } else {
    return <></>;
  }
}

const GestionnaireListeIndicateurs = ({
  estEHPAD, établissementTerritorialActivitéMédicoSocialViewModel,
}: GestionnaireListeIndicateursProps) => {
  const donnees = estEHPAD
    ? {
      donneesNonAutorisees: établissementTerritorialActivitéMédicoSocialViewModel.lesDonneesActivitesEHPADPasAutorisees,
      donneesNonRenseignees: établissementTerritorialActivitéMédicoSocialViewModel.lesDonneesActivitesEHPADPasRenseignees
    }
    : {
      donneesNonAutorisees: établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitésPasAutorisés,
      donneesNonRenseignees: établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitésPasRenseignees
    };

  return <ListeIndicateursNonAutorisesOuNonRenseignes missingData={donnees.donneesNonRenseignees} notAuthorizedData={donnees.donneesNonAutorisees} />;

}

export const BlocActivitéMédicoSocial = ({ categorie, établissementTerritorialActivitéMédicoSocialViewModel, opnedBloc, toggelBlocs }: BlocActivitéMédicoSocialProps) => {
  const { wording } = useDependencies();
  const estEHPAD = categorie === "500 - Etablissement d'hébergement pour personnes âgées dépendantes";

  if (établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitéNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_ACTIVITÉ} toggelBlocs={toggelBlocs} />;
  }

  return (
    <Bloc opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_ACTIVITÉ} toggelBlocs={toggelBlocs}>
      <GestionnaireListeIndicateurs estEHPAD={estEHPAD} établissementTerritorialActivitéMédicoSocialViewModel={établissementTerritorialActivitéMédicoSocialViewModel} />
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {estEHPAD && <IndicateursOccupationEHPAD établissementTerritorialActivitéMédicoSocialViewModel={établissementTerritorialActivitéMédicoSocialViewModel} />}
        {!estEHPAD ? <IndicateursOccupationESMS établissementTerritorialActivitéMédicoSocialViewModel={établissementTerritorialActivitéMédicoSocialViewModel} /> : <></>}
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
