#!/bin/bash

# Script de montée de version postgres local
# Permet d’automatiser la sauvegarde de l’ancienne version
# Et le chargement des données dans la nouvelle version

DB_CONTAINER_NAME="helios_db"
DB_VOLUME_NAME="helios_postgres_data"
DB_USER=helios
DB_NAME=helios
DUMP_CONTAINER_NAME="dump"
DUMP_VOLUME="tmp_dump"
DUMP_DIR="/dump"
DUMP_FILE=$DUMP_DIR/"pgdump"

check_error() {
	error_code=$?
	message=$1
	if [[ $error_code -ne 0 ]]; then
		echo "Une erreur est survenue:"
		echo -e "\t$message"
		cleanup
		exit $error_code
	fi
}

cleanup() {
	echo "Arrêt du conteneur de dump"
	docker stop $DUMP_CONTAINER_NAME >/dev/null 2>&1

	echo "Retrait du volume temporaire de dump"
	docker volume rm $DUMP_VOLUME >/dev/null 2>&1
}

if [[ $# -ne 2 ]]; then
	echo "2 arguments sont attendus. L’ancienne version de BDD et la nouvelle version de BDD"
	exit 1
fi

OLD_VER=$1
NEW_VER=$2
DB_VOLUME_BCK=$DB_VOLUME_NAME-$OLD_VER

echo "Le script vas procéder à la migration des données postgres de la version [$OLD_VER] à la version [$NEW_VER]"

echo "Pull des images docker"

echo -e "\tPull de la version [$OLD_VER]"
docker pull postgres:$OLD_VER 2>&1 >/dev/null
check_error "Erreur lors du pull de la version $OLD_VER"

echo -e "\tPull de la version [$NEW_VER]"
docker pull postgres:$NEW_VER 2>&1 >/dev/null
check_error "Erreur lors du pull de la version $NEW_VER"

echo "Vérification de la présence d’un ancien volume de backup"
docker volume inspect $DB_VOLUME_BCK >/dev/null 2>&1

status=$?
if [[ $status -eq 0 ]]; then
	echo "Un volume de backup existe déjà pour la version [$OLD_VER] -> [$DB_VOLUME_BCK]"
	echo "Ce volume doit être supprimé avant de pouvoir continuer"
	echo "Tapez sur nimporte quelle touche pour confirmer la suppression ou [CTRL+C] pour arrêter le script"
	read
	docker volume rm $DB_VOLUME_BCK 2>&1 >/dev/null
	check_error "Erreur lors de la suppression de l’ancien volume de backup"
else
	echo "Pas de volume de backup trouvé"
fi

echo "Arrêt de la BDD et suppression du conteneur"
docker stop $DB_CONTAINER_NAME 2>&1 >/dev/null && docker rm $DB_CONTAINER_NAME >/dev/null 2>&1

echo "Création d’une backup des données de la BDD"
echo -e "\tCréation d’un volume de backup"
docker volume create $DB_VOLUME_BCK 2>&1 >/dev/null
check_error "Erreur lors de la création du volume"

echo -e "\tBackup des données"
docker run --rm -it -v $DB_VOLUME_NAME:/from:ro -v $DB_VOLUME_BCK:/to alpine sh -c "cd /from ; cp -a . /to"
check_error "Une erreur est survenue lors du backup des données depuis le volume [$DB_VOLUME_NAME] vers le volume [$DB_VOLUME_BCK]"

echo "Création d’un dump"
echo -e "\tSuppression du volume temporaire de dump"
docker volume rm $DUMP_VOLUME >/dev/null 2>&1

echo -e "\tCréation du volume temporaire de dump"
docker volume create $DUMP_VOLUME >/dev/null 2>&1
check_error "Erreur lors de la création du volume temporaire de dump"

echo -e "\tLancement de la BDD de création du dump"
docker run -d --rm --name $DUMP_CONTAINER_NAME -v $DUMP_VOLUME:$DUMP_DIR -v $DB_VOLUME_NAME:/var/lib/postgresql/data postgres:$OLD_VER >/dev/null 2>&1
check_error "Erreur lors du lancement de la BDD de création de dump"

echo -e "\tAttente de 5s le temps que la BDD se lance"
sleep 5

echo -e "\tCréation du dump"
docker exec -it $DUMP_CONTAINER_NAME bash -c "pg_dump -d $DB_NAME -U $DB_USER -f $DUMP_FILE"
check_error "Erreur lors de la création du dump"

echo -e "\tArrêt de la BDD de dump"
docker stop $DUMP_CONTAINER_NAME >/dev/null 2>&1
check_error "Erreur lors de l'arrêt du conteneur BDD de dump"

echo "Suppression du volume de BDD"
docker volume rm $DB_VOLUME_NAME >/dev/null 2>&1
check_error "Erreur lors de la suppression du volume de BDD"

echo "Création du volume de BDD"
docker volume create $DB_VOLUME_NAME >/dev/null 2>&1
check_error "Erreur lors de la création du volume de BDD"

echo "Réintegration du dump dans la nouvelle BDD"
echo -e "\tLancement de la BDD de chargement du dump"
docker run -d --rm --name $DUMP_CONTAINER_NAME -v $DUMP_VOLUME:$DUMP_DIR -v $DB_VOLUME_NAME:/var/lib/postgresql/data \
	-e POSTGRES_DB=helios \
	-e POSTGRES_USER=helios \
	-e POSTGRES_PASSWORD=h3li0s \
	postgres:$NEW_VER >/dev/null 2>&1
check_error "Erreur lors de la création du conteneur de chargement du dump"

echo -e "\tAttente de 5s le temps que la BDD se lance"
sleep 5

echo -e "\tChargement du dump"
docker exec -it $DUMP_CONTAINER_NAME bash -c "psql -X -d $DB_NAME -U $DB_USER -f $DUMP_FILE >/dev/null 2>&1"
check_error "Erreur lors du chargement du dump dans la version [$NEW_VER]"

echo "Clean des conteneur et volumes temporaires"
cleanup
echo "La migration est finie"
