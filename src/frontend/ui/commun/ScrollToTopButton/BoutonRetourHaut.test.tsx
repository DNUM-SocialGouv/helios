import { render, screen, fireEvent } from "@testing-library/react";

import { BoutonRetourHaut } from "./BoutonRetourHaut";

describe("BoutonRetourHaut", () => {
  it("affiche un bouton avec le bon aria-label", () => {
    render(<BoutonRetourHaut />);
    expect(screen.getByRole("button", { name: "Retour en haut de page" })).toBeInTheDocument();
  });

  it("défile vers le haut au clic", () => {
    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;
    render(<BoutonRetourHaut />);
    fireEvent.click(screen.getByRole("button", { name: "Retour en haut de page" }));
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
