# --- Etapa 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Instalamos pnpm globalmente
RUN npm install -g pnpm

# Copiamos archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalamos dependencias (incluyendo devDependencies)
# --frozen-lockfile es el equivalente a 'npm ci'
RUN pnpm install --frozen-lockfile

# Copiamos el código fuente
COPY tsconfig.json ./
COPY src ./src
COPY public ./public

# Compilamos
RUN pnpm run build

# --- Etapa 2: Production ---
FROM node:20-alpine

WORKDIR /app

# También necesitamos pnpm en la etapa final para instalar deps de producción
RUN npm install -g pnpm

# Copiamos manifests
COPY package.json pnpm-lock.yaml ./

# Instalamos SOLO dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Copiamos los archivos compilados desde la etapa 'builder'
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3002

# Iniciamos directo con Node para ahorrar memoria (no hace falta pasar por pnpm start)
CMD ["node", "dist/server.js"]