import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import "@gouvfr/dsfr/dist/component/footer/footer.min.css";
import { Cookies } from "../../cookies/Cookies";
import { useDependencies } from "../contexts/useDependencies";

export const Footer = () => {
  const { paths, wording } = useDependencies();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentModal, setCurrentModal] = useState(1);

  return (
    <footer className="fr-footer fr-mt-6w" id="footer">
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <p className="fr-logo">{wording.INTITULÉ_RÉPUBLIQUE_FRANÇAISE}</p>
            <Link className="fr-footer__brand-link" href={paths.ACCUEIL} passHref title={wording.ACCUEIL}>
              <Image alt="" height="100" src="/logo.svg" width="100" />
            </Link>
          </div>
          <div className="fr-footer__content">
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://legifrance.gouv.fr"
                  rel="external noopener noreferrer"
                  target="_blank"
                  title={`${wording.LEGIFRANCE} - ${wording.NOUVELLE_FENÊTRE}`}
                >
                  {wording.LEGIFRANCE}
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://gouvernement.fr"
                  rel="external noopener noreferrer"
                  target="_blank"
                  title={`${wording.GOUVERNEMENT} - ${wording.NOUVELLE_FENÊTRE}`}
                >
                  {wording.GOUVERNEMENT}
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://service-public.fr"
                  rel="external noopener noreferrer"
                  target="_blank"
                  title={`${wording.SERVICE_PUBLIC} - ${wording.NOUVELLE_FENÊTRE}`}
                >
                  {wording.SERVICE_PUBLIC}
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://data.gouv.fr"
                  rel="external noopener noreferrer"
                  target="_blank"
                  title={`${wording.DATA_GOUV} - ${wording.NOUVELLE_FENÊTRE}`}
                >
                  {wording.DATA_GOUV}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" href={paths.ACCESSIBILITÉ} passHref>
                {`${wording.ACCESSIBILITÉ} : ${wording.NON_CONFORME}`}
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" href={paths.ECO_CONCEPTION} passHref>
                {wording.ECO_CONCEPTION}
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" href={paths.MENTIONS_LÉGALES} passHref>
                {wording.MENTIONS_LÉGALES}
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" href={paths.DONNÉES_PERSONNELLES} passHref>
                {wording.DONNÉES_PERSONNELLES}
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link
                className="fr-footer__bottom-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenModal(true);
                  setCurrentModal(2);
                }}
              >
                {wording.COOKIES}
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" href={`${paths.AIDE}?path=foire-aux-questions`} passHref>
                FAQ
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="mailto:dnum.scn-helios-support@sg.social.gouv.fr" rel="external noopener noreferrer" target="_blank">
                {wording.NOUS_CONTACTER}
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <span className="fr-footer__bottom-link"> v1.7.5</span>
            </li>
          </ul>
          <div className="fr-footer__bottom-copy">
            <p>
              {wording.MENTION_LICENCE}
              <a
                href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                rel="external noopener noreferrer"
                target="_blank"
                title={`${wording.LICENCE_ETALAB} - ${wording.NOUVELLE_FENÊTRE}`}
              >
                {wording.LICENCE_ETALAB}
              </a>
            </p>
          </div>
        </div>
      </div>
      <Cookies currentModal={currentModal} openModal={openModal} setCurrentModal={setCurrentModal} setOpenModal={setOpenModal} />
    </footer>
  );
};
