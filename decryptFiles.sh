#! /bin/bash

echo "$DIAMANT_KEY" | base64 --decode | gpg --import
for encrypted_file in "$ENCRYPTED_DIAMANT_DATA_PATH"*
do
  echo "*****"
  echo "$ENCRYPTED_DIAMANT_DATA_PATH"
    encrypted_file_basename=$(basename "$encrypted_file")
    decrypted_file="${DIAMANT_DATA_PATH}${encrypted_file_basename}".CSV
    gpg --output decrypted_file --decrypt "$encrypted_file"
done



