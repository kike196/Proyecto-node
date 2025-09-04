# --- Etapa de construcción ---
# Usar una imagen base oficial de Node.js. Alpine es una buena opción por su tamaño reducido.
FROM node:20-alpine AS base

# Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# --- Etapa de dependencias ---
# Instalar solo las dependencias de producción
FROM base AS dependencies
RUN npm install --only=production

# --- Etapa de producción ---
# Copiar las dependencias de producción y el código de la aplicación
FROM base AS production
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

# El generador de Prisma Client se ejecuta aquí para asegurarse de que
# los ejecutables correctos para el entorno del contenedor (Linux) estén disponibles.
# Esto es crucial si desarrollas en Windows o macOS.
RUN npx prisma generate

# Exponer el puerto en el que la aplicación se ejecuta (3000 es un puerto común para Node.js)
EXPOSE 3000

# Comando para iniciar la aplicación.
# Este comando buscará el script "start" en tu package.json.
CMD [ "npm", "start" ]
