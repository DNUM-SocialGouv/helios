import React, { Dispatch, SetStateAction } from "react";

import styles from "./SelectionAnneeTag.module.css";
import { LogoEntiteJuridiqueSvg } from "../../entité-juridique/bloc-activité/LogoEntitéJuridique";
import { LogoEtablissementTerritorialMedicoSociauxSvg } from "../../établissement-territorial-médico-social/logo-établissement-territorial-médico-social";
import { LogoEtablissementTerritorialSanitaireSvg } from "../../établissement-territorial-sanitaire/logo-établissement-territorial-sanitaire";

export const SelectionTags = ({
  choices,
  noSelectableChoices,
  selectedChoice,
  setSelectedChoice,
}: {
  choices: string[];
  noSelectableChoices: string[];
  selectedChoice: string;
  setSelectedChoice: Dispatch<SetStateAction<string>>;
}) => {
  const handleChoiceClick = (choice: string) => {
    setSelectedChoice(choice);
  };

  const logoCodeCouleur = (choice: string): string => {
    const codeColorOfDisabled = "#808080";
    const codeColorOfSelected = "#000091";
    return choice !== choiceLibelle(selectedChoice) ? codeColorOfDisabled : codeColorOfSelected;
  };

  const getlogoByEtsType = (choice: string): JSX.Element | string => {
    if (choice === "Sanitaire") return LogoEtablissementTerritorialSanitaireSvg(logoCodeCouleur(choice));
    if (choice === "Social et Médico-social") return LogoEtablissementTerritorialMedicoSociauxSvg(logoCodeCouleur(choice));
    if (choice === "Entités Juridiques") return LogoEntiteJuridiqueSvg(logoCodeCouleur(choice));
    return "";
  };

  const choiceLibelle = (choice: string) => {
    return choice === "Médico-social" ? "Social et Médico-social" : choice;
  };

  return (
    <ul className="fr-tags-group">
      {choices.map((choice, index) => (
        <li data-testid="groupe-annees" key={index}>
          <button
            className={`fr-tag ${selectedChoice === choice ? styles["tag-active"] : ""} `}
            disabled={!noSelectableChoices.includes(choice)}
            key={index}
            onClick={() => handleChoiceClick(choice)}
          >
            <span className={styles["logo-container"]}>{getlogoByEtsType(choiceLibelle(choice))}</span>
            {choiceLibelle(choice)}
          </button>
        </li>
      ))}
    </ul>
  );
};
