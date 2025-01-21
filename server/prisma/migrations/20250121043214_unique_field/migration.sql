/*
  Warnings:

  - A unique constraint covering the columns `[memberId]` on the table `tblaccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountName]` on the table `tblaccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[memberId,accountName]` on the table `tblaccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tblaccount_memberId_key" ON "tblaccount"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "tblaccount_accountName_key" ON "tblaccount"("accountName");

-- CreateIndex
CREATE UNIQUE INDEX "tblaccount_memberId_accountName_key" ON "tblaccount"("memberId", "accountName");
