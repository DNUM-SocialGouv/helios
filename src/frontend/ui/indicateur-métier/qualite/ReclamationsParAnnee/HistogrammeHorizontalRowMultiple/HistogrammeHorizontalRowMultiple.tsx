import styles from "./HistogrammeHorizontalRowMultiple.module.css";

export const colorsAllocations = [
  "#6a6af4", "#000091", "#9898f8", "#aeaef9", "#2323ff", "#cbcbfa", "#a1a1f8", "#313178", "#5757ad", "#6c6cbb", "#4a4a7d", "#5e5e90", "#272747", "#518fff", "#273961", "#0078f3", "#b1c6ff", "#95b4ff", "#f4f6ff", "#dde5ff"
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
