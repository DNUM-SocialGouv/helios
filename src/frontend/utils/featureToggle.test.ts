import { buildFeatureToggleConfig, FEATURE_NAME } from "./featureToggle";

describe("isFeatureEnabled", () => {
  it("doit renvoyer true si la fonctionnalité n'a pas de feature flipping", () => {
    // GIVEN
    const isFeatureEnabled = buildFeatureToggleConfig([], []);

    // WHEN
    const result = isFeatureEnabled(FEATURE_NAME.COMPTE_RESULTAT_EJ);

    // THEN
    expect(result).toBe(true);
  });

  it("doit renvoyer false si la fonctionnalité est feature flippée et qu'elle n'est pas activée", () => {
    // GIVEN
    const isFeatureEnabled = buildFeatureToggleConfig([FEATURE_NAME.COMPTE_RESULTAT_EJ], []);

    // WHEN
    const result = isFeatureEnabled(FEATURE_NAME.COMPTE_RESULTAT_EJ);

    // THEN
    expect(result).toBe(false);
  });

  it("doit renvoyer true si la fonctionnalité est feature flippée et qu'elle est pas activée", () => {
    // GIVEN
    const isFeatureEnabled = buildFeatureToggleConfig([FEATURE_NAME.COMPTE_RESULTAT_EJ], [FEATURE_NAME.COMPTE_RESULTAT_EJ]);

    // WHEN
    const result = isFeatureEnabled(FEATURE_NAME.COMPTE_RESULTAT_EJ);

    // THEN
    expect(result).toBe(true);
  });
});
