import styles from "./ColorLabel.module.css";

interface ColorLabelProps {
  items: { color: string; label: string, circle?: boolean }[];
  classContainer: string;
}
export const ColorLabel = ({ classContainer, items }: ColorLabelProps) => {
  return (
    <div className={`${classContainer} ${styles["colorLabelContainer"]}`}>
      {items.map((item, index) => (
        <span className={"fr-label " + styles["colorLabel"]} key={index} >
          <div className={item.circle ? styles["colorCircle"] : styles["colorLine"]} style={{ backgroundColor: item.color }}></div>
          {item.label}
        </span>
      ))}
    </div>
  );
};
