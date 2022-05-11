CREATE TABLE EntitéJuridique
(
    adresseAcheminement VARCHAR(255) NOT NULL,
    adresseNuméroVoie VARCHAR(255) NOT NULL,
    adresseTypeVoie VARCHAR(255) NOT NULL,
    adresseVoie VARCHAR(255) NOT NULL,
    libelléStatutJuridique VARCHAR(255) NOT NULL,
    numéroFinessEntitéJuridique VARCHAR(255) NOT NULL,
    raisonSociale VARCHAR(255) NOT NULL,
    téléphone VARCHAR(255) NOT NULL,

    CONSTRAINT entité_juridique_primary_key PRIMARY KEY (numéroFinessEntitéJuridique)
);
