import styles from "./NombreTotaleReclamation.module.css"

type NombreTotaleReclamationProps = Readonly<{
    label: string;
    number: number;
    size: 'big' | 'small';
}>;

export const NombreTotaleReclamation = ({ label, number, size}: NombreTotaleReclamationProps) => {
 
return (
<div className={styles['nombreTotaleReclamationContainer']}>
    <div className={`${styles[`number`]} ${styles[`numberSize_${size}`]}`}>{number}</div>
    <div className={styles['label']}>{label}</div>
</div>)
;
};
