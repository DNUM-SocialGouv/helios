/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */

import "@gouvfr/dsfr/dist/component/pagination/pagination.min.css";

import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/select/select.min.css";

import styles from "./PaginationBtn.module.css";

type PaginationBtnProps = Readonly<{
  total: number;
  lastPage: number;
  setUserData: any;
  setPage: any;
  page: number;
  keyWord: string;
}>;

export const PaginationBtn = ({ setUserData, setPage, lastPage, page, keyWord }: PaginationBtnProps) => {
  const intervalRecursive = (x: number, y: number, accum = []) => {
    if (x + 1 === y) return accum;
    return intervalRecursive(x + 1, y, accum.concat(x + 1));
  };

  const changePage = async (e: MouseEvent, page: number) => {
    e.preventDefault();

    const params = { key: keyWord, sort: "", page: page };
    await fetch("/api/utilisateurs/getUsers?" + new URLSearchParams(params).toString(), {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    })
      .then((response) => response.json())
      .then((users) => {
        setUserData(users.data);
        setPage(users.currentPage);
      });
  };

  return (
    <div className={styles["pagination_container"]}>
      {lastPage > 1 && (
        <nav aria-label="Pagination" className="fr-pagination" role="navigation">
          <ul className="fr-pagination__list">
            <li>
              <a
                className={`fr-pagination__link fr-pagination__link--first  ${page === 1 ? styles["disabledBtn"] : styles["enabledBtn"]}`}
                onClick={(e) => changePage(e, 1)}
              >
                Première page
              </a>
            </li>
            <li>
              <a
                className={`fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label 
              ${page === 1 ? styles["disabledBtn"] : styles["enabledBtn"]}`}
                onClick={(e) => changePage(e, page - 1)}
              >
                Page précédente
              </a>
            </li>
            {lastPage <= 11 &&
              [...Array(lastPage)].map((p, i) => (
                <li key={i}>
                  <a
                    className={`fr-pagination__link ${page === i + 1 && styles["currentPage"]}`}
                    href="#"
                    onClick={(e) => changePage(e, i + 1)}
                    title={`Page ${i + 1}`}
                  >
                    {i + 1}
                  </a>
                </li>
              ))}

            {lastPage > 11 &&
              page > 5 &&
              page < lastPage - 5 &&
              [page - 4, page - 3, page - 2, page - 1, page, page + 1, page + 2, page + 3, page + 4, page + 5].map((p, i) => (
                <li key={i}>
                  <a className={`fr-pagination__link ${page === p && styles["currentPage"]}`} href="#" onClick={(e) => changePage(e, p)} title={`Page ${p}`}>
                    {p}
                  </a>
                </li>
              ))}

            {lastPage > 11 &&
              page <= 5 &&
              [...intervalRecursive(0, 11)].map((p, i) => (
                <li key={i}>
                  <a className={`fr-pagination__link ${page === p && styles["currentPage"]}`} href="#" onClick={(e) => changePage(e, p)} title={`Page ${p}`}>
                    {p}
                  </a>
                </li>
              ))}

            {lastPage > 11 &&
              page >= lastPage - 5 &&
              [...intervalRecursive(lastPage - 11, lastPage + 1)].map((p, i) => (
                <li key={i}>
                  <a className={`fr-pagination__link ${page === p && styles["currentPage"]}`} href="#" onClick={(e) => changePage(e, p)} title={`Page ${p}`}>
                    {p}
                  </a>
                </li>
              ))}

            <li>
              <a
                className={`fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label 
              ${page === lastPage ? styles["disabledBtn"] : styles["enabledBtn"]}`}
                onClick={(e) => changePage(e, page + 1)}
              >
                Page suivante
              </a>
            </li>
            <li>
              <a
                className={`fr-pagination__link fr-pagination__link--last ${page === lastPage ? styles["disabledBtn"] : styles["enabledBtn"]}`}
                onClick={(e) => changePage(e, lastPage)}
              >
                Dernière page
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};
