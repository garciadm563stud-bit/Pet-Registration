# FROM dunglas/frankenphp:php8.2

# # Install PHP extensions required by Laravel + Excel
# RUN install-php-extensions \
#     gd \
#     pdo_mysql \
#     mbstring \
#     curl \
#     dom \
#     fileinfo \
#     xml \
#     zip

# # Install Composer
# COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# WORKDIR /app

# # Copy project files
# COPY . .

# # Install Laravel dependencies
# RUN composer install --no-dev --optimize-autoloader

# # Cache Laravel config
# RUN php artisan config:cache
# RUN php artisan route:cache
# RUN php artisan view:cache

# # Start Laravel
# CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
FROM dunglas/frankenphp:php8.2

# Install PHP extensions
RUN install-php-extensions \
    gd \
    pdo_mysql \
    mbstring \
    curl \
    dom \
    fileinfo \
    xml \
    zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy project
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Install NodeJS (needed for React build)
RUN apt-get update && apt-get install -y nodejs npm

# Build frontend
RUN npm install
RUN npm run build

# Fix permissions
RUN chmod -R 775 storage bootstrap/cache

# IMPORTANT: create storage link for images
RUN php artisan storage:link

# Cache configs
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

EXPOSE 8080

# Start Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]