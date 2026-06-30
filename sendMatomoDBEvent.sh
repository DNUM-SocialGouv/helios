#!/bin/bash

python -m datacrawler.fetch_active_users &&
	python -m datacrawler.fetch_inactive_users 
