# API del Gestor Circadiano (staging del piloto). Contexto de build: la raiz del repo.
#   docker build -f apps/api/Dockerfile -t circadiano-api .
# Imagen sencilla a proposito: conserva node_modules completo porque al arrancar
# necesita la CLI de Prisma (migrate deploy) y tsx (seed). Se puede adelgazar luego.
FROM node:24.15.0-bookworm-slim

# openssl lo usa la CLI de Prisma; ca-certificates, la conexion TLS a Neon/Supabase.
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY --chown=node:node . .
ENV NX_DAEMON=false
RUN npx nx build api --configuration=production

ENV NODE_ENV=production \
    PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Las migraciones y el seed son idempotentes: reiniciar no duplica datos.
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && exec node dist/apps/api/main.js"]
