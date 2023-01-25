import { useState } from "react";

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
const MAX_AFFICHAGE_ET = 2;

const listeDunTypeDetablissement = (
  établissementsViewModel: ÉtablissementTerritorialRattachéViewModel[],
  domaine: DomaineÉtablissementTerritorial,
  paths: FrontDependencies["paths"],
  wording: Wording,
  voirTout: boolean
) => {
  return (
    établissementsViewModel.length > 0 && (
      <div className="fr-col" key={"liste-" + domaine}>
        {tagDomaineEtablissement(établissementsViewModel.length, domaine, wording)}
        <ol className=" fr-raw-list fr-text--bold fr-raw-link fr-text--sm">
          {établissementsViewModel
            .sort((établissement1, établissement2) => établissement1.numéroFiness.localeCompare(établissement2.numéroFiness))
            .slice(0, voirTout ? établissementsViewModel.length : MAX_AFFICHAGE_ET)
            .map((établissementTerritorialRattachéViewModel: ÉtablissementTerritorialRattachéViewModel) => (
              <ListItem
                key={établissementTerritorialRattachéViewModel.numéroFiness}
                label={établissementTerritorialRattachéViewModel.identifiant}
                lien={établissementTerritorialRattachéViewModel.lienVersLÉtablissement(paths)}
              />
            ))}
        </ol>
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

function titreEtablissementsRattaches(nombreEtablissements: number, wording: Wording) {
  return (
    <h2 className="fr-h3">
      {nombreEtablissements > 0 ? nombreEtablissements + " " + wording.ÉTABLISSEMENTS_RATTACHÉS : wording.AUCUN_ÉTABLISSEMENTS_RATTACHÉS}
    </h2>
  );
}

export const ListeDesÉtablissementsTerritoriauxRattachés = ({
  établissementsTerritoriauxRattachésViewModels,
}: ÉtablissementsTerritoriauxRattachésTypeProps) => {
  const [voirTout, setVoirTout] = useState(false);
  const { paths, wording } = useDependencies();

  const établissementsSanitaire = établissementsTerritoriauxRattachésViewModels.établissementSanitaires;
  const établissementsMedicauxSociaux = établissementsTerritoriauxRattachésViewModels.établissementMedicauxSociaux;
  const listeMedicauxSociaux = listeDunTypeDetablissement(
    établissementsMedicauxSociaux,
    DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
    paths,
    wording,
    voirTout
  );
  const listeSanitaire = listeDunTypeDetablissement(établissementsSanitaire, DomaineÉtablissementTerritorial.SANITAIRE, paths, wording, voirTout);
  return (
    <section aria-label={wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS} className={styles["liste-établissements-territoriaux-rattachés"] + " fr-mt-4w"}>
      {titreEtablissementsRattaches(établissementsTerritoriauxRattachésViewModels.nombreEtablissements, wording)}
      <div className="fr-grid-row fr-grid-row--gutters">
        {établissementsSanitaire.length > établissementsMedicauxSociaux.length
          ? [listeSanitaire, listeMedicauxSociaux]
          : [listeMedicauxSociaux, listeSanitaire]}
      </div>
      {!voirTout && (établissementsSanitaire.length > MAX_AFFICHAGE_ET || établissementsMedicauxSociaux.length > MAX_AFFICHAGE_ET) && (
        <button onClick={() => setVoirTout(true)}>Voir tous les établissements rattachés</button>
      )}
      {voirTout && <button onClick={() => setVoirTout(false)}>Voir moins d'établissements rattachés</button>}
    </section>
  );
};
