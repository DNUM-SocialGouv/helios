
import { Workbook } from "exceljs";

import { ecrireLignesDansSheet, telechargerWorkbook } from "../../../utils/excelUtils";
import { useDependencies } from "../contexts/useDependencies";

export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const currentDate = `${year}${month}${day}`;
  return currentDate;
}

export function useExportExcelTranscription() {
  const { wording } = useDependencies();

  const exportExcelTranscription = (graphName: string, etabFiness: string, etabInfo: string, headers: string[], linesTitle: (number | string)[], values: (number | string | null)[][]) => {
    const lines: string[][] = [];
    for (const [index, lineTitle] of linesTitle.entries()) {
      const line = [];
      line.push(lineTitle.toString());
      for (const value of values) {
        line.push(value[index]?.toString() ?? wording.NON_RENSEIGNÉ);
      }
      lines.push(line);
    }


    const workbook = new Workbook();
    const sheet = workbook.addWorksheet("Transcription");
    ecrireLignesDansSheet([[etabInfo], [""], [wording.TITRE_TRANSCRIPTION], headers, ...lines], sheet);
    const fileName: string = `${getCurrentDate()}_Helios_${etabFiness}_${graphName}.xlsx`;
    telechargerWorkbook(workbook, fileName);
  }
  return { exportExcelTranscription }
}
