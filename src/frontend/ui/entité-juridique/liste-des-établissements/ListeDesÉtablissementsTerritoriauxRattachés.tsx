import { DomaineÉtablissementTerritorial } from "../../../../backend/métier/entities/DomaineÉtablissementTerritorial";
import { FrontDependencies } from "../../../configuration/frontDependencies";
import { Wording } from "../../../configuration/wording/Wording";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { ListItem } from "../../commun/ListItem/ListItem";
import { Tag } from "../../commun/Tag/Tag";
import { EtablissementsTerritoriauxRattachésViewModel } from "./EtablissementsTerritoriauxRattachésViewModel";
import styles from "./ListeDesÉtablissementsTerritoriauxRattachés.module.css";
import { ÉtablissementTerritorialRattachéViewModel } from "./ÉtablissementTerritorialRattachéViewModel";

type ÉtablissementsTerritoriauxRattachésTypeProps = Readonly<{
  établissementsTerritoriauxRattachésViewModels: EtablissementsTerritoriauxRattachésViewModel;
}>;

const listeDunTypeDetablissement = (
  établissementsViewModel: ÉtablissementTerritorialRattachéViewModel[],
  domaine: DomaineÉtablissementTerritorial,
  paths: FrontDependencies["paths"],
  wording: Wording
) => {
  return (
    établissementsViewModel.length > 0 && [
      tagDomaineEtablissement(établissementsViewModel.length, domaine, wording),
      <ol className={styles["liste-établissements-territoriaux-rattachés"] + " fr-raw-list fr-text--bold fr-raw-link"} key={"liste-" + domaine}>
        {établissementsViewModel
          .sort((établissement1, établissement2) => établissement1.numéroFiness.localeCompare(établissement2.numéroFiness))
          .map((établissementTerritorialRattachéViewModel: ÉtablissementTerritorialRattachéViewModel) => (
            <ListItem
              key={établissementTerritorialRattachéViewModel.numéroFiness}
              label={établissementTerritorialRattachéViewModel.identifiant}
              lien={établissementTerritorialRattachéViewModel.lienVersLÉtablissement(paths)}
            />
          ))}
      </ol>,
    ]
  );
};

const tagDomaineEtablissement = (nombreEtablissements: number, domaine: DomaineÉtablissementTerritorial, wording: Wording) => {
  const texteTag = domaine === DomaineÉtablissementTerritorial.MÉDICO_SOCIAL ? wording.DOMAINE_MEDICAUX_SOCIAL : wording.DOMAINE_SANITAIRE;
  return <Tag key={"tag-" + domaine} label={texteTag + " (" + nombreEtablissements + ")"} />;
};

export const ListeDesÉtablissementsTerritoriauxRattachés = ({
  établissementsTerritoriauxRattachésViewModels,
}: ÉtablissementsTerritoriauxRattachésTypeProps) => {
  const { paths, wording } = useDependencies();
  const établissementsSanitaire = établissementsTerritoriauxRattachésViewModels.établissementSanitaires;
  const établissementsMedicauxSociaux = établissementsTerritoriauxRattachésViewModels.établissementMedicauxSociaux;
  if (établissementsTerritoriauxRattachésViewModels.nombreEtablissements === 0) return null;

  const listeMedicauxSociaux = listeDunTypeDetablissement(établissementsMedicauxSociaux, DomaineÉtablissementTerritorial.MÉDICO_SOCIAL, paths, wording);
  const listeSanitaire = listeDunTypeDetablissement(établissementsSanitaire, DomaineÉtablissementTerritorial.SANITAIRE, paths, wording);

  return (
    <section aria-label={wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS} className="fr-mt-4w">
      <h2 className="fr-h3">{établissementsTerritoriauxRattachésViewModels.nombreEtablissements + " " + wording.ÉTABLISSEMENTS_RATTACHÉS}</h2>
      {établissementsSanitaire.length > établissementsMedicauxSociaux.length ? [listeSanitaire, listeMedicauxSociaux] : [listeMedicauxSociaux, listeSanitaire]}
    </section>
  );
};
