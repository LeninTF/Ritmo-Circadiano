/*
  Warnings:

  - The `id_plan` column on the `notificacion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "notificacion" DROP COLUMN "id_plan",
ADD COLUMN     "id_plan" UUID;
