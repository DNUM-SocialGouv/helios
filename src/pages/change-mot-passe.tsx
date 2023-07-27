import { useRouter } from "next/router";

import { checkToken } from "../backend/jwtHelper";
import { PageChangeMotPasse } from "../frontend/ui/change-mot-passe/PageChangeMotPasse";
import { Page404 } from "../frontend/ui/erreurs/Page404";

export default function MotPasseOublie() {
  const router = useRouter();
  const { loginToken } = router.query;
  const info = checkToken(loginToken as string);
  if (info?.email) {
    return <PageChangeMotPasse />;
  } else {
    return <Page404 />
  }

}
