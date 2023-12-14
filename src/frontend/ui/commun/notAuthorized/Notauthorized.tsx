import "@gouvfr/dsfr/dist/component/callout/callout.min.css";
import { ReactElement } from "react";

type NotAUthorizedProps = Readonly<{
    indicateurs: (string | ReactElement)[];
}>;

export const NotAUthorized = ({ indicateurs }: NotAUthorizedProps) => {
    return (
        <div className="fr-callout fr-callout--brown-caramel">
            <p className="fr-callout__title"> Vous n&apos;êtes pas autorisé à consulter les indicateurs suivants :</p>
            <ul>
                {indicateurs?.map(((indicateur, index) => (
                    <li className="fr-callout__text" key={index} >
                        {indicateur}
                    </li>
                )))}
            </ul>
        </div>
    );
};
