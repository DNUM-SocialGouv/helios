import { ReactElement } from "react";

export function TagGroup({ children, label }: { children: ReactElement[]; label: string }): ReactElement {
  return (
    <ul aria-label={label} className="fr-tags-group">
      {children.map((tag, index) => (
        <li key={index}>{tag}</li>
      ))}
    </ul>
  );
}
