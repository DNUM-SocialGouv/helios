import { useDependencies } from "../../commun/contexts/useDependencies";
import styles from "./BlocRessourcesHumainesMédicoSocial.module.css"
import { ContenuBlocRHMedicoSocialHelios } from "./contenu-bloc-rh-helios";
import { ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel } from "./ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel";


type ContenuBlocRHMedicoSocialVigieRHProps = Readonly<{
    établissementTerritorialMédicoSocialRessourcesHumainesViewModel: ÉtablissementTerritorialRessourcesHumainesMédicoSocialViewModel;
}>;

export const ContenuBlocRHMedicoSocialVigieRH = ({
    établissementTerritorialMédicoSocialRessourcesHumainesViewModel
}: ContenuBlocRHMedicoSocialVigieRHProps) => {
    const { wording } = useDependencies();

    const showNewBadge = new Date() <= new Date('2025-09-01');
    return (
        <div className="fr-accordions-group">
            <section className="fr-accordion">
                <h3 className="fr-accordion__title">
                    <button aria-controls="accordion-indicateurs-rh-helios" aria-expanded="false" className="fr-accordion__btn">
                        {wording.INDICATEURS_HELIOS_BLOC_TITLE}
                    </button>
                </h3>
                <div className="fr-collapse" id="accordion-indicateurs-rh-helios">
                    <ContenuBlocRHMedicoSocialHelios établissementTerritorialMédicoSocialRessourcesHumainesViewModel={établissementTerritorialMédicoSocialRessourcesHumainesViewModel} />
                </div>
            </section>
            <section className="fr-accordion">
                <h3 className="fr-accordion__title">
                    <button aria-controls="accordion-indicateurs-rh-vigierh" aria-expanded="false" className="fr-accordion__btn">
                        {wording.INDICATEURS_VIGIERH_BLOC_TITLE} {showNewBadge && <p className={styles["badge-nouveau"] + " fr-badge fr-badge--new fr-badge--no-icon"}>{wording.NOUVEAU}</p>}
                    </button>
                </h3>
                <div className="fr-collapse" id="accordion-indicateurs-rh-vigierh">
                    Ici, les indicateurs Vigie RH
                </div>
            </section>
        </div>
    )
}