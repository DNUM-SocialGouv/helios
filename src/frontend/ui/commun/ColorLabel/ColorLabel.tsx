import styles from "./ColorLabel.module.css";

interface ColorLabelProps {
    items: { color: string; label: string }[];
    classContainer: string;
}
export const ColorLabel = ({ classContainer, items }: ColorLabelProps ) => {
    return (
        <div className={`${classContainer} ${styles["colorLabelContainer"]}`}>
            {items.map((item, index) => (
                <span className={styles["colorLabel"]} key={index} >
                    <span className={styles["colorCircle"]} style={{ backgroundColor: item.color }}></span>
                    {item.label}
                </span>
            ))}
        </div>
    );
};