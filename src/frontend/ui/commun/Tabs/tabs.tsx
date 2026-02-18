import "@gouvfr/dsfr/dist/component/tab/tab.min.css";

type TabsProps = {
  labels: { text: string; tabId: string }[];
  selectedIndex: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
};


export const Tabs = ({ labels, children, selectedIndex, onTabChange, }: TabsProps) => {
  return (
    <div className="fr-tabs">
      <ul className="fr-tabs__list" role="tablist"> {/* NOSONAR L’erreur sur le « role » affecte a un element non interactif est lie au dsfr et ne peut etre change*/}
        {labels.map(((label, index) => (
          <li key={index} >
            <button
              aria-controls={`tabpanel-${label.tabId}`}
              aria-selected={selectedIndex === label.tabId}
              className="fr-tabs__tab"
              onClick={() => onTabChange(label.tabId)}
              role="tab"
              tabIndex={index}

            >
              {label.text}
            </button>
          </li>
        )))}
      </ul>
      {children}
    </div>
  )
}
