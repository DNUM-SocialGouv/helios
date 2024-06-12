import styles from "./HistogrammeHorizontalRowMultiple.module.css";

export const colorsAllocations = [ "#667DCF", "#fa794a", "#006a6f", "#273563", "#a94645", "#a94645"];

type HistogrammeHorizontalRowMultipleProps = Readonly<{
  data: {
    key: string;
    value: number;
  }[]
  realPercentage : number;
}>;

export const HistogrammeHorizontalRowMultiple = ({ data , realPercentage }: HistogrammeHorizontalRowMultipleProps) => {
  if(realPercentage <= 0 || realPercentage > 100) return null;
  return (
    <div className={styles["histogramme_horizontal_row_container"]} style={{ width: `${realPercentage}%`}}>
      <ul>
        {data.map((item, index) => {
          return (
            <li key={item.key}>
              <div className={`${styles["barHistogramme"]}`} style={{ width: `${item.value}%`, backgroundColor: colorsAllocations[index] }}>
                i
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
