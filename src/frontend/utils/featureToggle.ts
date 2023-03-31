/*
 * Fonctionne du Feature Toggle :
 * - Pour pouvoir désactiver une fonctionnalité il faut d'abord l'enregistrer dans currentFeaturesToggled
 * - Pour l'activer il faut ajouter le nom de la feature dans la variable d'environnement "NEXT_PUBLIC_ENABLED_FEATURES"
 * - La variable d'environnement est un string avec le nom des features activées séparées par une virgule (ex : "COMPTE_RESULTAT_EJ, NOMBRE_PASSAGE_URGENCE")
 * - Dans le code applicatif utiliser la fonction "isFeatureEnabled" avec en paramètre le nom de la feature à vérifier.
 * - Une fois la feature définitivement activée on peut la supprimer de currentFeaturesToggled et des variables d'environnements
 * */

import { ParsedUrlQuery } from "querystring";

export enum FEATURE_NAME {
  "COMPTE_RESULTAT_EJ" = "COMPTE_RESULTAT_EJ",
  "CAPACITES_EJ" = "CAPACITES_EJ",
  "ECO_CONCEPTION" = "ECO_CONCEPTION",
}

const currentFeaturesToggled: FEATURE_NAME[] = [FEATURE_NAME.COMPTE_RESULTAT_EJ, FEATURE_NAME.ECO_CONCEPTION, FEATURE_NAME.CAPACITES_EJ];
const currentEnabledFeatures: FEATURE_NAME[] = parseEnvEnabledFeature();

function parseEnvEnabledFeature(): FEATURE_NAME[] {
  const envEnabledFeature = process.env["NEXT_PUBLIC_ENABLED_FEATURES"];
  if (!envEnabledFeature) return [];
  return envEnabledFeature
    .split(",")
    .map((feature) => feature.trim())
    .filter((feature) => feature) as FEATURE_NAME[];
}

export function buildFeatureToggleConfig(toggledFeatures: FEATURE_NAME[], enabledFeatures: FEATURE_NAME[]) {
  function isFeatureActivable(feature: FEATURE_NAME) {
    return toggledFeatures.includes(feature);
  }

  function isFeatureActivated(feature: FEATURE_NAME) {
    return enabledFeatures.includes(feature);
  }

  function shouldBypassFeatureToggle(urlQuery?: ParsedUrlQuery): boolean {
    return !!urlQuery && urlQuery["feature_toggle"] === "off";
  }

  return (urlQuery?: ParsedUrlQuery) => {
    return function isFeatureEnabled(feature: FEATURE_NAME) {
      return shouldBypassFeatureToggle(urlQuery) || !isFeatureActivable(feature) || (isFeatureActivable(feature) && isFeatureActivated(feature));
    };
  };
}

export const isFeatureEnabled = buildFeatureToggleConfig(currentFeaturesToggled, currentEnabledFeatures);
