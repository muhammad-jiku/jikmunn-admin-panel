-- DropForeignKey
ALTER TABLE "tblaccount" DROP CONSTRAINT "tblaccount_memberId_fkey";

-- DropForeignKey
ALTER TABLE "tbltransaction" DROP CONSTRAINT "tbltransaction_memberId_fkey";

-- AddForeignKey
ALTER TABLE "tblaccount" ADD CONSTRAINT "tblaccount_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "tblmember"("memberId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbltransaction" ADD CONSTRAINT "tbltransaction_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "tblmember"("memberId") ON DELETE RESTRICT ON UPDATE CASCADE;
