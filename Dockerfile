FROM dunglas/frankenphp:php8.2

RUN install-php-extensions \
    gd \
    pdo_mysql \
    mbstring \
    curl \
    dom \
    fileinfo \
    xml \
    zip

WORKDIR /app

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]