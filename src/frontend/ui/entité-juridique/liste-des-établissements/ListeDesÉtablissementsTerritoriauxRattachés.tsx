import { DomaineÉtablissementTerritorial } from "../../../../backend/métier/entities/DomaineÉtablissementTerritorial";
import { FrontDependencies } from "../../../configuration/frontDependencies";
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
  paths: FrontDependencies["paths"]
) => {
  return (
    établissementsViewModel.length > 0 && [
      tagDomaineEtablissement(établissementsViewModel.length, domaine),
      <ol className={styles["liste-établissements-territoriaux-rattachés"] + " fr-raw-list fr-text--bold fr-raw-link"} key={"liste-" + domaine}>
        {établissementsViewModel
          .sort((établissement1, établissement2) => établissement1.numéroFiness.localeCompare(établissement2.numéroFiness))
          .map((établissementTerritorialRattachéViewModel: ÉtablissementTerritorialRattachéViewModel) => (
            <ListItem
              key={établissementTerritorialRattachéViewModel.numéroFiness}
              label={établissementTerritorialRattachéViewModel.identifiant}
              lien={établissementTerritorialRattachéViewModel.lienVersLÉtablissement(paths)}
              logo={établissementTerritorialRattachéViewModel.logo}
            />
          ))}
      </ol>,
    ]
  );
};

const tagDomaineEtablissement = (nombreEtablissements: number, domaine: DomaineÉtablissementTerritorial) => {
  const texteTag = domaine === DomaineÉtablissementTerritorial.MÉDICO_SOCIAL ? "SOCIAL ET MEDICO-SOCIAL" : "SANITAIRE";
  return (
    <p className="fr-tag" key={"tag-" + domaine}>
      {texteTag} ({nombreEtablissements})
    </p>
  );
};

export const ListeDesÉtablissementsTerritoriauxRattachés = ({
  établissementsTerritoriauxRattachésViewModels,
}: ÉtablissementsTerritoriauxRattachésTypeProps) => {
  const { paths, wording } = useDependencies();
  const établissementsSanitaire = établissementsTerritoriauxRattachésViewModels.établissementSanitaires;
  const établissementsMedicauxSociaux = établissementsTerritoriauxRattachésViewModels.établissementMedicauxSociaux;
  if (établissementsTerritoriauxRattachésViewModels.nombreEtablissements === 0) return null;

  const listeMedicauxSociaux = listeDunTypeDetablissement(établissementsMedicauxSociaux, DomaineÉtablissementTerritorial.MÉDICO_SOCIAL, paths);
  const listeSanitaire = listeDunTypeDetablissement(établissementsSanitaire, DomaineÉtablissementTerritorial.SANITAIRE, paths);

  return (
    <section aria-label={wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS} className="fr-mt-4w">
      <h2 className="fr-h3">{établissementsTerritoriauxRattachésViewModels.nombreEtablissements + " " + wording.ÉTABLISSEMENTS_RATTACHÉS}</h2>
      {établissementsSanitaire.length > établissementsMedicauxSociaux.length ? [listeSanitaire, listeMedicauxSociaux] : [listeMedicauxSociaux, listeSanitaire]}
    </section>
  );
};
