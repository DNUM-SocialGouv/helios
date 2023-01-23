import { DomaineÉtablissementTerritorial } from "../../../../backend/métier/entities/DomaineÉtablissementTerritorial";
import { FrontDependencies } from "../../../configuration/frontDependencies";
import { Wording } from "../../../configuration/wording/Wording";
import { Badge } from "../../commun/Badge/Badge";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { ListItem } from "../../commun/ListItem/ListItem";
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
    établissementsViewModel.length > 0 && (
      <div className="fr-col" key={"liste-" + domaine}>
        {tagDomaineEtablissement(établissementsViewModel.length, domaine, wording)}
        <ol className=" fr-raw-list fr-text--bold fr-raw-link fr-text--sm">
          {établissementsViewModel
            .sort((établissement1, établissement2) => établissement1.numéroFiness.localeCompare(établissement2.numéroFiness))
            .map((établissementTerritorialRattachéViewModel: ÉtablissementTerritorialRattachéViewModel) => (
              <ListItem
                key={établissementTerritorialRattachéViewModel.numéroFiness}
                label={établissementTerritorialRattachéViewModel.identifiant}
                lien={établissementTerritorialRattachéViewModel.lienVersLÉtablissement(paths)}
              />
            ))}
        </ol>
        ,
      </div>
    )
  );
};

const tagDomaineEtablissement = (nombreEtablissements: number, domaine: DomaineÉtablissementTerritorial, wording: Wording) => {
  let texteTag: string, couleurTexte: string, couleurFond: string;
  switch (domaine) {
    case DomaineÉtablissementTerritorial.MÉDICO_SOCIAL:
      texteTag = wording.DOMAINE_MEDICAUX_SOCIAL;
      couleurTexte = "fr-badge--green-emeraude";
      couleurFond = "fr-badge--green-emeraude";
      break;
    default:
      texteTag = wording.DOMAINE_SANITAIRE;
      couleurTexte = "fr-badge--pink-tuile";
      couleurFond = "fr-tag--pink-tuile";
      break;
  }
  return <Badge className={couleurTexte + " " + couleurFond + " fr-text--bold fr-mb-1w"} label={texteTag + " (" + nombreEtablissements + ")"} />;
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
    <section aria-label={wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS} className={styles["liste-établissements-territoriaux-rattachés"] + " fr-mt-4w"}>
      <h2 className="fr-h3">{établissementsTerritoriauxRattachésViewModels.nombreEtablissements + " " + wording.ÉTABLISSEMENTS_RATTACHÉS}</h2>
      <div className="fr-grid-row fr-grid-row--gutters">
        {établissementsSanitaire.length > établissementsMedicauxSociaux.length
          ? [listeSanitaire, listeMedicauxSociaux]
          : [listeMedicauxSociaux, listeSanitaire]}
      </div>
    </section>
  );
};
