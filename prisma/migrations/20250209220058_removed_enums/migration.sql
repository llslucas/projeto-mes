/*
  Warnings:

  - Changed the type of `number` on the `MachineOperator` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `level` on the `MachineOperator` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MachineOperator" DROP COLUMN "number",
ADD COLUMN     "number" INTEGER NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "partsReported" INTEGER,
ADD COLUMN     "scrapsReported" INTEGER,
ALTER COLUMN "elapsedTimeInSeconds" DROP NOT NULL;

-- DropEnum
DROP TYPE "MachineOperatorLevel";

-- CreateIndex
CREATE UNIQUE INDEX "MachineOperator_number_key" ON "MachineOperator"("number");
