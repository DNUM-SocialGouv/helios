
import "@gouvfr/dsfr/dist/component/alert/alert.min.css";

type SuccessAlertProps = Readonly<{
  message: string;
}>

export const SuccessAlert = ({ message }: SuccessAlertProps) => {
  return (
    <div className="fr-alert fr-alert--success fr-alert--sm fr-mt-2w fr-mb-1w">
      <p>{message}</p>
    </div>
  )
}
