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

# Install required PHP extensions
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

# Copy project files
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node and build frontend assets
RUN apt-get update && apt-get install -y nodejs npm
RUN npm install
RUN npm run build

# Ensure Laravel storage folders exist
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && chmod -R 775 storage bootstrap/cache

# Cache Laravel configuration
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

# Expose Railway port
EXPOSE 8080

# Start Laravel server
CMD ["php","artisan","serve","--host=0.0.0.0","--port=8080"]