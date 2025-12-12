import { BlocVigieRH } from "./bloc-vigie-rh/BlocVigieRh";
import { BlocVigieRHViewModel } from "./bloc-vigie-rh/BlocVigieRHViewModel";
import styles from "./BlocRessourcesHumainesMédicoSocial.module.css"
import { ContenuBlocRHMedicoSocialHelios } from "./contenu-bloc-rh-helios";
import { ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel } from "./ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuBlocRHMedicoSocialVigieRHProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  etablissementTerritorialMedicoSocialRessourcesHumainesViewModel: ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel;
  statusSousBlocs: boolean[];
  setStatusSousBlocs: React.Dispatch<React.SetStateAction<boolean[]>>;
  blocVigieRhViewModel: BlocVigieRHViewModel;
}>;

export const ContenuBlocRHMedicoSocialVigieRH = ({
  etabFiness,
  etabTitle,
  etablissementTerritorialMedicoSocialRessourcesHumainesViewModel,
  setStatusSousBlocs,
  statusSousBlocs,
  blocVigieRhViewModel
}: ContenuBlocRHMedicoSocialVigieRHProps) => {
  const { wording } = useDependencies();

  const toggelBlocs = (index: number) => {
    const newBoolArray = [...statusSousBlocs];
    newBoolArray[index] = !newBoolArray[index];
    setStatusSousBlocs(newBoolArray);
  };

  const showNewBadge = new Date() <= new Date('2025-10-01');

  return (
    <div>
      <section className={styles["sous-bloc"] + " fr-accordion"} data-testid="sous-bloc-rh-helios">
        <h3 className="fr-accordion__title">
          <button
            aria-controls="accordion-indicateurs-rh-helios"
            aria-expanded={statusSousBlocs[0]}
            className="fr-accordion__btn"
            onClick={() => toggelBlocs(0)}
          >
            {wording.INDICATEURS_HELIOS_BLOC_TITLE}
          </button>
        </h3>
        <div className="fr-collapse" id="accordion-indicateurs-rh-helios">
          <ContenuBlocRHMedicoSocialHelios
            etabFiness={etabFiness}
            etabTitle={etabTitle}
            etablissementTerritorialMedicoSocialRessourcesHumainesViewModel={etablissementTerritorialMedicoSocialRessourcesHumainesViewModel}
          />
        </div>
      </section>
      <section className={styles["sous-bloc"] + " fr-accordion"} data-testid="sous-bloc-vigie-rh">
        <h3 className="fr-accordion__title">
          <button
            aria-controls="accordion-indicateurs-rh-vigierh"
            aria-expanded={statusSousBlocs[1]}
            className="fr-accordion__btn"
            onClick={() => toggelBlocs(1)}
          >
            {wording.INDICATEURS_VIGIERH_BLOC_TITLE} {showNewBadge && <p className={styles["badge-nouveau"] + " fr-badge fr-badge--new fr-badge--no-icon"}>{wording.NOUVEAU}</p>}
          </button>
        </h3>
        <div className="fr-collapse" id="accordion-indicateurs-rh-vigierh">
          <BlocVigieRH
            blocVigieRHViewModel={blocVigieRhViewModel}
            etabFiness={etabFiness}
            etabTitle={etabTitle}
          />
        </div>
      </section>
    </div>
  )
}
