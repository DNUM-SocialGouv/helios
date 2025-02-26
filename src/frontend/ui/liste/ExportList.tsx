

import * as XLSX from "xlsx";

import { Paths } from "../../configuration/Paths";
import { useDependencies } from "../commun/contexts/useDependencies";
import { RechercheViewModel } from "../home/RechercheViewModel";

export function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const currentDate = `${year}${month}${day}`;
    return currentDate;
}

function getType(type: string | undefined) {
    if (type === "Médico-social") return "Social et Médico-Social"
    else return type;
}

async function getListEtsData(listId: number, paths: Paths, order = "", orderBy = "") {
    const queryParams = new URLSearchParams({
        order,
        orderBy,
        forExport: "true",
    });

    return fetch(`/api/liste/${listId}/etablissement?${queryParams.toString()}`,
        {
            headers: { "Content-Type": "application/json" },
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            return data.map((résultat: any) => new RechercheViewModel(résultat, paths))
        });
}

function transformData(data: any) {
    return data.map((etab: RechercheViewModel) => [
        getType(etab.type) ?? "-",
        etab.socialReason ?? "-",
        etab.commune ?? "-",
        etab.departement ?? "-",
        etab.numéroFiness ?? "-",
        etab.rattachement ?? "-",
    ]);
}

function ExportToExcel(headers: string[], data: (string | number)[][], fileName: string) {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "List");
    XLSX.writeFile(wb, fileName);
}

async function generateAndExportExcel(
    listId: number, listName: string, order: string, orderBy: string, paths: Paths,
) {
    const fileName: string = `${getCurrentDate()}_Helios_${listName}.xlsx`;
    const data = await getListEtsData(listId, paths, order, orderBy)
    const dataTransormed = transformData(data);

    const headers = [
        "Type d'établissement",
        "Raison Sociale",
        "Ville",
        "Département",
        "N° FINESS",
        "Rattachement",
    ];

    ExportToExcel(
        headers,
        dataTransormed,
        fileName,
    );
}

const ExportList = ({
    listId, listName, order, orderBy, disabled,
}: {
    listId: number, listName: string, order: string, orderBy: string, disabled?: boolean,
}) => {
    const { wording, paths } = useDependencies();

    return (
        <button
            className="fr-btn fr-btn--tertiary-no-outline"
            disabled={disabled}
            name="Exporter"
            onClick={() => generateAndExportExcel(listId, listName, order, orderBy, paths)}
            title="Exporter"
            type="button"
        >
            {wording.EXPORTER}
        </button>
    );
};

export default ExportList;
