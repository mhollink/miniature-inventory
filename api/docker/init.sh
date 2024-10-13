#!/bin/bash

echo "PROFILE=development
DB_HOST=mariadb
DB_PORT=3306
DB_DATABASE=my_database
DB_USERNAME=my_user
DB_PASSWORD=my_password" > /var/www/html/.env

apache2-foreground
