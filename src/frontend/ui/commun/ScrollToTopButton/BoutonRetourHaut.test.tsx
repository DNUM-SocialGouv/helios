import { act, fireEvent, render, screen } from "@testing-library/react";

import { BoutonRetourHaut } from "./BoutonRetourHaut";

const simulerScroll = (scrollY: number, headerHeight: number) => {
  Object.defineProperty(globalThis, "scrollY", { configurable: true, value: scrollY });
  jest.spyOn(document, "querySelector").mockReturnValue({ offsetHeight: headerHeight } as HTMLElement);
  act(() => {
    globalThis.dispatchEvent(new Event("scroll"));
  });
};

describe("BoutonRetourHaut", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "scrollY", { configurable: true, value: 0 });
    jest.spyOn(document, "querySelector").mockReturnValue({ offsetHeight: 100 } as HTMLElement);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("n'affiche pas le bouton avant d'avoir défilé", () => {
    render(<BoutonRetourHaut />);
    expect(screen.queryByRole("button", { name: "Retour en haut de page" })).not.toBeInTheDocument();
  });

  it("affiche le bouton après avoir défilé au-delà du header", () => {
    render(<BoutonRetourHaut />);
    simulerScroll(150, 100);
    expect(screen.getByRole("button", { name: "Retour en haut de page" })).toBeInTheDocument();
  });

  it("masque le bouton quand on remonte au-dessus du header", () => {
    render(<BoutonRetourHaut />);
    simulerScroll(150, 100);
    expect(screen.getByRole("button", { name: "Retour en haut de page" })).toBeInTheDocument();
    simulerScroll(50, 100);
    expect(screen.queryByRole("button", { name: "Retour en haut de page" })).not.toBeInTheDocument();
  });

  it("défile vers le haut au clic", () => {
    const scrollToMock = jest.fn();
    globalThis.scrollTo = scrollToMock;
    render(<BoutonRetourHaut />);
    simulerScroll(150, 100);
    fireEvent.click(screen.getByRole("button", { name: "Retour en haut de page" }));
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
