/*
  Warnings:

  - You are about to drop the column `name` on the `tbladmin` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `tblmember` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `tblsuperadmin` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `tbladmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `tbladmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `tblmember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `tblmember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `tblsuperadmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `tblsuperadmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbladmin" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT;

-- AlterTable
ALTER TABLE "tblmember" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT;

-- AlterTable
ALTER TABLE "tblsuperadmin" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT;
