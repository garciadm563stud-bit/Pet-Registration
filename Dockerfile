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

# Install Node and build frontend
RUN apt-get update && apt-get install -y nodejs npm
RUN npm install
RUN npm run build

# Create storage folder and symlink
RUN mkdir -p storage/app/public
RUN ln -s /app/storage/app/public /app/public/storage

# Fix permissions
RUN chmod -R 777 storage bootstrap/cache

EXPOSE 8080

CMD php artisan config:clear && \
    php artisan route:clear && \
    php artisan cache:clear && \
    php -S 0.0.0.0:8080 -t public