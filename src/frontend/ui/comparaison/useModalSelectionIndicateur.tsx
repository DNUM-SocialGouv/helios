import { ReactNode, useEffect, useState } from "react";

type IndicatorStateItem = {
  displayName: string;
  columnName: string;
  enabled: boolean;
}

export enum IndicatorPosition {
  LEFT = "left",
  RIGHT = "right",
}

type IndicatorCategory = {
  name: string;
  position: IndicatorPosition;
}

type IndicatorsState = Map<string, Map<IndicatorCategory, IndicatorStateItem[]>>

function getInitialIndicatorsState(): IndicatorsState {
  // ################################## Medico-social indicators ##################################
  const medicoSocialIndicators = new Map<IndicatorCategory, IndicatorStateItem[]>([]);

  // Bloc Capacité et Autorisation
  const capaciteMSCategory: IndicatorCategory = { name: "Bloc Capacité et Autorisation", position: IndicatorPosition.LEFT };
  const medicoSocialIndicatorsCapacityAutorisation: IndicatorStateItem[] = [
    { displayName: "Capacité Totale", columnName: "capacite", enabled: true }
  ];
  medicoSocialIndicators.set(capaciteMSCategory, medicoSocialIndicatorsCapacityAutorisation);

  // Bloc Activité
  const activiteMSCategory: IndicatorCategory = { name: "Bloc Activité", position: IndicatorPosition.LEFT };
  const medicoSocialIndicatorsActivite: IndicatorStateItem[] = [
    { displayName: "Taux de réalisation de l’activité", columnName: "realisationActivite", enabled: true },
    { displayName: "File active des personnes accompagnées sur la période", columnName: "fileActivePersonnesAccompagnes", enabled: true },
    { displayName: "Taux d’occupation en hébergement permanent", columnName: "hebergementPermanent", enabled: true },
    { displayName: "Taux d’occupation en hébergement temporaire", columnName: "hebergementTemporaire", enabled: true },
    { displayName: "Taux d’occupation en accueil de jour", columnName: "acceuilDeJour", enabled: true },
    { displayName: "Taux d’occupation externat", columnName: "externat", enabled: true },
    { displayName: "Taux d’occupation semi-internat", columnName: "semiInternat", enabled: true },
    { displayName: "Taux d’occupation internat", columnName: "internat", enabled: true },
    { displayName: "Taux d’occupation autre 1, 2 et 3", columnName: "autres", enabled: true },
    { displayName: "Taux d'occupation Séances", columnName: "seances", enabled: true }
  ];
  medicoSocialIndicators.set(activiteMSCategory, medicoSocialIndicatorsActivite);

  // Bloc Ressources Humaines
  const rhMSCategory: IndicatorCategory = { name: "Bloc Ressources Humaines", position: IndicatorPosition.RIGHT };
  const medicoSocialIndicatorsRessourcesHumaines: IndicatorStateItem[] = [
    { displayName: "Taux de prestations externes sur les prestations directes", columnName: "prestationExterne", enabled: true },
    { displayName: "Taux de rotation du personnel sur effectifs réels", columnName: "rotationPersonnel", enabled: true },
    { displayName: "Taux d'ETP vacants au 31/12", columnName: "etpVacant", enabled: true },
    { displayName: "Taux d'absentéisme", columnName: "absenteisme", enabled: true }
  ];
  medicoSocialIndicators.set(rhMSCategory, medicoSocialIndicatorsRessourcesHumaines);

  // Bloc Budget et Finances
  const budgetMSCategory: IndicatorCategory = { name: "Bloc Budget et Finances", position: IndicatorPosition.RIGHT };
  const medicoSocialIndicatorsBudgetEtFinances: IndicatorStateItem[] = [
    { displayName: "Taux de CAF", columnName: "tauxCaf", enabled: true },
    { displayName: "Taux de vétusté des constructions", columnName: "vetusteConstruction", enabled: true },
    { displayName: "Fond de roulement net global", columnName: "roulementNetGlobal", enabled: true },
    { displayName: "Résultat net comptable", columnName: "resultatNetComptable", enabled: true }
  ];
  medicoSocialIndicators.set(budgetMSCategory, medicoSocialIndicatorsBudgetEtFinances);

  // ##########################################################################################
  // ################################## Sanitaire indicators ##################################
  const sanitaireIndicators = new Map<IndicatorCategory, IndicatorStateItem[]>([]);

  // Bloc Activité
  const activiteSanCategory: IndicatorCategory = { name: "Bloc Activité", position: IndicatorPosition.LEFT };
  const sanitaireIndicatorsActivite: IndicatorStateItem[] = [
    { displayName: "Nb séjours Médecine Total Hospit", columnName: "totalHosptMedecine", enabled: true },
    { displayName: "Nb séjours Chirurgie Total Hospit", columnName: "totalHosptChirurgie", enabled: true },
    { displayName: "Nb séjours Obstétrique Total Hospit", columnName: "totalHosptObstetrique", enabled: true },
    { displayName: "Nb journées Psychiatrie Total Hospit", columnName: "totalHosptPsy", enabled: true },
    { displayName: "Nb journées SSR Total Hospit", columnName: "totalHosptSsr", enabled: true },
    { displayName: "Nb de passage aux urgences", columnName: "passagesUrgences", enabled: true },
    { displayName: "Nb journées USLD", columnName: "journeesUsld", enabled: true }
  ];
  sanitaireIndicators.set(activiteSanCategory, sanitaireIndicatorsActivite);

  // Bloc Ressources Humaines
  const rhSanCategory: IndicatorCategory = { name: "Bloc Ressources Humaines", position: IndicatorPosition.LEFT };
  const sanitaireIndicatorsRessourcesHumaines: IndicatorStateItem[] = [
    { displayName: "Nb ETP PM", columnName: "nombreEtpPm", enabled: true },
    { displayName: "Nb ETP PNM", columnName: "nombreEtpPnm", enabled: true },
    { displayName: "Dépenses d’intérim PM", columnName: "depensesInterimPm", enabled: true },
    { displayName: "Jours d’absentéisme PM", columnName: "joursAbsenteismePm", enabled: true },
    { displayName: "Jours d’absentéisme PNM", columnName: "joursAbsenteismePnm", enabled: true },
  ];
  sanitaireIndicators.set(rhSanCategory, sanitaireIndicatorsRessourcesHumaines);

  // Bloc Budget et Finances
  const budgetSanCategory: IndicatorCategory = { name: "Bloc Budget et Finances", position: IndicatorPosition.RIGHT };
  const sanitaireIndicatorsBudgetEtFinances: IndicatorStateItem[] = [
    { displayName: "Allocation de ressources: 1ᵉʳ enveloppe", columnName: 'enveloppe1', enabled: true },
    { displayName: "Allocation de ressources: 2ᵉᵐᵉ enveloppe", columnName: 'enveloppe2', enabled: true },
    { displayName: "Allocation de ressources: 3ᵉᵐᵉ enveloppe", columnName: 'enveloppe3', enabled: true },
  ];
  sanitaireIndicators.set(budgetSanCategory, sanitaireIndicatorsBudgetEtFinances);
  // ##########################################################################################
  // ################################## Entité Juridique indicators ##################################
  const entiteJuridiqueIndicators = new Map<IndicatorCategory, IndicatorStateItem[]>([]);

  // Bloc Identité
  const identiteEJCategory: IndicatorCategory = { name: "Bloc Identité", position: IndicatorPosition.LEFT };
  const entiteJuridiqueIndicatorsIdentite: IndicatorStateItem[] = [
    { displayName: "Statut juridique", columnName: "statutJuridique", enabled: true },
    { displayName: "Rattachements", columnName: "rattachements", enabled: true }
  ];
  entiteJuridiqueIndicators.set(identiteEJCategory, entiteJuridiqueIndicatorsIdentite);

  // Bloc Activité
  const activiteEJCategory: IndicatorCategory = { name: "Bloc Activité", position: IndicatorPosition.LEFT };
  const entiteJuridiqueIndicatorsActivite: IndicatorStateItem[] = [
    { displayName: "Nb séjours HAD", columnName: "sejoursHad", enabled: true }
  ];
  entiteJuridiqueIndicators.set(activiteEJCategory, entiteJuridiqueIndicatorsActivite);

  // Bloc Ressources Humaines
  const rhEJCategory: IndicatorCategory = { name: "Bloc Ressources Humaines", position: IndicatorPosition.LEFT };
  const entiteJuridiqueIndicatorsRessourcesHumaines: IndicatorStateItem[] = [
    { displayName: "Nb ETP PM", columnName: "nombreEtpPm", enabled: true },
    { displayName: "Nb ETP PNM", columnName: "nombreEtpPnm", enabled: true },
    { displayName: "Dépenses intérim PM", columnName: "depensesInterimPm", enabled: true },
    { displayName: "Jours d’absentéisme PM", columnName: "joursAbsenteismePm", enabled: true },
    { displayName: "Jours d’absentéisme PNM", columnName: "joursAbsenteismePnm", enabled: true }
  ];
  entiteJuridiqueIndicators.set(rhEJCategory, entiteJuridiqueIndicatorsRessourcesHumaines);

  // Bloc Budget et Finances
  const budgetEJCategory: IndicatorCategory = { name: "Bloc Budget et Finances", position: IndicatorPosition.RIGHT };
  const entiteJuridiqueIndicatorsBudgetEtFinances: IndicatorStateItem[] = [
    { displayName: "Cpte résultat - Charges (principaux)", columnName: "chargesPrincipaux", enabled: true },
    { displayName: "Cpte résultat - Charges (annexes)", columnName: "chargesAnnexes", enabled: true },
    { displayName: "Cpte résultat - Produits (principaux)", columnName: "produitsPrincipaux", enabled: true },
    { displayName: "Cpte résultat - Produits (annexes)", columnName: "produitsAnnexes", enabled: true },
    { displayName: "Résultat net comptable", columnName: "resultatNetComptableEj", enabled: true },
    { displayName: "Tx CAF", columnName: "tauxCafEj", enabled: true },
    { displayName: "Ratio de dépendance financière", columnName: "ratioDependanceFinanciere", enabled: true },
    { displayName: "Allocation de ressources: 1ᵉʳ enveloppe", columnName: 'enveloppe1', enabled: true },
    { displayName: "Allocation de ressources: 2ᵉᵐᵉ enveloppe", columnName: 'enveloppe2', enabled: true },
    { displayName: "Allocation de ressources: 3ᵉᵐᵉ enveloppe", columnName: 'enveloppe3', enabled: true },
  ];
  entiteJuridiqueIndicators.set(budgetEJCategory, entiteJuridiqueIndicatorsBudgetEtFinances);
  // ##########################################################################################

  return new Map([
    ["medicoSocial", medicoSocialIndicators],
    ["sanitaire", sanitaireIndicators],
    ["entiteJuridique", entiteJuridiqueIndicators]
  ]);
}

export function useModalSelectionIndicateur(structure: string) {
  // State containing the selected indicators
  const [indicators, setIndicators] = useState<IndicatorsState>(getInitialIndicatorsState());
  const [pendingIndicators, setPendingIndicators] = useState<IndicatorsState>(getInitialIndicatorsState());
  const [enabledIndicators, setEnabledIndicators] = useState<string[]>(getEnabledIndicators());

  // Call this when opening the modal to sync pendingIndicators
  function openIndicatorSelectionModal() {
    setPendingIndicators(indicators);
  }

  useEffect(() => {
    setEnabledIndicators(getEnabledIndicators());
  }, [indicators, structure]);

  function getEnabledIndicators(): string[] {
    const result: string[] = [];
    const structureIndicators = getCurrentIndicators();
    for (const items of structureIndicators.values()) {
      for (const item of items) {
        if (item.enabled) {
          result.push(item.columnName);
        }
      }
    }
    return result;
  };

  const toggleIndicator = (category: IndicatorCategory, columnName: string) => {
    setPendingIndicators((prevState) => {
      const indicatorsKey = getIndicatorsKey();
      const structureState = prevState.get(indicatorsKey);
      if (!structureState) return prevState;

      const newState = new Map(prevState);
      const newStructureState = new Map(structureState);
      const items = newStructureState.get(category);
      if (items) {
        const newItems = items.map((item) =>
          item.columnName === columnName ? { ...item, enabled: !item.enabled } : item
        );
        newStructureState.set(category, newItems);
      }
      return newState.set(indicatorsKey, newStructureState);
    });
  };

  // Toggles all indicators in the given category: if all are enabled, disable all; otherwise, enable all
  const toggleCategory = (category: IndicatorCategory) => {
    setPendingIndicators((prevState) => {
      const indicatorsKey = getIndicatorsKey();
      const structureState = prevState.get(indicatorsKey);
      if (!structureState) return prevState;

      const newState = new Map(prevState);
      const newStructureState = new Map(structureState);
      const items = newStructureState.get(category);
      if (items) {
        const allEnabled = items.every(item => item.enabled);
        const newItems = items.map((item) => ({ ...item, enabled: !allEnabled }));
        newStructureState.set(category, newItems);
      }
      return newState.set(indicatorsKey, newStructureState);
    });
  };

  function getIndicatorsKey(): string {
    if (structure === 'Médico-social')
      return "medicoSocial";
    else if (structure === 'Sanitaire')
      return "sanitaire";
    else if (structure === "Entité juridique")
      return "entiteJuridique";
    else return "";
  }


  function getCurrentIndicators(): Map<IndicatorCategory, IndicatorStateItem[]> {
    return indicators.get(getIndicatorsKey()) ?? new Map();
  }

  const getPendingIndicators = (): Map<IndicatorCategory, IndicatorStateItem[]> => {
    return pendingIndicators.get(getIndicatorsKey()) ?? new Map();
  }

  function generateModal(): ReactNode {
    const currentStructureIndicators = getCurrentIndicators();
    const pendingStructureIndicators = getPendingIndicators();
    const categories = Array.from(currentStructureIndicators.entries());
    const leftColumn = categories.filter(([category]) => category.position === IndicatorPosition.LEFT);
    const rightColumn = categories.filter(([category]) => category.position === IndicatorPosition.RIGHT);

    const renderCategory = ([category]: [IndicatorCategory, IndicatorStateItem[]]) => {
      const pendingItems = pendingStructureIndicators.get(category) || [];
      return (
        <div className="fr-mb-4w" key={category.name}>
          <fieldset className="fr-fieldset">
            <div className="fr-fieldset__content">
              <div className="fr-checkbox-group" >
                <input
                  checked={pendingItems.every(item => item.enabled)}
                  id={`category-checkbox-${category.name}`}
                  onChange={() => toggleCategory(category)}
                  type="checkbox"
                />
                <label className="fr-label fr-ml-2w fr-text--bold fr-text--xl fr-mb-0 fr-pt-1w" htmlFor={`category-checkbox-${category.name}`} >
                  {category.name}
                </label>
                {pendingItems.map((item) => (
                  <div className="fr-my-n2w" key={item.columnName}>
                    <input
                      checked={item.enabled}
                      id={`checkbox-${item.columnName}`}
                      name={item.columnName}
                      onChange={() => toggleIndicator(category, item.columnName)}
                      type="checkbox"
                    />
                    <label className="fr-label fr-ml-5w" htmlFor={`checkbox-${item.columnName}`}>
                      {item.displayName}
                    </label>
                  </div>
                ))}
              </div>
            </div >
          </fieldset >
        </div >
      );
    };

    return (
      <dialog aria-labelledby="fr-modal-selection-indicateur-title" className="fr-modal" id="fr-modal-selection-indicateur">
        <div className="fr-container fr-container--fluid fr-container-md">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-10 fr-col-lg-10">
              <div className="fr-modal__body">
                <div className="fr-modal__content">
                  <h1 className="fr-modal__title fr-my-2w" id="fr-modal-selection-indicateur-title">
                    Sélection des indicateurs
                  </h1>
                  <div className="fr-grid-row fr-grid-row--gutters">
                    <div className="fr-col-12 fr-col-md-6">
                      {leftColumn.map(renderCategory)}
                    </div>
                    <div className="fr-col-12 fr-col-md-6">
                      {rightColumn.map(renderCategory)}
                    </div>
                  </div>
                </div>
                <div className="fr-modal__footer">
                  <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                    <button aria-controls="fr-modal-selection-indicateur" className="fr-btn" onClick={() => setIndicators(pendingIndicators)}>
                      Valider
                    </button>
                    <button aria-controls="fr-modal-selection-indicateur" className="fr-btn fr-btn--secondary">
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    );
  }

  return { generateModal, enabledIndicators, openIndicatorSelectionModal };
}

