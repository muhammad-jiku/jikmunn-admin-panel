/*
  Warnings:

  - The primary key for the `tblaccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `tblaccount` table. All the data in the column will be lost.
  - The primary key for the `tbltransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `tbltransaction` table. All the data in the column will be lost.
  - The `status` column on the `tbltransaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `tbltransaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `tbluser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `accounts` on the `tbluser` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `tbluser` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `tbluser` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `tbluser` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `tbluser` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `tbluser` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `tbluser` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `tbluser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `tbluser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[memberId]` on the table `tbluser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adminId]` on the table `tbluser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[superAdminId]` on the table `tbluser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[memberId,adminId,superAdminId]` on the table `tbluser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `tblaccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `tbltransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `tbluser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `tbluser` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `tbluser` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MEMBER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "Months" AS ENUM ('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER');

-- DropForeignKey
ALTER TABLE "tblaccount" DROP CONSTRAINT "tblaccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "tbltransaction" DROP CONSTRAINT "tbltransaction_userId_fkey";

-- DropIndex
DROP INDEX "tbluser_email_key";

-- AlterTable
ALTER TABLE "tblaccount" DROP CONSTRAINT "tblaccount_pkey",
DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tblaccount_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tblaccount_id_seq";

-- AlterTable
ALTER TABLE "tbltransaction" DROP CONSTRAINT "tbltransaction_pkey",
DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL DEFAULT 'INCOME',
ADD CONSTRAINT "tbltransaction_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tbltransaction_id_seq";

-- AlterTable
ALTER TABLE "tbluser" DROP CONSTRAINT "tbluser_pkey",
DROP COLUMN "accounts",
DROP COLUMN "contact",
DROP COLUMN "country",
DROP COLUMN "currency",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "provider",
ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "memberId" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL,
ADD COLUMN     "superAdminId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET NOT NULL,
ADD CONSTRAINT "tbluser_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tbluser_id_seq";

-- CreateTable
CREATE TABLE "tblmember" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "profileImage" TEXT,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "provider" TEXT,
    "country" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tblmember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbladmin" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "profileImage" TEXT,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbladmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tblsuperadmin" (
    "id" TEXT NOT NULL,
    "superAdminId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "profileImage" TEXT,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tblsuperadmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tblmember_memberId_key" ON "tblmember"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "tblmember_email_key" ON "tblmember"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tblmember_contact_key" ON "tblmember"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "tbladmin_adminId_key" ON "tbladmin"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "tbladmin_email_key" ON "tbladmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbladmin_contact_key" ON "tbladmin"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "tblsuperadmin_superAdminId_key" ON "tblsuperadmin"("superAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "tblsuperadmin_email_key" ON "tblsuperadmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tblsuperadmin_contact_key" ON "tblsuperadmin"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "tbluser_userId_key" ON "tbluser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tbluser_memberId_key" ON "tbluser"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "tbluser_adminId_key" ON "tbluser"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "tbluser_superAdminId_key" ON "tbluser"("superAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "tbluser_memberId_adminId_superAdminId_key" ON "tbluser"("memberId", "adminId", "superAdminId");

-- AddForeignKey
ALTER TABLE "tbluser" ADD CONSTRAINT "tbluser_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "tblmember"("memberId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbluser" ADD CONSTRAINT "tbluser_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "tbladmin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbluser" ADD CONSTRAINT "tbluser_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "tblsuperadmin"("superAdminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblaccount" ADD CONSTRAINT "tblaccount_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "tblmember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbltransaction" ADD CONSTRAINT "tbltransaction_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "tblmember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
