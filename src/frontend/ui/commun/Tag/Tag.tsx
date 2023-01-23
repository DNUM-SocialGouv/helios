import "@gouvfr/dsfr/dist/component/tag/tag.min.css";

export const Tag = ({ label, className }: { label: string; className: string }) => {
  return <p className={"fr-tag " + className}>{label}</p>;
};
