FROM php:8.2-cli

RUN docker-php-ext-install gd pdo_mysql

COPY . /app
WORKDIR /app

RUN composer install --no-dev --optimize-autoloader

CMD php artisan serve --host=0.0.0.0 --port=$PORT