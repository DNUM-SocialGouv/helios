#!/usr/bin/env bash
#
# init_keycloak.sh
#
# Populates the "Helios" Keycloak realm.
# It also regenerates the "client_1" client secret and updates it in .env.
#
# Requirements: curl, jq
# Usage: ./init_keycloak.sh
#
# Configuration values are fixed below (edit the script to change them).

set -euo pipefail

KEYCLOAK_URL="http://localhost:8080"
KEYCLOAK_REALM="Helios"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin"
APP_CLIENT_ID="helios"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${REPO_ROOT}/.env.local"
ENV_SAMPLE_FILE="${REPO_ROOT}/.env"

for bin in curl jq; do
	if ! command -v "$bin" >/dev/null 2>&1; then
		echo "Error: '$bin' is required but not installed." >&2
		exit 1
	fi
done

echo "Waiting for Keycloak to be ready at ${KEYCLOAK_URL}..."
until curl --silent --fail --output /dev/null "${KEYCLOAK_URL}/realms/master"; do
	sleep 2
done

echo "Authenticating against the master realm as '${ADMIN_USERNAME}'..."
ADMIN_TOKEN=$(curl --silent --fail \
	-X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-d "grant_type=password" \
	-d "client_id=admin-cli" \
	-d "username=${ADMIN_USERNAME}" \
	-d "password=${ADMIN_PASSWORD}" |
	jq -r '.access_token')

if [[ -z "${ADMIN_TOKEN}" || "${ADMIN_TOKEN}" == "null" ]]; then
	echo "Error: failed to obtain an admin access token." >&2
	exit 1
fi

api() {
	curl --silent --fail -H "Authorization: Bearer ${ADMIN_TOKEN}" "$@"
}

echo "Looking up client '${APP_CLIENT_ID}' in realm '${KEYCLOAK_REALM}'..."
APP_CLIENT_UUID=$(api "${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/clients?clientId=${APP_CLIENT_ID}" |
	jq -r '.[0].id // empty')

if [[ -z "${APP_CLIENT_UUID}" ]]; then
	echo "Error: client '${APP_CLIENT_ID}' not found in realm '${KEYCLOAK_REALM}'." >&2
	exit 1
fi

echo "Regenerating client secret for '${APP_CLIENT_ID}'..."
NEW_CLIENT_SECRET=$(api -X POST "${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/clients/${APP_CLIENT_UUID}/client-secret" |
	jq -r '.value // empty')

if [[ -z "${NEW_CLIENT_SECRET}" ]]; then
	echo "Error: failed to regenerate the client secret for '${APP_CLIENT_ID}'." >&2
	exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
	if [[ -f "${ENV_SAMPLE_FILE}" ]]; then
		echo "'${ENV_FILE}' not found, copying '${ENV_SAMPLE_FILE}'..."
		cp "${ENV_SAMPLE_FILE}" "${ENV_FILE}"
	fi
fi

if [[ -f "${ENV_FILE}" ]]; then
	echo "Updating PROCONNECT_CLIENT_SECRET in '${ENV_FILE}'..."
	if grep -q '^PROCONNECT_CLIENT_SECRET=' "${ENV_FILE}"; then
		sed -i.bak "s|^PROCONNECT_CLIENT_SECRET=.*|PROCONNECT_CLIENT_SECRET='${NEW_CLIENT_SECRET}'|" "${ENV_FILE}"
		rm -f "${ENV_FILE}.bak"
	else
		echo "PROCONNECT_CLIENT_SECRET='${NEW_CLIENT_SECRET}'" >>"${ENV_FILE}"
	fi
	echo "Done. '${APP_CLIENT_ID}' secret regenerated and written to '${ENV_FILE}'."
else
	echo "Warning: '${ENV_FILE}' not found, new secret for '${APP_CLIENT_ID}' was not persisted: ${NEW_CLIENT_SECRET}" >&2
fi
