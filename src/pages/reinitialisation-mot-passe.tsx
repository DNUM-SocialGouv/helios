import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { PageChangeMotPasse } from "../frontend/ui/change-mot-passe/PageReinitialisationMotPasse";
import { useChangeMdp } from "../frontend/ui/change-mot-passe/useChangeMdp";
import Spinner from "../frontend/ui/commun/Spinner/Spinner";
import { Page404 } from "../frontend/ui/erreurs/Page404";

export default function MotPasseOublie() {
  const router = useRouter();
  const [token, setToken] = useState('');

  const {
    checkTokenService,
    validToken,
    isChecking,
  } = useChangeMdp();


  useEffect(() => {
    async function setTokenWhenReady() {
      if (router.isReady) {
        const { loginToken } = router.query;
        if (typeof loginToken === 'string') {
          setToken(loginToken);
          await router.replace(router.pathname, undefined, { shallow: true });
        }
      }
    };
    void setTokenWhenReady();
  }, [router.isReady, router.pathname, router.query["loginToken"]]);

  if (token) {

    void checkTokenService(token);
    return (
      <>
        {isChecking ? <Spinner /> : validToken ? (
          <PageChangeMotPasse loginToken={token} />
        ) : (
          <Page404 />
        )}
      </>
    );
  } else {
    return null
  }
}
