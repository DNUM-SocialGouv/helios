import styles from './BandeauDInformation.module.css'
import '@gouvfr/dsfr/dist/component/alert/alert.min.css'

type BandeauDInformationProps = Readonly<{
  texte: string
}>

export const BandeauDInformation = ({ texte }: BandeauDInformationProps) => {
  return (
    <div className={'fr-alert fr-alert--info fr-alert--sm ' + styles['bandeau-d-information']}>
      <p>{texte}</p>
    </div>
  )
}
