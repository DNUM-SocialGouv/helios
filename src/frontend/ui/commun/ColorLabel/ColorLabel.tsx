import styles from "./ColorLabel.module.css";

interface ColorLabelProps {
    color: string;
    label: string;
}

const ColorLabel: React.FC<{ items: ColorLabelProps[], classContainer:string }> = ({ items, classContainer }) => {
    return (
        <div className={`${classContainer} ${styles["colorLabelContainer"]}`}>
            {items.map((item, index) => (
                <span key={index} className={styles["colorLabel"]}>
                    <span
                        className={styles["colorCircle"]}
                        style={{ backgroundColor: item.color }}
                    ></span>
                    {item.label}
                </span>
            ))}
        </div>
    );
};

export default ColorLabel;

