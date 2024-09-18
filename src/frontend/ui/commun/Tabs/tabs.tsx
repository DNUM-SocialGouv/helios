import "@gouvfr/dsfr/dist/component/tab/tab.min.css";
import { ReactChild } from "react";


export const Tabs = ({ selectedTabId, labels, children, onChange }: { selectedTabId: string, labels: { text: string, tabId: string }[], children: ReactChild[], onChange: (tabId: string) => void }) => {
    return (
        <div className="fr-tabs">
            <ul className="fr-tabs__list" role="tablist">
                {labels.map(((label, index) => (
                    <li key={index} >
                        <button
                            aria-controls={`tabpanel-${label.tabId}`}
                            aria-selected={selectedTabId === label.tabId ? "true" : "false"}
                            className="fr-tabs__tab"
                            onClick={() => onChange(label.tabId)}
                            role="tab"
                            tabIndex={index}>
                            {label.text}
                        </button>
                    </li>
                )))}
            </ul>
            {children}
        </div>
    )
}