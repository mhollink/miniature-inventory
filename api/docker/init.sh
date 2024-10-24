#!/bin/bash

echo "PROFILE=development
DB_HOST=db
DB_PORT=3306
DB_DATABASE=my_database
DB_USERNAME=my_user
DB_PASSWORD=my_password
API_KEY=GqK00Oy6tH#ISp2ku4aL" > /var/www/html/.env

apache2-foreground
