# Use the official PHP image with Apache
FROM php:8.1-apache

# Install necessary PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy the Slim application files into the container
COPY . .

# Enable Apache mod_rewrite for Slim
RUN a2enmod rewrite

# Set up Apache configuration for Slim
COPY ./apache.conf /etc/apache2/sites-available/000-default.conf

# Install PHP dependencies
RUN composer install


# Copy the init script into the container
COPY docker/init.sh /init-apache.sh

# Make sure the script is executable
RUN chmod +x /init-apache.sh

# Set the entrypoint to the init script
ENTRYPOINT ["/init-apache.sh"]

# Expose port 80 for the web server
EXPOSE 80
