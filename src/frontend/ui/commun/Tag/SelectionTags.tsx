import Image from 'next/image';
import React, { useState } from 'react';

import LogoÉtablissementTerritorialMédicoSocial from "../../entité-juridique/liste-des-établissements/logo-établissement-territorial-médico-social-noir.svg";
import LogoÉtablissementTerritorialSanitaire from "../../entité-juridique/liste-des-établissements/logo-établissement-territorial-sanitaire-noir.svg";
import LogoEntitéJuridiqueNoir from "../../home/logo-entité-juridique-noir.svg";
import styles from "./SelectionAnneeTag.module.css"


export const SelectionTags = ({ choices }: { choices: string[] }) => {
  const [selectedChoice, setSelectedChoice] = useState<string>("");

  const handleChoiceClick = (choice: string) => {
    setSelectedChoice(choice);
  };

  const getlogoByEtsType = (choice: string): JSX.Element | string => {      
    if (choice === "Sanitaire") return <Image alt="" height="20" src={LogoÉtablissementTerritorialSanitaire} width="20" />;
    if (choice === "Social et Médico-social") return <Image alt="" height="20" src={LogoÉtablissementTerritorialMédicoSocial} width="20" />
    if (choice === "Entités Juridiques") return <Image alt="" height="20" src={LogoEntitéJuridiqueNoir} width="20" />
    return ""
  }

  return (
    <ul className="fr-tags-group">
      {choices.map((choice, index) => (
        <li data-testid="groupe-annees" key={index}>
          <button
            className={`fr-tag ${selectedChoice === choice ? styles["tag-active"] : ""} `}
            key={index}
            onClick={() => handleChoiceClick(choice)}
          >
            <span className={styles["logo-container"]}>{getlogoByEtsType(choice)}</span>
            {choice}
          </button>
        </li>
      ))}
    </ul>
  );
};
