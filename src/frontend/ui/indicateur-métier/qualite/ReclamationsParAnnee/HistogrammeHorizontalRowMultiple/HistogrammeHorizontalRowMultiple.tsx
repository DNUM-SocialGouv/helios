import styles from "./HistogrammeHorizontalRowMultiple.module.css";

type HistogrammeHorizontalRowMultipleProps = Readonly<{
  data: {
    key: string;
    value: number;
  }[];
  realPercentage: number;
  ListeCouleursSousEnveloppes: string[]
}>;

export const HistogrammeHorizontalRowMultiple = ({ data, realPercentage, ListeCouleursSousEnveloppes }: HistogrammeHorizontalRowMultipleProps) => {
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
                style={{ width: `${Math.floor(item.value)}%`, backgroundColor: ListeCouleursSousEnveloppes[index] }}
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
