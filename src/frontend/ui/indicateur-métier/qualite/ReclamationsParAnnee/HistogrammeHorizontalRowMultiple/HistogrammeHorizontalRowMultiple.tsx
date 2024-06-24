import styles from "./HistogrammeHorizontalRowMultiple.module.css";

export const colorsAllocations = [
  "#99B3F9",
  "#667DCF",
  "#465F9D",
  "#2F4077",
  "#273563",
  "#161D37",
  "#a94645",
  "#667DCF",
  "#fa794a",
  "#006a6f",
  "#273563",
  "#a94645",
];

type HistogrammeHorizontalRowMultipleProps = Readonly<{
  data: {
    key: string;
    value: number;
  }[];
  realPercentage: number;
}>;

export const HistogrammeHorizontalRowMultiple = ({ data, realPercentage }: HistogrammeHorizontalRowMultipleProps) => {
  if (realPercentage <= 0 || realPercentage > 100) return null;
  return (
  
      <div className={styles["histogramme_horizontal_row_container"]} style={{ width: `${realPercentage * 0.8}%` }}>
        <ul>
          {data.map((item, index) => {
            return (
              <li key={item.key}>
                <div
                  className={styles["barHistogramme"]}
                  data-testid={`bar-${item.key}`}
                  style={{ width: `${item.value}%`, backgroundColor: colorsAllocations[index] }}
                >
                  i
                </div>
              </li>
            );
          })}
        </ul>
    
    </div>
  );
};
