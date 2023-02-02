import { screen } from "@testing-library/react";

import { renderFakeComponent } from "../../../testHelper";
import { Catégorisation } from "./Catégorisation";

describe("Catégorisation", () => {
  it("affiche la catégorisation PRIVÉ LUCRATIF", () => {
    // WHEN
    renderFakeComponent(<Catégorisation />);

    // THEN
    const categorisation = screen.getByText("PRIVÉ LUCRATIF");
    expect(categorisation).toBeInTheDocument();
  });

  it("affiche la catégorisation PRIVÉ NON LUCRATIF", () => {
    // WHEN
    renderFakeComponent(<Catégorisation />);

    // THEN
    const categorisation = screen.getByText("PRIVÉ NON LUCRATIF");
    expect(categorisation).toBeInTheDocument();
  });
});
