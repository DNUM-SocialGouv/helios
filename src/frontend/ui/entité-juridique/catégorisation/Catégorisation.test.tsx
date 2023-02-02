import { screen } from "@testing-library/react";

import { fakeFrontDependencies, renderFakeComponent } from "../../../testHelper";
import { CatégorisationViewModel } from "../EntitéJuridiqueViewModel";
import { Catégorisation } from "./Catégorisation";

const { wording } = fakeFrontDependencies;

describe("Catégorisation", () => {
  it("affiche la catégorisation PRIVÉ LUCRATIF", () => {
    // GIVEN
    const catégorisationViewModel = new CatégorisationViewModel("prive_lucratif", wording);

    // WHEN
    renderFakeComponent(<Catégorisation catégorisationViewModel={catégorisationViewModel} />);

    // THEN
    const categorisation = screen.getByText("PRIVÉ LUCRATIF");
    expect(categorisation).toBeInTheDocument();
  });

  it("affiche la catégorisation PRIVÉ NON LUCRATIF", () => {
    // GIVEN
    const catégorisationViewModel = new CatégorisationViewModel("prive_non_lucratif", wording);

    // WHEN
    renderFakeComponent(<Catégorisation catégorisationViewModel={catégorisationViewModel} />);

    // THEN
    const categorisation = screen.getByText("PRIVÉ NON LUCRATIF");
    expect(categorisation).toBeInTheDocument();
  });

  it("affiche la catégorisation PUBLIC", () => {
    // GIVEN
    const catégorisationViewModel = new CatégorisationViewModel("public", wording);

    // WHEN
    renderFakeComponent(<Catégorisation catégorisationViewModel={catégorisationViewModel} />);

    // THEN
    const categorisation = screen.getByText("PUBLIC");
    expect(categorisation).toBeInTheDocument();
  });

  it("affiche la catégorisation PERSONNE MORALE DE DROIT ÉTRANGER", () => {
    // GIVEN
    const catégorisationViewModel = new CatégorisationViewModel("personne_morale_droit_etranger", wording);

    // WHEN
    renderFakeComponent(<Catégorisation catégorisationViewModel={catégorisationViewModel} />);

    // THEN
    const categorisation = screen.getByText("PERSONNE MORALE DE DROIT ÉTRANGER");
    expect(categorisation).toBeInTheDocument();
  });

  it("n'affiche rien s'il n'y a pas de catégorisation", () => {
    // GIVEN
    const catégorisationViewModel = new CatégorisationViewModel(null, wording);
    // WHEN
    const { container } = renderFakeComponent(<Catégorisation catégorisationViewModel={catégorisationViewModel} />);

    // THEN
    expect(container).toBeEmptyDOMElement();
  });
});
