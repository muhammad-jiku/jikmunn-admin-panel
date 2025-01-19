/*
  Warnings:

  - You are about to drop the column `firstName` on the `tbladmin` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `tbladmin` table. All the data in the column will be lost.
  - You are about to drop the column `middleName` on the `tbladmin` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `tblmember` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `tblmember` table. All the data in the column will be lost.
  - You are about to drop the column `middleName` on the `tblmember` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `tblsuperadmin` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `tblsuperadmin` table. All the data in the column will be lost.
  - You are about to drop the column `middleName` on the `tblsuperadmin` table. All the data in the column will be lost.
  - Added the required column `name` to the `tbladmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `tblmember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `tblsuperadmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbladmin" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "middleName",
ADD COLUMN     "name" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "tblmember" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "middleName",
ADD COLUMN     "name" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "tblsuperadmin" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "middleName",
ADD COLUMN     "name" JSONB NOT NULL;
