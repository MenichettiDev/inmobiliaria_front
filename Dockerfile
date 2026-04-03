# ─────────────────────────────────────────────
# Etapa 1: Build Angular
# ─────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copiar manifiestos de dependencias (mejor cache de capas)
COPY package.json package-lock.json ./

# Instalar dependencias exactas del lockfile
RUN npm ci --prefer-offline

# Copiar código fuente
COPY . .

# Build (development por defecto, sobrescribir con ARG BUILD_CONFIGURATION si es necesario)
# El proyecto se llama "inmobiliaria", output en dist/inmobiliaria/browser
ARG BUILD_CONFIGURATION=development
RUN npm run build -- --configuration ${BUILD_CONFIGURATION}

# ─────────────────────────────────────────────
# Etapa 2: Servir con Nginx (imagen mínima)
# ─────────────────────────────────────────────
FROM nginx:1.25-alpine AS runtime

# Eliminar configuración default de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar nuestra configuración nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copiar el build de Angular (browser, no server/SSR)
COPY --from=build /app/dist/inmobiliaria/browser /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]