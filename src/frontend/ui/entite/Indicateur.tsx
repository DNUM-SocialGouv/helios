import styles from './Indicateur.module.css'

type IndicateurProps = Readonly<{
  label: string;
  valeur: string;
}>

export const Indicateur = ({ label, valeur }: IndicateurProps) => {

  return (
    <div>
      <p className={styles['label-indicateur']}>
        {label}
      </p>
      <p className={styles['valeur-indicateur']}>
        {valeur}
      </p>
    </div>
  )
}
