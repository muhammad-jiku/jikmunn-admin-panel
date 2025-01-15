-- CreateTable
CREATE TABLE "tbluser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "contact" TEXT,
    "accounts" TEXT[],
    "password" TEXT,
    "provider" TEXT,
    "country" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbluser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tblaccount" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountBalance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tblaccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbltransaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "source" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'income',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbltransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbluser_email_key" ON "tbluser"("email");

-- AddForeignKey
ALTER TABLE "tblaccount" ADD CONSTRAINT "tblaccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbluser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbltransaction" ADD CONSTRAINT "tbltransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbluser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
