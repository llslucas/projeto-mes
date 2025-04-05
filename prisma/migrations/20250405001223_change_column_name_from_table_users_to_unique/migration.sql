/*
  Warnings:

  - The values [OPERATOR] on the enum `USER_ROLES` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[name]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "USER_ROLES_new" AS ENUM ('USER', 'ADMIN', 'DISABLED');
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "USER_ROLES_new" USING ("role"::text::"USER_ROLES_new");
ALTER TYPE "USER_ROLES" RENAME TO "USER_ROLES_old";
ALTER TYPE "USER_ROLES_new" RENAME TO "USER_ROLES";
DROP TYPE "USER_ROLES_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");
