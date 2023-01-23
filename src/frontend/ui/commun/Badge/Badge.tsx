import "@gouvfr/dsfr/dist/component/badge/badge.min.css";

export const Badge = ({ label, className }: { label: string; className: string }) => {
  return <p className={"fr-badge fr-badge--no-icon " + className}>{label}</p>;
};
