import { fireEvent, screen } from "@testing-library/react";

import { Wording } from "../configuration/wording/Wording";
import { textMatch } from "./testHelper";

export class GraphiqueTest {
  constructor(private wording: Wording) {}

  get détail(): HTMLElement {
    return screen.getByRole("button", { name: this.wording.DÉTAILS });
  }

  abréviationFichierSource(abréviation: string): HTMLElement {
    return screen.getAllByText(abréviation, { selector: "abbr" })[0];
  }

  titre(titre: string): HTMLElement {
    return screen.getByText(titre, { selector: "p" });
  }

  titreDétail(titre: string): HTMLElement {
    return screen.getByRole("heading", {
      level: 1,
      name: titre,
    });
  }

  ouvreDétail(): void {
    fireEvent.click(this.détail);
  }

  fermeDétail() {
    const fermer = screen.getByRole("button", { name: this.wording.FERMER });
    fireEvent.click(fermer);
  }

  dateMiseAJour(fichier: string, date: string): HTMLElement[] {
    return screen.getAllByText(textMatch(`${this.wording.miseÀJour(date)} - Source : ${fichier}`), {
      selector: "p",
    });
  }

  get boutonAfficherTranscription(): HTMLElement {
    return screen.getByText(this.wording.AFFICHER_LA_TRANSCRIPTION);
  }

  get transcriptionTable(): HTMLElement {
    return screen.getByRole("table");
  }

  afficherLaTranscription(): void {
    fireEvent.click(this.boutonAfficherTranscription);
  }
}
