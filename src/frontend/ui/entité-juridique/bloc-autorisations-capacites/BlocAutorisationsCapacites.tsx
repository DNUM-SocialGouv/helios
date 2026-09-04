import styles from './BlocAutorisationsCapacites.module.css';
import { EntitéJuridiqueAutorisationsCapacitesViewModel } from "./EntitéJuridiqueAutorisationsCapacitesViewModel";
import { useExportExcelAutorisation } from "./ExportExcelAutorisation"
import { GraphiqueAutorisationsMédicoSociales } from "./GraphiqueAutorisationsMédicoSociales";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { GraphiqueAutorisationsActivites } from "../../indicateur-métier/autorisations-activites/GraphiqueAutorisationsActivites";
import { GraphiqueAutresActivites } from "../../indicateur-métier/autres-activites/GraphiqueAutresActivites";
import { GraphiqueCapacitésParActivité } from "../../indicateur-métier/capacites-sanitaire-par-activites/GraphiqueCapacitésParActivité";
import { GraphiqueEquipementMateriauxLourds } from "../../indicateur-métier/equipements-materiaux-lourds/GraphiqueEquipementMateriauxLourds";
import { GraphiqueReconnaissanceContractuelles } from "../../indicateur-métier/reconnaissance-contractuelles/GraphiqueReconnaissanceContractuelles";

type BlocAutorisationsCapacitesProps = Readonly<{
  etabTitle: string;
  etabFiness: string;
  etabNom: string;
  entitéJuridiqueAutorisationsCapacitesViewModel: EntitéJuridiqueAutorisationsCapacitesViewModel;
  hasMedicoSocialEt: boolean;
  hasSanitaireEt: boolean;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

export const BlocAutorisationsCapacites = ({
  etabTitle,
  etabFiness,
  etabNom,
  entitéJuridiqueAutorisationsCapacitesViewModel,
  hasMedicoSocialEt,
  hasSanitaireEt,
  opnedBloc,
  toggelBlocs
}: BlocAutorisationsCapacitesProps) => {
  const { wording } = useDependencies();
  const { exportExcelAutorisation } = useExportExcelAutorisation(
    etabFiness,
    etabNom,
    entitéJuridiqueAutorisationsCapacitesViewModel,
    hasSanitaireEt,
    hasMedicoSocialEt
  );

  const indicateursSanitaires = [
    wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS_SANITAIRE,
    wording.AUTORISATIONS_ACTIVITES,
    wording.AUTRES_ACTIVITÉS,
    wording.RECONNAISSANCES_CONTRACTUELLES,
    wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS,
  ];
  const indicateursMédicoSociaux = [wording.AUTORISATIONS_MS];
  const toutesLesDonnéesSanitairesNeSontPasRenseignées =
    entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsCapacitesNeSontPasRenseignées &&
    entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasRenseignées() &&
    entitéJuridiqueAutorisationsCapacitesViewModel.lesAutresActivitesNeSontPasRenseignées() &&
    entitéJuridiqueAutorisationsCapacitesViewModel.lesReconnaissanceContractuellesNeSontPasRenseignées() &&
    entitéJuridiqueAutorisationsCapacitesViewModel.lesEquipementsLourdsNeSontPasRenseignées();
  const toutesLesDonnéesMédicoSocialesNeSontPasRenseignées =
    entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsMédicoSocialesNeSontPasRenseignées();
  const lesDonnéesVisiblesNeSontPasRenseignées =
    (!hasSanitaireEt || toutesLesDonnéesSanitairesNeSontPasRenseignées) &&
    (!hasMedicoSocialEt || toutesLesDonnéesMédicoSocialesNeSontPasRenseignées);
  const indicateursPasAutorisés = entitéJuridiqueAutorisationsCapacitesViewModel.lesDonnéesAutorisationEtCapacitéPasAutorisés.filter(
    (indicateur) =>
      (hasSanitaireEt || !indicateursSanitaires.includes(indicateur)) &&
      (hasMedicoSocialEt || !indicateursMédicoSociaux.includes(indicateur))
  );
  const indicateursPasRenseignés = entitéJuridiqueAutorisationsCapacitesViewModel.lesDonnéesAutorisationEtCapacitéPasRenseignees.filter(
    (indicateur) =>
      (hasSanitaireEt || !indicateursSanitaires.includes(indicateur)) &&
      (hasMedicoSocialEt || !indicateursMédicoSociaux.includes(indicateur))
  );
  const auMoinsUnGraphiqueVisible =
    (hasSanitaireEt && (
      (!entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsCapacitesNeSontPasRenseignées && entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasAutorisées) ||
      (!entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasRenseignées() && entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasAutorisées) ||
      (!entitéJuridiqueAutorisationsCapacitesViewModel.lesAutresActivitesNeSontPasRenseignées() && entitéJuridiqueAutorisationsCapacitesViewModel.lesAutresActivitesNeSontPasAutorisées) ||
      (!entitéJuridiqueAutorisationsCapacitesViewModel.lesReconnaissanceContractuellesNeSontPasRenseignées() && entitéJuridiqueAutorisationsCapacitesViewModel.lesReconnaissanceContractuellesNeSontPasAutoriséess) ||
      (!entitéJuridiqueAutorisationsCapacitesViewModel.lesEquipementsLourdsNeSontPasRenseignées() && entitéJuridiqueAutorisationsCapacitesViewModel.lesEquipementsLourdsNeSontPasAutorisées)
    )) ||
    (hasMedicoSocialEt &&
      !entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsMédicoSocialesNeSontPasRenseignées() &&
      entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsMédicoSocialesNeSontPasAutorisées);

  if (lesDonnéesVisiblesNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ} toggelBlocs={toggelBlocs} />;
  }

  const dataInformationBloc = () => {
    if (indicateursPasAutorisés.length > 0) {
      return <NotAUthorized indicateurs={indicateursPasAutorisés} />;
    } else if (indicateursPasRenseignés.length > 0) {
      return <NoDataCallout indicateurs={indicateursPasRenseignés} />;
    } else {
      return <></>;
    }
  }

  const handleExport = () => {
    exportExcelAutorisation();
  }

  return (
    <Bloc opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_AUTORISATION_ET_CAPACITÉ} toggelBlocs={toggelBlocs}>
      {dataInformationBloc()}
      <ul className="indicateurs">
        {hasSanitaireEt && (!entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsCapacitesNeSontPasRenseignées) && entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasAutorisées && (
          <GraphiqueCapacitésParActivité
            estEntitéJuridique
            estSanitaire={true}
            etabFiness={etabFiness}
            etabTitle={etabTitle}
            graphiqueCapacitésParActivitéViewModel={entitéJuridiqueAutorisationsCapacitesViewModel.graphiqueCapacitesParActivitesViewModel}
          />)}
        {hasSanitaireEt && (!entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasRenseignées()) && entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasAutorisées && (
          <GraphiqueAutorisationsActivites
            entiteJuridiqueAutorisations={entitéJuridiqueAutorisationsCapacitesViewModel.autorisationsActivités}
            entiteJuridiqueAutorisationsAmm={entitéJuridiqueAutorisationsCapacitesViewModel.autorisationsAmmActivites}
          />
        )}
        {hasSanitaireEt && (!entitéJuridiqueAutorisationsCapacitesViewModel.lesAutresActivitesNeSontPasRenseignées()) && entitéJuridiqueAutorisationsCapacitesViewModel.lesAutresActivitesNeSontPasAutorisées && (
          <GraphiqueAutresActivites entiteJuridiqueAutorisations={entitéJuridiqueAutorisationsCapacitesViewModel.autresActivités} />
        )}
        {hasSanitaireEt && (!entitéJuridiqueAutorisationsCapacitesViewModel.lesReconnaissanceContractuellesNeSontPasRenseignées()) && entitéJuridiqueAutorisationsCapacitesViewModel.lesReconnaissanceContractuellesNeSontPasAutoriséess && (
          <GraphiqueReconnaissanceContractuelles entiteJuridiqueAutorisations={entitéJuridiqueAutorisationsCapacitesViewModel.reconnaissanceActivités} />
        )}
        {hasSanitaireEt && (!entitéJuridiqueAutorisationsCapacitesViewModel.lesEquipementsLourdsNeSontPasRenseignées()) && entitéJuridiqueAutorisationsCapacitesViewModel.lesEquipementsLourdsNeSontPasAutorisées && (
          <GraphiqueEquipementMateriauxLourds entiteJuridiqueEquipementLourds={entitéJuridiqueAutorisationsCapacitesViewModel.equipementsLourds} />
        )}
        {hasMedicoSocialEt && (!entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsMédicoSocialesNeSontPasRenseignées()) && entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsMédicoSocialesNeSontPasAutorisées && (
          <GraphiqueAutorisationsMédicoSociales entiteJuridiqueAutorisations={entitéJuridiqueAutorisationsCapacitesViewModel.autorisationsMédicoSocial} />
        )}
        {auMoinsUnGraphiqueVisible && (
          <li>
            <div className={styles["voir_plus"] + " fr-grid-row fr-grid-row--center"}>
              <button className="fr-btn fr-btn--secondary" onClick={handleExport}>
                {wording.BOUTON_TELECHARGER_AUTORISATIONS_ET_CAPACITES}
              </button>
            </div>
          </li>
        )}
      </ul>
    </Bloc >
  );
};
