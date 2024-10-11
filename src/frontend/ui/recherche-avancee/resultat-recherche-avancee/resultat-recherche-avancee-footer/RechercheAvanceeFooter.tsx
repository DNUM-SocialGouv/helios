import { Dispatch, SetStateAction } from "react"

import PaginationBtn from "../../../parametrage-utilisateurs/UsersListPage/Pagination/PaginationBtn/PaginationBtn"
import styles from "./RechercheAvanceeFooter.module.css"

export type PaginationEts = {
    lastPage: number
    page: number
    setPage: Dispatch<SetStateAction<number>>
}

type TableFooterRechercheAvanceeProps = {
    nombreRésultats: number
} & PaginationEts

export const TableFooterRechercheAvancee = ({ nombreRésultats, lastPage, page, setPage }: TableFooterRechercheAvanceeProps) => {
    return (
        <div className={styles["footer-container"]}>
            <span className={"fr-table__detail " + styles["number-lines-container"]}>{nombreRésultats} lignes</span>
            <div className={styles["pagination-container"]}>
                <PaginationBtn paginationData={{ lastPage, page, setPage }} />
            </div>
        </div>
    )
}