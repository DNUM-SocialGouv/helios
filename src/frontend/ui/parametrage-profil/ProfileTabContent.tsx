import { useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./ParametrageProfil.module.css";

type ProfileTabCobntentProps = Readonly<{
    idTabPanel: string;
    institution: any;
    autreRégion: object;
}>;

export const ProfileTabContent = ({
    idTabPanel,
    institution,
    autreRégion,
}: ProfileTabCobntentProps) => {
    const { wording } = useDependencies();
    const [editableInstitutionValues, setEditableInstitutionValues] = useState<any>(institution);
    const [editableAutreRegionValues, setEditableAutreRegionValues] = useState<any>(autreRégion);

    const handleCheckboxChange = (source: string, bloc: any, indicator: string, checked: boolean) => {
        if (source === 'INST') {
            setEditableInstitutionValues({
                ...editableInstitutionValues,
                [bloc]: {
                    ...editableInstitutionValues[bloc],
                    [indicator]: checked ? 'ok' : 'no'
                }
            });
        } else {
            setEditableAutreRegionValues({
                ...editableAutreRegionValues,
                [bloc]: {
                    ...editableAutreRegionValues[bloc],
                    [indicator]: checked ? 'ok' : 'no'
                }
            });
        }
    };

    return (
        <div className="fr-tabs__panel fr-tabs__panel--selected" id={idTabPanel}>
            <div className="fr-grid-row fr-grid-row--gutters ">
                <div className="fr-col-6">
                    <div className={"fr-mb-3w " + styles["tab-title"]}>{wording.PARAMETRAGE_INSTITUTION}</div>
                    {Object.keys(editableInstitutionValues).map((bloc: string) => (
                        <div className="fr-table fr-table--layout-fixed" key={"inst-" + bloc}>
                            <div className={"fr-mb-3w " + styles["section-title"]}>{bloc}</div>
                            <table>
                                <tbody>
                                    {Object.keys(editableInstitutionValues[bloc]).map((indicator) => (
                                        <tr key={"inst-" + indicator}>
                                            <td className={styles["td-text"]}>{indicator}</td>
                                            <td>
                                                <input
                                                    checked={editableInstitutionValues[bloc][indicator] === 'ok'}
                                                    onChange={(e) => handleCheckboxChange('INST', bloc, indicator, e.target.checked)}
                                                    type="checkbox"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
                <div className="fr-col-6">
                    <div className={"fr-mb-3w " + styles["tab-title"]}> {wording.PARAMETRAGE_AUTRE_REGION} </div>
                    {Object.keys(editableAutreRegionValues).map((bloc: string) => (
                        <div className="fr-table fr-table--layout-fixed" key={"inst-" + bloc}>
                            <div className={"fr-mb-3w " + styles["section-title"]}>{bloc}</div>
                            <table>
                                <tbody>
                                    {Object.keys(editableAutreRegionValues[bloc]).map((indicator) => (
                                        <tr key={"inst-" + indicator}>
                                            <td className={styles["td-text"]}>{indicator}</td>
                                            <td>
                                                <input
                                                    checked={editableAutreRegionValues[bloc][indicator] === 'ok'}
                                                    onChange={(e) => handleCheckboxChange('AR', bloc, indicator, e.target.checked)}
                                                    type="checkbox"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};