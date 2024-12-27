import PaginationBtn from "../../../parametrage-utilisateurs/UsersListPage/Pagination/PaginationBtn/PaginationBtn";
import styles from "./RechercheAvanceeFooter.module.css";

export type PaginationEts = {
  lastPage: number;
  page: number;
  setPage: (page: number) => void;
};

type TableFooterRechercheAvanceeProps = {
  nombreRésultats: number;
  nombreDeResultatsMaxParPage: number
} & PaginationEts;

export const TableFooterRechercheAvancee = ({ nombreRésultats, lastPage, page, setPage, nombreDeResultatsMaxParPage }: TableFooterRechercheAvanceeProps) => {
  return (
    <div className={styles["footer-container"]} data-testid="footer-container">
      <span className={"fr-table__detail " + styles["number-lines-container"]} data-testid="number-lines-container">
        {nombreRésultats + (nombreRésultats > 1 ? " établissements" : " établissement")}
      </span>
      {nombreRésultats > nombreDeResultatsMaxParPage && (
        <div className={styles["pagination-container"]} data-testid="pagination-container">
          <PaginationBtn paginationData={{ lastPage, page, setPage }} />
        </div>
      )}
    </div>
  );
};
