#!/bin/bash

cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/

if [ "$CI" != "true" ]; then
	cp node_modules/async-function/require.mjs .next/standalone/node_modules/async-function/
	cp node_modules/generator-function/require.mjs .next/standalone/node_modules/generator-function/
	cp node_modules/async-generator-function/require.mjs .next/standalone/node_modules/async-generator-function/
else
	echo "CI environment detected, skipping cp from node_modules."
fi
