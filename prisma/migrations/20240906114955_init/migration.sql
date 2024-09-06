/*
  Warnings:

  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `apellido` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `dni` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_persona]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contrasena` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_persona` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_grupoId_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
DROP COLUMN "apellido",
DROP COLUMN "dni",
DROP COLUMN "id",
DROP COLUMN "nombre",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "contrasena" VARCHAR(125) NOT NULL,
ADD COLUMN     "id_persona" INTEGER NOT NULL,
ADD COLUMN     "id_usuario" SERIAL NOT NULL,
ALTER COLUMN "grupoId" DROP NOT NULL,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario");

-- CreateTable
CREATE TABLE "Persona" (
    "id_persona" SERIAL NOT NULL,
    "email" VARCHAR(125) NOT NULL,
    "nombre" VARCHAR(125) NOT NULL,
    "apellido" VARCHAR(125) NOT NULL,
    "dni" VARCHAR(10) NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id_persona")
);

-- CreateTable
CREATE TABLE "Mesero" (
    "id_mesero" SERIAL NOT NULL,
    "id_persona" INTEGER NOT NULL,
    "id_restaurante" INTEGER NOT NULL,

    CONSTRAINT "Mesero_pkey" PRIMARY KEY ("id_mesero")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id_cliente" SERIAL NOT NULL,
    "id_persona" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "Restaurante" (
    "id_restaurante" SERIAL NOT NULL,
    "nombre" VARCHAR(125) NOT NULL,
    "direccion" VARCHAR(125) NOT NULL,

    CONSTRAINT "Restaurante_pkey" PRIMARY KEY ("id_restaurante")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id_menu" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "foto" TEXT,
    "precio" DECIMAL(65,30) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "id_categoria" INTEGER NOT NULL,
    "id_restaurante" INTEGER NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id_menu")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "Mesa" (
    "numero" SERIAL NOT NULL,
    "id_restaurante" INTEGER NOT NULL,

    CONSTRAINT "Mesa_pkey" PRIMARY KEY ("numero")
);

-- CreateTable
CREATE TABLE "Mesa_atendida" (
    "id_mesa_atendida" SERIAL NOT NULL,
    "id_mesero" INTEGER NOT NULL,
    "id_mesa" INTEGER NOT NULL,
    "id_estado_mesa" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "ocupado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Mesa_atendida_pkey" PRIMARY KEY ("id_mesa_atendida")
);

-- CreateTable
CREATE TABLE "Estado_mesa" (
    "id_estado_mesa" SERIAL NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,

    CONSTRAINT "Estado_mesa_pkey" PRIMARY KEY ("id_estado_mesa")
);

-- CreateTable
CREATE TABLE "Cuenta" (
    "id_cuenta" SERIAL NOT NULL,
    "id_estado_cuenta" INTEGER NOT NULL,
    "id_mesa_atendida" INTEGER NOT NULL,
    "total" DECIMAL(20,2) NOT NULL,

    CONSTRAINT "Cuenta_pkey" PRIMARY KEY ("id_cuenta")
);

-- CreateTable
CREATE TABLE "Estado_cuenta" (
    "id_estado_cuenta" SERIAL NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,

    CONSTRAINT "Estado_cuenta_pkey" PRIMARY KEY ("id_estado_cuenta")
);

-- CreateTable
CREATE TABLE "Comanda" (
    "id_comanda" SERIAL NOT NULL,
    "id_estado_comanda" INTEGER NOT NULL,
    "id_cuenta" INTEGER NOT NULL,
    "id_persona" INTEGER NOT NULL,
    "observaciones" VARCHAR(50),

    CONSTRAINT "Comanda_pkey" PRIMARY KEY ("id_comanda")
);

-- CreateTable
CREATE TABLE "Estado_comanda" (
    "id_estado_comanda" SERIAL NOT NULL,
    "descripcion" VARCHAR(30) NOT NULL,

    CONSTRAINT "Estado_comanda_pkey" PRIMARY KEY ("id_estado_comanda")
);

-- CreateTable
CREATE TABLE "Detalle_comanda" (
    "id_detalle" SERIAL NOT NULL,
    "id_comanda" INTEGER NOT NULL,
    "id_menu" INTEGER NOT NULL,
    "observacion" VARCHAR(50),
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(20,2) NOT NULL,

    CONSTRAINT "Detalle_comanda_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mesero_id_persona_key" ON "Mesero"("id_persona");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_id_persona_key" ON "Cliente"("id_persona");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_id_persona_key" ON "Usuario"("id_persona");

-- AddForeignKey
ALTER TABLE "Mesero" ADD CONSTRAINT "Mesero_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "Persona"("id_persona") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mesero" ADD CONSTRAINT "Mesero_id_restaurante_fkey" FOREIGN KEY ("id_restaurante") REFERENCES "Restaurante"("id_restaurante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "Persona"("id_persona") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "Persona"("id_persona") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_id_restaurante_fkey" FOREIGN KEY ("id_restaurante") REFERENCES "Restaurante"("id_restaurante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mesa" ADD CONSTRAINT "Mesa_id_restaurante_fkey" FOREIGN KEY ("id_restaurante") REFERENCES "Restaurante"("id_restaurante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mesa_atendida" ADD CONSTRAINT "Mesa_atendida_id_mesero_fkey" FOREIGN KEY ("id_mesero") REFERENCES "Mesero"("id_mesero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mesa_atendida" ADD CONSTRAINT "Mesa_atendida_id_mesa_fkey" FOREIGN KEY ("id_mesa") REFERENCES "Mesa"("numero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mesa_atendida" ADD CONSTRAINT "Mesa_atendida_id_estado_mesa_fkey" FOREIGN KEY ("id_estado_mesa") REFERENCES "Estado_mesa"("id_estado_mesa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_id_estado_cuenta_fkey" FOREIGN KEY ("id_estado_cuenta") REFERENCES "Estado_cuenta"("id_estado_cuenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_id_mesa_atendida_fkey" FOREIGN KEY ("id_mesa_atendida") REFERENCES "Mesa_atendida"("id_mesa_atendida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comanda" ADD CONSTRAINT "Comanda_id_estado_comanda_fkey" FOREIGN KEY ("id_estado_comanda") REFERENCES "Estado_comanda"("id_estado_comanda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comanda" ADD CONSTRAINT "Comanda_id_cuenta_fkey" FOREIGN KEY ("id_cuenta") REFERENCES "Cuenta"("id_cuenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comanda" ADD CONSTRAINT "Comanda_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "Persona"("id_persona") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_comanda" ADD CONSTRAINT "Detalle_comanda_id_comanda_fkey" FOREIGN KEY ("id_comanda") REFERENCES "Comanda"("id_comanda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_comanda" ADD CONSTRAINT "Detalle_comanda_id_menu_fkey" FOREIGN KEY ("id_menu") REFERENCES "Menu"("id_menu") ON DELETE RESTRICT ON UPDATE CASCADE;
