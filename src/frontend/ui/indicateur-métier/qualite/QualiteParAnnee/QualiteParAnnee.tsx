import { useDependencies } from "../../../commun/contexts/useDependencies";
import { HistogrammeHorizontalRow } from "./HistogrammeHorizontalRow/HistogrammeHorizontalRow";
import { NombreTotaleReclamation } from "./NombreTotaleReclamation/NombreTotaleReclamation";
import styles from "./QualiteParAnnee.module.css"

interface rowQualite
{
    motif: string,
    clot: number,
    encours: number
}

type GraphiqueQualiteProps = Readonly<{
    total_clotures : number,
    total_encours : number,
    details: rowQualite[];
}>;

export const QualiteParAnnee = ({total_clotures, total_encours, details }: GraphiqueQualiteProps) => {

function trimString(string: string, length: number):string {
return string.length > length ? 
        string.substring(0, length) + '...' :
        string;
};

const { wording } = useDependencies();

return (
<div className={styles['qualite_par_annee_container']}>

    <div className={styles['nombre_totale_reclamation_container']}>
        <NombreTotaleReclamation label="Nombre total de réclamation" number={total_clotures+total_encours} size="big"/>
        <NombreTotaleReclamation label="Cloturés" number={total_clotures} size="small"/>
        <NombreTotaleReclamation label="En cours" number={total_encours} size="small"/>
    </div>

    <div className={styles['table_qualite_Container']}>
        <table>
            <thead>
                <tr>
                    <th className={styles['motif_width']} scope="col" >{wording.MOTIF_DES_RECLAMATIONS}</th>
                    <th className={styles['histogramme_width']} scope="col">{wording.NOMBRE_TOTAL_RECLAMATIONS}</th>
                    <th className={styles['histogramme_width']} scope="col">{wording.NOMBRE_RECLAMATIONS_EN_ENCOURS}</th>
                    <th className={styles['histogramme_width']} scope="col">{wording.NOMBRE_RECLAMATIONS_CLOTUREES}</th>
                </tr>
            </thead>
            <tbody>
            {details && details.map((item, i) => {
                    return (
                        <tr key={i}>
                        <td>{trimString(wording[`${item.motif}`], 45)}</td>
                        <td> <HistogrammeHorizontalRow color="darkBlue" number={item.clot + item.encours} total={2186}/> </td>
                        <td> <HistogrammeHorizontalRow color="lightBlue" number={item.encours} total={item.clot + item.encours} /> </td>
                        <td> <HistogrammeHorizontalRow color="lightBlue" number={item.clot} total={item.clot + item.encours} /> </td>
                    </tr>
                    )
                })
            }
            </tbody>
        </table>
    </div>

</div>);
};



