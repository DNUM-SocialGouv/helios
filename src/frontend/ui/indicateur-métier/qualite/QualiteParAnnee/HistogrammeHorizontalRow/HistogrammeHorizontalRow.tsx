import styles from "./HistogrammeHorizontalRow.module.css"

type HistogrammeHorizontalRowProps = Readonly<{
    number: number;
    total: number;
    color: string;
}>;

export const HistogrammeHorizontalRow = ({ number, total, color}: HistogrammeHorizontalRowProps) => {
 
const percent = (number * 100)/ total;
const minus = percent / 3;

return (
<div className={styles['histogramme_horizontal_row_container']}>
    <ul>
        <li><div className={` ${styles['barHistogramme']} ${styles[`${color}`]} `} style={{width:`${percent-minus}%`}}>i</div></li> <li className={styles['motif_number']}>{number}</li>
    </ul>
</div>)
;
};
