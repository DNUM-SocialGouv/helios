import { MouseEvent, memo, useCallback } from "react";
import "@gouvfr/dsfr/dist/component/pagination/pagination.min.css";

import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { iPaginationData } from "../../UsersListPage";
import styles from "./PaginationBtn.module.css";

type PaginationBtnProps = Readonly<{
  paginationData: iPaginationData;
}>;

const PaginationBtn = ({
  paginationData: {
    lastPage,
    page,
    keyWord,
    institutionId,
    roleId,
    profileId,
    etatId,
    itemsPerPage,
    setUserData,
    setPage,
    setLastPage,
    setTotal,
    getUsersAndRefresh,
  },
}: PaginationBtnProps) => {
  const intervalRecursive = (x: number, y: number, accum = []): never[] => {
    if (x + 1 === y) return accum;
    return intervalRecursive(x + 1, y, accum.concat((x + 1) as never));
  };

  const changePage = useCallback(
    async (e: MouseEvent, page: number, disable = false) => {
      e.preventDefault();

      if (disable === true) {
        return null;
      }

      let institutionCondition = {};
      if (institutionId) {
        institutionCondition = { institutionId: institutionId };
      }

      let roleCondition = {};
      if (roleId) {
        roleCondition = { roleId: roleId };
      }

      let profilCondition = {};
      if (profileId) {
        profilCondition = { profileId: profileId };
      }

      let etatCondition = {};
      if (etatId) {
        etatCondition = { etatId: etatId };
      }

      const params = {
        key: keyWord,
        sort: "",
        page: page.toString(),
        ...institutionCondition,
        ...roleCondition,
        ...profilCondition,
        ...etatCondition,
        itemsPerPage: itemsPerPage.toString(),
      };
      getUsersAndRefresh(params, setUserData, setPage, setLastPage, setTotal);

      return true;
    },
    [institutionId, roleId, profileId, etatId, itemsPerPage, keyWord, page]
  );

  return (
    <div className={styles["pagination_container"]}>
      <nav aria-label="Pagination" className="fr-pagination" role="navigation">
        <ul className="fr-pagination__list">
          <li>
            <button
              className={`fr-pagination__link fr-pagination__link--first  ${page === 1 ? styles["disabledBtn"] : styles["enabledBtn"]}`}
              onClick={(e) => changePage(e, 1)}
            >
              Première page
            </button>
          </li>
          <li>
            <button
              className={`fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label 
              ${page === 1 ? styles["disabledBtn"] : styles["enabledBtn"]}`}
              onClick={(e) => changePage(e, page - 1, page === 1)}
            >
              Page précédente
            </button>
          </li>
          {lastPage === 1 && (
            <li>
              <button className={`fr-pagination__link ${page === 1 && styles["currentPage"]}`} onClick={(e) => changePage(e, 1, true)} title="Page 1">
                1
              </button>
            </li>
          )}

          {lastPage > 1 && (
            <>
              {lastPage <= 11 &&
                [...Array(lastPage)].map((_p, i) => (
                  <li key={i}>
                    <button
                      className={`fr-pagination__link ${page === i + 1 && styles["currentPage"]}`}
                      onClick={(e) => changePage(e, i + 1)}
                      title={`Page ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

              {lastPage > 11 &&
                page > 5 &&
                page < lastPage - 5 &&
                [page - 4, page - 3, page - 2, page - 1, page, page + 1, page + 2, page + 3, page + 4].map((p, i) => (
                  <li key={i}>
                    <button className={`fr-pagination__link ${page === p && styles["currentPage"]}`} onClick={(e) => changePage(e, p)} title={`Page ${p}`}>
                      {p}
                    </button>
                  </li>
                ))}

              {lastPage > 11 &&
                page <= 5 &&
                [...intervalRecursive(0, 10)].map((p, i) => (
                  <li key={i}>
                    <button className={`fr-pagination__link ${page === p && styles["currentPage"]}`} onClick={(e) => changePage(e, p)} title={`Page ${p}`}>
                      {p}
                    </button>
                  </li>
                ))}

              {lastPage > 11 &&
                page >= lastPage - 5 &&
                [...intervalRecursive(lastPage - 9, lastPage + 1)].map((p, i) => (
                  <li key={i}>
                    <button className={`fr-pagination__link ${page === p && styles["currentPage"]}`} onClick={(e) => changePage(e, p)} title={`Page ${p}`}>
                      {p}
                    </button>
                  </li>
                ))}
            </>
          )}
          <li>
            <button
              className={`fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label 
              ${page === lastPage ? styles["disabledBtn"] : styles["enabledBtn"]}`}
              onClick={(e) => changePage(e, page + 1, page === lastPage)}
            >
              Page suivante
            </button>
          </li>
          <li>
            <button
              className={`fr-pagination__link fr-pagination__link--last ${page === lastPage ? styles["disabledBtn"] : styles["enabledBtn"]}`}
              onClick={(e) => changePage(e, lastPage)}
            >
              Dernière page
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default memo(PaginationBtn);
