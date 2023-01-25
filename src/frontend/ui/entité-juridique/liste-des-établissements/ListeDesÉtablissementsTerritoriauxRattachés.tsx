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

type ETRattachésProps = Readonly<{
  ETRattachés: EtablissementsTerritoriauxRattachésViewModel;
}>;

const listeDunTypeDetablissement = (
  établissementsPaginés: ÉtablissementTerritorialRattachéViewModel[],
  domaine: DomaineÉtablissementTerritorial,
  paths: FrontDependencies["paths"],
  wording: Wording,
  totalEtablissements: number
) => {
  return (
    établissementsPaginés.length > 0 && (
      <div className="fr-col" key={"liste-" + domaine}>
        {tagDomaineEtablissement(totalEtablissements, domaine, wording)}
        <ol className=" fr-raw-list fr-text--bold fr-raw-link fr-text--sm">
          {établissementsPaginés.map((établissementTerritorialRattachéViewModel: ÉtablissementTerritorialRattachéViewModel) => (
            <ListItem
              hasFocus={établissementTerritorialRattachéViewModel.doitAvoirLeFocus}
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
  let texteTag: string, couleur: string;
  switch (domaine) {
    case DomaineÉtablissementTerritorial.MÉDICO_SOCIAL:
      texteTag = wording.DOMAINE_MEDICAUX_SOCIAL;
      couleur = "green-emeraude";
      break;
    default:
      texteTag = wording.DOMAINE_SANITAIRE;
      couleur = "pink-tuile";
      break;
  }
  return <Badge className={"fr-badge--" + couleur + " fr-text--bold fr-mb-1w"} label={texteTag + " (" + nombreEtablissements + ")"} />;
};

function TitreEtablissementsRattaches(nombreEtablissements: number, wording: Wording) {
  return (
    <h2 className="fr-h3">
      {nombreEtablissements > 0 ? nombreEtablissements + " " + wording.ÉTABLISSEMENTS_RATTACHÉS : wording.AUCUN_ÉTABLISSEMENTS_RATTACHÉS}
    </h2>
  );
}

function VoirMoins(
  voirTout: boolean,
  ETRattachés: EtablissementsTerritoriauxRattachésViewModel,
  setVoirTout: (value: ((prevState: boolean) => boolean) | boolean) => void,
  wording: Wording
) {
  return (
    <>
      {" "}
      {voirTout && (
        <button className="fr-btn fr-btn--secondary" onClick={() => ETRattachés.voirMoins(setVoirTout)}>
          {wording.VOIR_MOINS_ET}
        </button>
      )}
    </>
  );
}

function VoirPlus(
  voirTout: boolean,
  ETRattachés: EtablissementsTerritoriauxRattachésViewModel,
  setVoirTout: (value: ((prevState: boolean) => boolean) | boolean) => void,
  wording: Wording
) {
  return (
    <>
      {!voirTout && (
        <button className="fr-btn fr-btn--secondary" onClick={() => ETRattachés.voirPlus(setVoirTout)}>
          {wording.VOIR_TOUS_LES_ET}
        </button>
      )}
    </>
  );
}

export const ListeDesÉtablissementsTerritoriauxRattachés = ({ ETRattachés }: ETRattachésProps) => {
  const [voirTout, setVoirTout] = useState(false);
  const { paths, wording } = useDependencies();

  const listeMedicauxSociaux = listeDunTypeDetablissement(
    ETRattachés.établissementMédicoSociauxPaginés,
    DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
    paths,
    wording,
    ETRattachés.établissementMedicauxSociaux.length
  );
  const listeSanitaire = listeDunTypeDetablissement(
    ETRattachés.établissementSanitairesPaginés,
    DomaineÉtablissementTerritorial.SANITAIRE,
    paths,
    wording,
    ETRattachés.établissementSanitaires.length
  );
  return (
    <section aria-label={wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS} className={styles["liste-établissements-territoriaux-rattachés"] + " fr-mt-4w"}>
      {TitreEtablissementsRattaches(ETRattachés.nombreEtablissements, wording)}
      <div className="fr-grid-row fr-grid-row--gutters">
        {ETRattachés.plusDETSanitaire ? [listeSanitaire, listeMedicauxSociaux] : [listeMedicauxSociaux, listeSanitaire]}
      </div>
      {ETRattachés.depasseLimiteAffichage && (
        <div className={styles["voir_plus"] + " fr-grid-row fr-grid-row--center"}>
          {VoirMoins(voirTout, ETRattachés, setVoirTout, wording)}
          {VoirPlus(voirTout, ETRattachés, setVoirTout, wording)}
        </div>
      )}
    </section>
  );
};
