import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageDeConnexion } from "../frontend/ui/login/PageDeConnexion";

export default function PageDAccueil() {
  useBreadcrumb([]);
  return <PageDeConnexion />;
}
