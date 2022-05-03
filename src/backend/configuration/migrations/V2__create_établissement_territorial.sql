SET search_path TO helios;

CREATE TABLE ÉtablissementTerritorial
(
    catégorieAgrégatÉtablissement VARCHAR(255) NOT NULL,
    catégorieÉtablissement VARCHAR(255) NOT NULL,
    codeApe VARCHAR(255) NOT NULL,
    codeMft VARCHAR(255) NOT NULL,
    codePays VARCHAR(255) NOT NULL,
    codePostal VARCHAR(255) NOT NULL,
    codeSph VARCHAR(255) NOT NULL,
    commune VARCHAR(255) NOT NULL,
    complémentDistribution VARCHAR(255) NOT NULL,
    complémentRaisonSociale VARCHAR(255) NOT NULL,
    complémentVoie VARCHAR(255) NOT NULL,
    courriel VARCHAR(255) NOT NULL,
    dateAutorisation VARCHAR(255) NOT NULL,
    dateCaducité VARCHAR(255) NOT NULL,
    dateFermeture VARCHAR(255) NOT NULL,
    dateMaj VARCHAR(255) NOT NULL,
    dateMiseAJourSource VARCHAR(255) NOT NULL,
    dateModificationSiret VARCHAR(255) NOT NULL,
    dateOuverture VARCHAR(255) NOT NULL,
    département VARCHAR(255) NOT NULL,
    indicateurCaducité VARCHAR(255) NOT NULL,
    libelléCatégorieAgrégatÉtablissement VARCHAR(255) NOT NULL,
    libelléCatégorieÉtablissement VARCHAR(255) NOT NULL,
    libelléCommune VARCHAR(255) NOT NULL,
    libelléCourtCatégorieAgrégatÉtablissement VARCHAR(255) NOT NULL,
    libelléCourtCatégorieÉtablissement VARCHAR(255) NOT NULL,
    libelléCourtMft VARCHAR(255) NOT NULL,
    libelléCourtSph VARCHAR(255) NOT NULL,
    libelléDépartement VARCHAR(255) NOT NULL,
    libelléMft VARCHAR(255) NOT NULL,
    libelléPays VARCHAR(255) NOT NULL,
    libelléSph VARCHAR(255) NOT NULL,
    lieuDitBoîtePostale VARCHAR(255) NOT NULL,
    ligneAcheminement VARCHAR(255) NOT NULL,
    natureÉtablissement VARCHAR(255) NOT NULL,
    numéroFinessEntitéJuridique VARCHAR(255) NOT NULL,
    numéroFinessÉtablissementPrincipal VARCHAR(255) NOT NULL,
    numéroFinessÉtablissementTerritorial VARCHAR(255) NOT NULL,
    numéroVoie VARCHAR(255) NOT NULL,
    numéroÉducationNationale VARCHAR(255) NOT NULL,
    origineModificationSiret VARCHAR(255) NOT NULL,
    raisonSociale VARCHAR(255) NOT NULL,
    raisonSocialeLongue VARCHAR(255) NOT NULL,
    siret VARCHAR(255) NOT NULL,
    typeFermeture VARCHAR(255) NOT NULL,
    typeVoie VARCHAR(255) NOT NULL,
    typeÉtablissement VARCHAR(255) NOT NULL,
    télécopie VARCHAR(255) NOT NULL,
    téléphone VARCHAR(255) NOT NULL,
    voie VARCHAR(255) NOT NULL,

    CONSTRAINT établissement_territorial_pk
        PRIMARY KEY (numéroFinessÉtablissementTerritorial),

    CONSTRAINT établissement_territorial_entité_juridique_finess_fk
        FOREIGN KEY (numéroFinessEntitéJuridique)
        REFERENCES EntitéJuridique (numéroFiness)
        ON DELETE CASCADE
);
