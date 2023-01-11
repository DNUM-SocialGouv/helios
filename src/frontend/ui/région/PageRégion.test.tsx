import { screen } from "@testing-library/react";

import { fakeFrontDependencies, renderFakeComponent } from "../../testHelper";
import { PageRégion } from "./PageRégion";
import { régions } from "./régions";

const { wording } = fakeFrontDependencies;

describe("La page d’une région", () => {
  it.each([
    ["auvergne-rhone-alpes", régions["auvergne-rhone-alpes"].label, régions["auvergne-rhone-alpes"].source],
    ["bretagne", régions["bretagne"].label, régions["bretagne"].source],
    ["occitanie", régions["occitanie"].label, régions["occitanie"].source],
    ["pays-de-la-loire", régions["pays-de-la-loire"].label, régions["pays-de-la-loire"].source],
  ])("affiche la carte de %s", (région, label, source) => {
    // WHEN
    renderFakeComponent(<PageRégion région={région} />);

    // THEN
    expect(screen.getByRole("heading", { level: 1, name: label })).toBeInTheDocument();
    expect(screen.getByTitle(wording.régionAtlasSanté(label))).toHaveAttribute("src", source);
  });
});
