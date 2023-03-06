/*
 * Fonctionne du Feature Toggle :
 * - Pour pouvoir désactiver une fonctionnalité il faut d'abord l'enregistrer dans currentFeaturesToggled
 * - Pour l'activer il faut ajouter le nom de la feature dans la variable d'environnement "NEXT_PUBLIC_ENABLED_FEATURES"
 * - La variable d'environnement est un string avec le nom des features activées séparées par une virgule (ex : "COMPTE_RESULTAT_EJ, NOMBRE_PASSAGE_URGENCE")
 * - Dans le code applicatif utiliser la fonction "isFeatureEnabled" avec en paramètre le nom de la feature à vérifier.
 * - Une fois la feature définitivement activée on peut la supprimer de currentFeaturesToggled et des variables d'environnements
 * */

export enum FEATURE_NAME {
  "COMPTE_RESULTAT_EJ" = "COMPTE_RESULTAT_EJ",
}

const currentFeaturesToggled: FEATURE_NAME[] = [FEATURE_NAME.COMPTE_RESULTAT_EJ];
const currentEnabledFeatures: FEATURE_NAME[] = parseEnvEnabledFeature();

function parseEnvEnabledFeature(): FEATURE_NAME[] {
  const envEnabledFeature = process.env["NEXT_PUBLIC_ENABLED_FEATURES"];
  if (!envEnabledFeature) return [];
  return envEnabledFeature
    .split(",")
    .map((feature) => feature.trim())
    .filter((feature) => feature) as FEATURE_NAME[];
}

ParseUrlEnabledFeature();
function ParseUrlEnabledFeature(): FEATURE_NAME[] {
  return [];
}

export function buildFeatureToggleConfig(toggledFeatures: FEATURE_NAME[], enabledFeatures: FEATURE_NAME[]) {
  function isFeatureActivable(feature: FEATURE_NAME) {
    return toggledFeatures.includes(feature);
  }

  function isFeatureActivated(feature: FEATURE_NAME) {
    return enabledFeatures.includes(feature);
  }

  return function isFeatureEnabled(feature: FEATURE_NAME) {
    return !isFeatureActivable(feature) || (isFeatureActivable(feature) && isFeatureActivated(feature));
  };
}

export const isFeatureEnabled = buildFeatureToggleConfig(currentFeaturesToggled, currentEnabledFeatures);
