-- CreateEnum
CREATE TYPE "rol" AS ENUM ('trabajador', 'jefe_operaciones', 'despachador', 'administrador');

-- CreateEnum
CREATE TYPE "estado_usuario" AS ENUM ('activo', 'retirado');

-- CreateTable
CREATE TABLE "area" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "sede" VARCHAR(120),

    CONSTRAINT "area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL,
    "id_area" UUID NOT NULL,
    "codigo_participante" VARCHAR(10) NOT NULL,
    "rol" "rol" NOT NULL,
    "cargo" VARCHAR(120),
    "correo" VARCHAR(255) NOT NULL,
    "hash_clave" TEXT NOT NULL,
    "rango_edad" VARCHAR(20),
    "sexo" VARCHAR(20),
    "consentimiento" BOOLEAN NOT NULL DEFAULT false,
    "fecha_consentimiento" TIMESTAMPTZ,
    "estado" "estado_usuario" NOT NULL DEFAULT 'activo',
    "semivida_h" DECIMAL(3,1) NOT NULL DEFAULT 5,
    "fuma" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "area_nombre_key" ON "area"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_codigo_participante_key" ON "usuario"("codigo_participante");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
