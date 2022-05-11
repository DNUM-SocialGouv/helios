CREATE TABLE EntitéJuridique
(
    adresseAcheminement VARCHAR(255) NOT NULL,
    adresseNuméroVoie VARCHAR(5) NOT NULL,
    adresseTypeVoie VARCHAR(4) NOT NULL,
    adresseVoie VARCHAR(255) NOT NULL,
    libelléStatutJuridique VARCHAR(255) NOT NULL,
    numéroFinessEntitéJuridique VARCHAR(9) NOT NULL,
    raisonSociale VARCHAR(255) NOT NULL,
    téléphone VARCHAR(10) NOT NULL,

    CONSTRAINT entité_juridique_primary_key PRIMARY KEY (numéroFinessEntitéJuridique)
);
