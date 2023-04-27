import { screen } from "@testing-library/react";

import { fakeFrontDependencies, renderFakeComponent } from "../../test-helpers/testHelper";
import { PageRégion } from "./PageRégion";
import { régions } from "./régions";

const { wording } = fakeFrontDependencies;

describe("La page d’une région", () => {
  it.each([
    ["france-metropolitaine", régions["france-metropolitaine"].label, régions["france-metropolitaine"].source],
    ["outre-mer", régions["outre-mer"].label, régions["outre-mer"].source],
  ])("affiche la carte de %s", (région, label, source) => {
    // WHEN
    renderFakeComponent(<PageRégion région={région} />);

    // THEN
    expect(screen.getByRole("heading", { level: 1, name: label })).toBeInTheDocument();
    expect(screen.getByTitle(wording.régionAtlasSanté(label))).toHaveAttribute("src", source);
    expect(screen.getByText(wording.COOKIES_ATLASSANTÉ, { selector: "p" })).toBeInTheDocument();
  });
});
