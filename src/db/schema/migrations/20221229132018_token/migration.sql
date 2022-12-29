-- CreateTable
CREATE TABLE "Token" (
    "value" TEXT NOT NULL PRIMARY KEY,
    "expiration_date" DATETIME NOT NULL,
    "tokenType" TEXT,
    "scope" TEXT
);
