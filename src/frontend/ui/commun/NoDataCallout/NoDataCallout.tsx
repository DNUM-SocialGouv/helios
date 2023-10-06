import "@gouvfr/dsfr/dist/component/callout/callout.min.css";
import { ReactElement } from "react";

type NoDataCalloutProps = Readonly<{
    indicateurs: (string | ReactElement)[];
}>;

export const NoDataCallout = ({ indicateurs }: NoDataCalloutProps) => {
    return (
        <div className="fr-callout">
            <p className="fr-callout__title"> Aucune donnée n&apos;est renseignée pour les indicateurs suivants :</p>
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
