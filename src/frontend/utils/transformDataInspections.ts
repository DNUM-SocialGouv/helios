import { Inspection, InspectionControleDataTheme } from "../../backend/métier/entities/ÉtablissementTerritorialQualite";

export function transformDataInspections(data: Inspection[]) {
    const groupedData: InspectionControleDataTheme[] = [];
  
    // Parcours de chaque élément et regroupement par typeMission
    data.length &&
      data.forEach((item: Inspection) => {
        if (!(item.typeMission in groupedData)) {
          groupedData[item.typeMission as any] = {
            libelleTheme: item.typeMission,
            data: [],
          };
        }
        // Ajout de l'élément dans le tableau correspondant
        groupedData[item.typeMission as any].data.push(item);
      });
  
    // Tri des éléments par dateVisite
    for (const key in groupedData) {
      groupedData[key].data.sort((a, b) => {
        const dateA = new Date(a.dateVisite);
        const dateB = new Date(b.dateVisite);
        // @ts-ignore
        return dateB - dateA;
      });
    }
  
    // Conversion du dictionnaire en tableau
    const result = Object.values(groupedData);
  
    return result;
  }
  