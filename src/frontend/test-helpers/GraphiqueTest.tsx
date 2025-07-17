import { fireEvent, screen } from "@testing-library/react";

import { textMatch } from "./testHelper";
import { Wording } from "../configuration/wording/Wording";

/*
 * Class utilitaire pour faciliter les tests des blocs de graphiques avec React Testing Library
 * @Todo : Refacto => utiliser cette classe dans tous les tests sur des bloc de graphique
 * @Todo : Améliorer cette classe pour pouvoir tester plus facilement le contenu de la transcription, la mise en exergue et la sélection des années
 * */
export class GraphiqueTest {
  constructor(private wording: Wording) {}

  get détail(): HTMLElement {
    return screen.getByRole("button", { name: this.wording.DÉTAILS });
  }

  abréviationFichierSource(abréviation: string): HTMLElement {
    return screen.getAllByText(abréviation, { selector: "abbr" })[0];
  }

  titre(titre: string): HTMLElement | null {
    return screen.queryByText(titre, { selector: "h3" });
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
    fireEvent.click(this.boutonFermerDétail);
  }

  get boutonFermerDétail() {
    return screen.getAllByRole("button", { name: this.wording.FERMER })[1];
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

  miseEnExergue(années: number[]): HTMLElement {
    return screen.getByText(`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${années.join(", ")}`, {
      selector: "p",
    });
  }
}
