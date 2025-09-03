FROM php:8.2-fpm-alpine

# Instalar dependências do sistema
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql zip

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definir diretório de trabalho
WORKDIR /var/www

# Instalar dependências do PHP (será executado quando o volume for montado)
# RUN composer install --no-dev --optimize-autoloader --no-interaction

# Definir permissões (será executado quando o volume for montado)
# RUN chown -R www-data:www-data /var/www \
#     && chmod -R 755 /var/www/storage \
#     && chmod -R 755 /var/www/bootstrap/cache

# Expor porta
EXPOSE 9000

CMD ["php-fpm"]
