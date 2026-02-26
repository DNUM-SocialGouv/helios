import { screen, fireEvent, within } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";

import { SearchHistoryPage } from "./SearchHistoryPage";
import { fakeFrontDependencies, renderFakeComponent } from "../../test-helpers/testHelper";

const { wording } = fakeFrontDependencies;
const mockSession = {
  name: "john",
  email: "test@test.fr",
  user: {
    idUser: "1",
    firstname: "Doe",
    role: 1,
    institution: {},
    institutionId: 1,
    codeRegion: 84,
    codeProfiles: [""],
  },
  expires: "1235",
};

const rows = [
  { numéroFiness: "200", socialReason: "Beta", date: "01/01/2026 10:00", rawDate: "2026-01-01T10:00:00.000Z", type: "B" },
  { numéroFiness: "100", socialReason: "Alpha", date: "02/01/2026 09:00", rawDate: "2026-01-02T09:00:00.000Z", type: "A" },
  { numéroFiness: "300", socialReason: "Charlie", date: "03/01/2026 08:00", rawDate: "2026-01-03T08:00:00.000Z", type: "C" },
];

function renderPage(props: any = {}) {
  return renderFakeComponent(
    <SessionProvider session={mockSession}>
      <SearchHistoryPage
        searchHistory={props.searchHistory ?? rows.map(r => ({ title: r.socialReason, date: r.rawDate, finessNumber: r.numéroFiness, type: r.type }))}
      />
    </SessionProvider>
  );
}

describe("SearchHistoryPage integration", () => {
  it("renders table headers and rows", () => {
    renderPage();

    // Vérification de l’affichage des Headers
    const columnHeaders = screen.getAllByRole("columnheader");
    expect(columnHeaders.some(h => h.getAttribute("title") === wording.IMPORT_LIST_FINESS_HEADER)).toBeTruthy();
    expect(columnHeaders.some(h => h.getAttribute("title") === wording.CATEGORIES_FINESS)).toBeTruthy();
    expect(columnHeaders.some(h => h.getAttribute("title") === wording.ETABLISSEMENT_CONSULTE)).toBeTruthy();
    expect(columnHeaders.some(h => h.getAttribute("title") === wording.DATE)).toBeTruthy();

    // Vérification de l’affichage des lignes
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("clicking header sorts the table", () => {
    renderPage();

    // Le tri par défaut est par date DESC, donc la première ligne devrait être Charlie (le plus récent)
    const initialFirstRow = screen.getAllByRole("row")[1];
    expect(initialFirstRow).toHaveTextContent("Charlie");

    // On recherche le boutton de tri
    const dateHeaderCell = screen.getAllByRole("columnheader").find(h => h.getAttribute("title") === wording.DATE);
    expect(dateHeaderCell).toBeDefined();
    const dateSortButton = within(dateHeaderCell as HTMLElement).getByRole("button");
    // On clique 2 fois sur le boutton car le cycle est : DESC -> "" -> ASC
    fireEvent.click(dateSortButton);
    fireEvent.click(dateSortButton);

    // On vérifie que le tri ASC est appliqué (le plus ancien en premier) et que la première ligne est Beta
    const firstRowAfterSort = screen.getAllByRole("row")[1];
    expect(firstRowAfterSort).toHaveTextContent("Beta");

    // On clique à nouveau et on vérifie que le tri DESC est appliqué et que la première ligne est Charlie
    fireEvent.click(dateSortButton);
    const firstRowAfterDesc = screen.getAllByRole("row")[1];
    expect(firstRowAfterDesc).toHaveTextContent("Charlie");
  });

  it("clicking socialReason header sorts the table by social reason", () => {
    renderPage();

    // On tri la raison sociale par ordre ASC
    const socialHeader = screen.getAllByRole("columnheader").find(h => h.getAttribute("title") === wording.ETABLISSEMENT_CONSULTE);
    expect(socialHeader).toBeDefined();
    const socialSortButton = within(socialHeader as HTMLElement).getByRole("button");
    fireEvent.click(socialSortButton);

    // On vérifie que le tri ASC est appliqué et que la première ligne est Alpha
    const firstRow = screen.getAllByRole("row")[1];
    expect(firstRow).toHaveTextContent("Alpha");

    // On trie la raison sociale par ordre DESC
    fireEvent.click(socialSortButton);

    // On vérifie que le tri DESC est appliqué et que la première ligne est Charlie
    const firstRowDesc = screen.getAllByRole("row")[1];
    expect(firstRowDesc).toHaveTextContent("Charlie");
  });

  it("clicking category header sorts the table by type", () => {
    renderPage();

    // On tri la catégorie par ordre ASC
    const catHeader = screen.getAllByRole("columnheader").find(h => h.getAttribute("title") === wording.CATEGORIES_FINESS);
    expect(catHeader).toBeDefined();
    const catSortButton = within(catHeader as HTMLElement).getByRole("button");
    fireEvent.click(catSortButton);

    // On vérifie que le tri ASC est appliqué et que la première ligne est Alpha (type A)
    const firstRow = screen.getAllByRole("row")[1];
    expect(firstRow).toHaveTextContent("Alpha");

    // On tri la catégorie par ordre DESC
    fireEvent.click(catSortButton);

    // On vérifie que le tri DESC est appliqué et que la première ligne est Charlie (type C)
    const firstRowDesc = screen.getAllByRole("row")[1];
    expect(firstRowDesc).toHaveTextContent("Charlie");
  });

  it("clicking N° FINESS header sorts the table by numéro finess", () => {
    renderPage();

    // On tri le numéro finess par ordre ASC
    const numHeader = screen.getAllByRole("columnheader").find(h => h.getAttribute("title") === wording.IMPORT_LIST_FINESS_HEADER);
    expect(numHeader).toBeDefined();
    const numSortButton = within(numHeader as HTMLElement).getByRole("button");
    fireEvent.click(numSortButton);

    // On vérifie que le tri ASC est appliqué et que la première ligne est Alpha (numéro finess 100)
    const firstRow = screen.getAllByRole("row")[1];
    expect(firstRow).toHaveTextContent("Alpha");

    // On tri le numéro finess par ordre DESC
    fireEvent.click(numSortButton);

    // On vérifie que le tri DESC est appliqué et que la première ligne est Charlie (numéro finess 300)
    const firstRowDesc = screen.getAllByRole("row")[1];
    expect(firstRowDesc).toHaveTextContent("Charlie");
  });
});
