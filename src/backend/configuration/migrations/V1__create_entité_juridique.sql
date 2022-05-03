CREATE SCHEMA IF NOT EXISTS helios;

SET search_path TO helios;

CREATE TABLE EntitéJuridique
(
    catégorieÉtablissement VARCHAR(255) NOT NULL,
    codeApe VARCHAR(255) NOT NULL,
    codePays VARCHAR(255) NOT NULL,
    codePostal VARCHAR(255) NOT NULL,
    commune VARCHAR(255) NOT NULL,
    complémentDistribution VARCHAR(255) NOT NULL,
    complémentRaisonSociale VARCHAR(255) NOT NULL,
    complémentVoie VARCHAR(255) NOT NULL,
    dateCréation VARCHAR(255) NOT NULL,
    dateFermeture VARCHAR(255) NOT NULL,
    dateMiseAJour VARCHAR(255) NOT NULL,
    dateMiseAJourSource VARCHAR(255) NOT NULL,
    dateModificationSiren VARCHAR(255) NOT NULL,
    département VARCHAR(255) NOT NULL,
    libelléCatégoriÉtablissement VARCHAR(255) NOT NULL,
    libelléCommune VARCHAR(255) NOT NULL,
    libelléCourtCatégoriÉtablissement VARCHAR(255) NOT NULL,
    libelléCourtStatutJuridique VARCHAR(255) NOT NULL,
    libelléDépartement VARCHAR(255) NOT NULL,
    libelléPays VARCHAR(255) NOT NULL,
    libelléStatutJuridique VARCHAR(255) NOT NULL,
    lieuDitBoîtePostale VARCHAR(255) NOT NULL,
    ligneAcheminement VARCHAR(255) NOT NULL,
    numéroFiness VARCHAR(255) NOT NULL,
    numéroVoie VARCHAR(255) NOT NULL,
    origineModificationSiren VARCHAR(255) NOT NULL,
    qualificationCréation VARCHAR(255) NOT NULL,
    raisonSociale VARCHAR(255) NOT NULL,
    raisonSocialeLongue VARCHAR(255) NOT NULL,
    siren VARCHAR(255) NOT NULL,
    statutJuridique VARCHAR(255) NOT NULL,
    typeFermeture VARCHAR(255) NOT NULL,
    typeVoie VARCHAR(255) NOT NULL,
    télécopie VARCHAR(255) NOT NULL,
    téléphone VARCHAR(255) NOT NULL,
    voie VARCHAR(255) NOT NULL,

    CONSTRAINT entité_juridique_pk PRIMARY KEY (numéroFiness)
);
