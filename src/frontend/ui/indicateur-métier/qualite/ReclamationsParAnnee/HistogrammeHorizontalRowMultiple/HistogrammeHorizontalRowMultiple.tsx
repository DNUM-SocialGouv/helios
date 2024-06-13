import styles from "./HistogrammeHorizontalRowMultiple.module.css";

export const colorsAllocations = ["#2F4077", "#465F9D","#667DCF", "#99B3F9",  "#273563", "#161D37"];

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
