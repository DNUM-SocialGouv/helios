import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { RegistrationPage } from "../frontend/ui/registration/RegistrationPage";

export default function PageDInscription() {
    useBreadcrumb([]);
    return <RegistrationPage />;
}