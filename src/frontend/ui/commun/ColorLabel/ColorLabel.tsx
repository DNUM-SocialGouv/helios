import styles from "./ColorLabel.module.css";
import filieresStyles from "../../établissement-territorial-médico-social/bloc-ressources-humaines/bloc-vigie-rh/GraphiqueLine.module.css";

interface ColorLabelProps {
    items: { color: string; label: string }[];
    classContainer: string;
}
export const ColorLabel = ({ classContainer, items }: ColorLabelProps ) => {
    return (
        <div className={`${classContainer} ${styles["colorLabelContainer"]} ${filieresStyles["filieres_effectifs"]}`}>
            {items.map((item, index) => (
                <span className={styles["colorLabel"]} key={index} >
                    <span className={styles["colorCircle"]} style={{ backgroundColor: item.color, borderRadius: '2px' }}></span>
                    {item.label}
                </span>
            ))}
        </div>
    );
};