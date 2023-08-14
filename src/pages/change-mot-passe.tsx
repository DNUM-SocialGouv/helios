import { ChangePwdPage } from "../frontend/ui/change-mot-passe/ChangePwdPage";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";

export default function MotPasseOublie() {
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: wording.CHANGEMENT_MOT_PASSE_TITRE,
      path: "",
    },
  ]);
  return <ChangePwdPage />;
}

