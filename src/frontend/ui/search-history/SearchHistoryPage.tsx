import "@gouvfr/dsfr/dist/component/table/table.min.css";

import { useMemo, useState } from "react";

import styles from "./SearchHistory.module.css";
import { SearchHistoryViewModel } from "./SearchHistoryViewModel";
import { ResultatRechercheHistorique } from "../../../backend/métier/entities/ResultatHistorique";
import { formatDateAndHours } from "../../utils/dateUtils";
import { useDependencies } from "../commun/contexts/useDependencies";
import { Table } from "../commun/Table/Table";

interface SearchHistoryProps {
  searchHistory: ResultatRechercheHistorique[];
}

enum OrderByValue {
  DATE = "date",
  TYPE = "type",
  SOCIAL_REASON = "socialReason",
  NUMERO_FINESS = "numeroFiness",
}

export function sortSearchHistoryRows(rows: SearchHistoryViewModel[], order: string, orderBy: string): SearchHistoryViewModel[] {
  if (!order) return rows;
  const sorted = [...rows];
  sorted.sort((a: SearchHistoryViewModel, b: SearchHistoryViewModel) => {
    let comparison = 0;
    if (orderBy === OrderByValue.DATE) {
      // les rawDates sont des timestamps, on les compare directement
      comparison = a.rawDate.localeCompare(b.rawDate);
    } else if (orderBy === OrderByValue.TYPE) {
      comparison = (a.type || "").localeCompare(b.type || "");
    } else if (orderBy === OrderByValue.SOCIAL_REASON) {
      comparison = (a.socialReason || "").localeCompare(b.socialReason || "");
    } else if (orderBy === OrderByValue.NUMERO_FINESS) {
      comparison = (a.numéroFiness || "").localeCompare(b.numéroFiness || "");
    } else {
      // Si le orderBy n'est pas reconnu, on ne change pas l'ordre
    }
    return order === "ASC" ? comparison : -comparison;
  });
  return sorted;
}

export const SearchHistoryPage = ({ searchHistory }: SearchHistoryProps) => {
  const { wording } = useDependencies();

  const [order, setOrder] = useState<string>("DESC");
  const [orderBy, setOrderBy] = useState<string>(OrderByValue.DATE);

  const headers = [
    { label: wording.ETABLISSEMENT_CONSULTE, nomComplet: wording.ETABLISSEMENT_CONSULTE, key: "socialReason", sort: true, orderBy: OrderByValue.SOCIAL_REASON },
    { label: wording.CATEGORIES_FINESS, nomComplet: wording.CATEGORIES_FINESS, key: "etsLogo", sort: true, orderBy: OrderByValue.TYPE },
    { label: wording.IMPORT_LIST_FINESS_HEADER, nomComplet: wording.IMPORT_LIST_FINESS_HEADER, key: "numéroFiness", sort: true, orderBy: OrderByValue.NUMERO_FINESS },
    { label: wording.DATE, nomComplet: wording.DATE, key: "date", sort: true, orderBy: OrderByValue.DATE },
  ];

  const mapped: SearchHistoryViewModel[] = (searchHistory || []).map((h) => ({
    numéroFiness: h.finessNumber,
    socialReason: h.title,
    date: formatDateAndHours(h.date),
    rawDate: h.date,
    type: h.type,
  }));

  const data = useMemo(() => sortSearchHistoryRows(mapped, order, orderBy), [mapped, order, orderBy]);

  return (
    <>
      <h1 className={styles["title"]}>{wording.HISTORIQUE_DE_RECHERECHE_TITRE}</h1>
      {searchHistory?.length === 0 ? (
        <div className={"fr-mt-8w " + styles["align-text"]}>Vous n&apos;avez aucune ancienne recherche</div>
      ) : (
        <Table
          data={data}
          headers={headers}
          isCenter={true}
          isShowAvrage={false}
          isSimpleSearchTable={true}
          isVScroll={false}
          onClickDelete={() => { }}
          order={order}
          orderBy={orderBy}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
        />
      )}
    </>
  );
};
