import "@gouvfr/dsfr/dist/component/tab/tab.min.css";
import { ReactChild } from "react";


export const Tabs = ({ labels, children, }: { labels: { text: string, tabId: string }[], children: ReactChild[] }) => {
    return (
        <div className="fr-tabs">
            <ul className="fr-tabs__list" role="tablist">
                {labels.map(((label, index) => (
                    <li key={index} >
                        <button
                            aria-controls={`tabpanel-${label.tabId}`}
                            aria-selected={label.tabId === "1" ? "true" : "false"}
                            className="fr-tabs__tab"
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