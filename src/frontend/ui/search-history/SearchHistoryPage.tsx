import "@gouvfr/dsfr/dist/component/table/table.min.css";

import { useMemo, useState } from "react";

import styles from "./SearchHistory.module.css";
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
  TITLE = "title",
  NUMERO_FINESS = "numero_finess",
}

export const SearchHistoryPage = ({ searchHistory }: SearchHistoryProps) => {
  const { wording } = useDependencies();

  const [order, setOrder] = useState<string>("DESC");
  const [orderBy, setOrderBy] = useState<string>(OrderByValue.DATE);

  const headers = [
    { label: wording.ETABLISSEMENT_CONSULTE, nomComplet: wording.ETABLISSEMENT_CONSULTE, key: "socialReason", sort: true, orderBy: OrderByValue.TITLE },
    { label: wording.CATEGORIES_FINESS, nomComplet: wording.CATEGORIES_FINESS, key: "etsLogo", sort: true, orderBy: OrderByValue.TYPE },
    { label: wording.IMPORT_LIST_FINESS_HEADER, nomComplet: "N° FINESS", key: "numéroFiness", sort: true, orderBy: OrderByValue.NUMERO_FINESS },
    { label: wording.DATE, nomComplet: wording.DATE, key: "date", sort: true, orderBy: OrderByValue.DATE },
  ];

  type SearchHistoryRow = {
    numéroFiness: string;
    socialReason: string;
    title: string;
    date: string;
    rawDate: string;
    type: string;
  };

  const mapped: SearchHistoryRow[] = (searchHistory || []).map((h) => ({
    numéroFiness: h.finessNumber,
    socialReason: h.title,
    title: h.title,
    date: formatDateAndHours(h.date),
    rawDate: h.date,
    type: h.type,
  }));

  const data = useMemo(() => {
    if (!order) return mapped;
    const sortedHistory = [...mapped];
    sortedHistory.sort((a: SearchHistoryRow, b: SearchHistoryRow) => {
      let comparison = 0;
      if (orderBy === OrderByValue.DATE) {
        const ta = a.rawDate ? new Date(a.rawDate).getTime() : 0;
        const tb = b.rawDate ? new Date(b.rawDate).getTime() : 0;
        comparison = ta - tb;
      } else if (orderBy === OrderByValue.TYPE) {
        comparison = (a.type || "").localeCompare(b.type || "");
      } else if (orderBy === OrderByValue.TITLE) {
        comparison = (a.title || "").localeCompare(b.title || "");
      } else if (orderBy === OrderByValue.NUMERO_FINESS) {
        comparison = (a.numéroFiness || "").localeCompare(b.numéroFiness || "");
      } else {
        // Si la colonne à trier n'est pas reconnue, on ne trie pas
      }
      return order === "ASC" ? comparison : -comparison;
    });
    return sortedHistory;
  }, [mapped, order, orderBy]);

  return (
    <>
      <h1 className={styles["title"]}>{wording.HISTORIQUE_DE_RECHERECHE_TITRE}</h1>
      {searchHistory?.length === 0 ? (
        <div className={"fr-mt-8w " + styles["align-text"]}>Vous n&apos;avez aucune ancienne recherche</div>
      ) : (
        <Table
          data={data as any}
          headers={headers as any}
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
