#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
BASE="$DIR/.."

if [ -f "$DIR/secrets.env" ]; then
    apikey=$(cat "$BASE/secrets.env")
else
    apikey=${1}
fi

curl -H "Content-Type: application/json" \
    -H "factom-provider-token: $apikey" \
    "https://apiplus-api-sandbox-testnet.factom.com/v1/"
