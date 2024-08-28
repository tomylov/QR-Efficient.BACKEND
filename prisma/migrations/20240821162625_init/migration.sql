-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(125) NOT NULL,
    "nombre" VARCHAR(125) NOT NULL,
    "apellido" VARCHAR(125) NOT NULL,
    "dni" VARCHAR(10) NOT NULL,
    "grupoId" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grupo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(125) NOT NULL,

    CONSTRAINT "Grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(125) NOT NULL,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GrupoPermisos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GrupoPermisos_AB_unique" ON "_GrupoPermisos"("A", "B");

-- CreateIndex
CREATE INDEX "_GrupoPermisos_B_index" ON "_GrupoPermisos"("B");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GrupoPermisos" ADD CONSTRAINT "_GrupoPermisos_A_fkey" FOREIGN KEY ("A") REFERENCES "Grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GrupoPermisos" ADD CONSTRAINT "_GrupoPermisos_B_fkey" FOREIGN KEY ("B") REFERENCES "Permiso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
