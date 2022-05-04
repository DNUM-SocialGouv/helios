CREATE TABLE DateMiseÀJourSource
(
    source VARCHAR(255) NOT NULL,
    dernièreMiseÀJour DATE NOT NULL,

    CONSTRAINT source_pk
        PRIMARY KEY (source)
);
