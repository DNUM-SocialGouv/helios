#!/bin/bash

# Script de restoration des données de volume
# Le script copie le contenu d’un volume source dans un volume cible
# ! Le volume cible est supprimé et recréer vide avant la restioration

check_error() {
	error_code=$?
	message=$1
	if [[ $error_code -ne 0 ]]; then
		echo "Une erreur est survenue:"
		echo -e "\t$message"
		exit $error_code
	fi
}

SOURCE=$1
DEST=$2

echo "Le script vas procéder à la duplication du volume [$SOURCE] dans un nouveau volume [$DEST]"

echo "Vérification de la présence d’un ancien volume [$DEST]"
docker volume inspect $DEST >/dev/null 2>&1

status=$?
if [[ $status -eq 0 ]]; then
	echo "Le volume [$DEST] existe déjà."
	echo "Ce volume doit être supprimé avant de pouvoir continuer"
	echo "Tapez sur nimporte quelle touche pour confirmer la suppression ou [CTRL+C] pour arrêter le script"
	read
	docker volume rm $DEST 2>&1 >/dev/null
	check_error "Erreur lors de la suppression de l’ancien volume de backup"
else
	echo "Pas de volume de backup trouvé"
fi

echo "Création du volume [$DEST]"
docker volume create $DEST >/dev/null 2>&1
check_error "Erreur lors de la création du volume [$DEST]"

echo "Copie du volume [$SOURCE] dans le volume [$DEST]"
docker run --rm -it -v $SOURCE:/from:ro -v $DEST:/to alpine sh -c "cd /from ; cp -a . /to"
check_error "Une erreur est survenue lors du backup des données depuis le volume [$DB_VOLUME_NAME] vers le volume [$DB_VOLUME_BCK]"

echo "Fin de la copie des données"
