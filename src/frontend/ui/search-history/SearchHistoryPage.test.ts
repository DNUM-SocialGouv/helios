import { sortSearchHistoryRows } from "./SearchHistoryPage";

describe("sortSearchHistoryRows", () => {
  const rows = [
    { numéroFiness: "200", socialReason: "Beta", date: "01/01/2026 10:00", rawDate: "2026-01-01T10:00:00Z", type: "B", categorie: "2-two", libelleCategorie: "libelle2" },
    { numéroFiness: "100", socialReason: "Alpha", date: "02/01/2026 09:00", rawDate: "2026-01-02T09:00:00Z", type: "A", categorie: "1-one", libelleCategorie: "libelle1" },
    { numéroFiness: "300", socialReason: "Charlie", date: "03/01/2026 08:00", rawDate: "2026-01-03T08:00:00Z", type: "C", categorie: "3-three", libelleCategorie: "libelle3" },
  ];

  it("sorts by date ascending", () => {
    const sorted = sortSearchHistoryRows(rows, "ASC", "date");
    expect(sorted.map(r => r.rawDate)).toEqual(["2026-01-01T10:00:00Z", "2026-01-02T09:00:00Z", "2026-01-03T08:00:00Z"]);
  });

  it("sorts by date descending", () => {
    const sorted = sortSearchHistoryRows(rows, "DESC", "date");
    expect(sorted.map(r => r.rawDate)).toEqual(["2026-01-03T08:00:00Z", "2026-01-02T09:00:00Z", "2026-01-01T10:00:00Z"]);
  });

  it("sorts by socialReason ascending", () => {
    const shuffled = [rows[1], rows[2], rows[0]]; // Alpha, Charlie, Beta
    const sorted = sortSearchHistoryRows(shuffled, "ASC", "socialReason");
    expect(sorted.map(r => r.socialReason)).toEqual(["Alpha", "Beta", "Charlie"]);
  });

  it("sorts by socialReason descending", () => {
    const shuffled = [rows[1], rows[2], rows[0]]; // Alpha, Charlie, Beta
    const sorted = sortSearchHistoryRows(shuffled, "DESC", "socialReason");
    expect(sorted.map(r => r.socialReason)).toEqual(["Charlie", "Beta", "Alpha"]);
  });

  it("sorts by numéro finess (string) ascending", () => {
    const shuffled = [rows[2], rows[0], rows[1]]; // 300,200,100
    const sorted = sortSearchHistoryRows(shuffled, "ASC", "numeroFiness");
    expect(sorted.map(r => r.numéroFiness)).toEqual(["100", "200", "300"]);
  });

  it("sorts by numéro finess (string) descending", () => {
    const shuffled = [rows[1], rows[0], rows[2]];
    const sorted = sortSearchHistoryRows(shuffled, "DESC", "numeroFiness");
    expect(sorted.map(r => r.numéroFiness)).toEqual(["300", "200", "100"]);
  });

  it("sorts by type descending", () => {
    const shuffled = [rows[0], rows[1], rows[2]];
    const sorted = sortSearchHistoryRows(shuffled, "DESC", "type");
    expect(sorted.map(r => r.type)).toEqual(["C", "B", "A"]);
  });

  it("sorts by type ascending", () => {
    const shuffled = [rows[2], rows[0], rows[1]];
    const sorted = sortSearchHistoryRows(shuffled, "ASC", "type");
    expect(sorted.map(r => r.type)).toEqual(["A", "B", "C"]);
  });

  it("sorts by categorie ascending", () => {
    const shuffled = [rows[1], rows[2], rows[0]]; // Alpha, Charlie, Beta
    const sorted = sortSearchHistoryRows(shuffled, "ASC", "categorie");
    expect(sorted.map(r => r.categorie)).toEqual(["1-one", "2-two", "3-three"]);
  });

  it("sorts by categorie descending", () => {
    const shuffled = [rows[1], rows[2], rows[0]]; // Alpha, Charlie, Beta
    const sorted = sortSearchHistoryRows(shuffled, "DESC", "categorie");
    expect(sorted.map(r => r.categorie)).toEqual(["3-three", "2-two", "1-one"]);
  });

  it("returns empty array when rows is empty", () => {
    const sorted = sortSearchHistoryRows([], "ASC", "date");
    expect(sorted).toEqual([]);
  });

  it("keeps original order when orderBy is unknown", () => {
    const shuffled = [rows[1], rows[0], rows[2]];
    const sorted = sortSearchHistoryRows(shuffled, "ASC", "unknown_key");
    expect(sorted).toEqual(shuffled);
  });
});
