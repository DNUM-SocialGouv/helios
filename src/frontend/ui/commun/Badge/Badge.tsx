import "@gouvfr/dsfr/dist/component/badge/badge.min.css";

export const Badge = ({ label, className, colour }: { label: string; className?: string; colour?: string }) => {
  const colorClass = "fr-badge--" + colour;
  return <p className={`fr-badge fr-badge--no-icon ${colorClass} ${className}`}>{label}</p>;
};
