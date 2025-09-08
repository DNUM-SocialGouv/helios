import { screen } from "@testing-library/react";

import { Catégorisation } from "./Catégorisation";
import { CatégorisationViewModel } from "./CatégorisationViewModel";
import { CatégorisationEnum } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridique";
import { fakeFrontDependencies, renderFakeComponent } from "../../../test-helpers/testHelper";

const { wording } = fakeFrontDependencies;

describe("Catégorisation", () => {
  it("affiche la catégorisation PRIVÉ LUCRATIF", () => {
    // GIVEN
    const catégorisationViewModel = new CatégorisationViewModel(CatégorisationEnum.PRIVE_LUCRATIF, wording);

    // WHEN
    renderFakeComponent(<Catégorisation catégorisationViewModel={catégorisationViewModel} />);

    // THEN
    const categorisation = screen.getByText(wording.PRIVÉ_LUCRATIF);
    expect(categorisation).toBeInTheDocument();
  });

  it("affiche la catégorisation PRIVÉ NON LUCRATIF", () => {
    // GIVEN
    const catégorisationViewModel = new CatégorisationViewModel(CatégorisationEnum.PRIVE_NON_LUCRATIF, wording);

    // WHEN
    renderFakeComponent(<Catégorisation catégorisationViewModel={catégorisationViewModel} />);

    // THEN
    const categorisation = screen.getByText(wording.PRIVÉ_NON_LUCRATIF);
    expect(categorisation).toBeInTheDocument();
  });

  it("affiche la catégorisation PUBLIC", () => {
    // GIVEN
    const catégorisationViewModel = new CatégorisationViewModel(CatégorisationEnum.PUBLIC, wording);

    // WHEN
    renderFakeComponent(<Catégorisation catégorisationViewModel={catégorisationViewModel} />);

    // THEN
    const categorisation = screen.getByText(wording.PUBLIC);
    expect(categorisation).toBeInTheDocument();
  });

  it("affiche la catégorisation PERSONNE MORALE DE DROIT ÉTRANGER", () => {
    // GIVEN
    const catégorisationViewModel = new CatégorisationViewModel(CatégorisationEnum.PERSONNE_MORALE_DROIT_ETRANGER, wording);

    // WHEN
    renderFakeComponent(<Catégorisation catégorisationViewModel={catégorisationViewModel} />);

    // THEN
    const categorisation = screen.getByText(wording.PERSONNE_MORALE_DROIT_ÉTRANGER);
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
