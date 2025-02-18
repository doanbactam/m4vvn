/*
  Warnings:

  - You are about to drop the column `firstCommitDate` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `forks` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `lastCommitDate` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `repositoryUrl` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `stars` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the `License` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StackToTool` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_licenseId_fkey";

-- DropForeignKey
ALTER TABLE "_StackToTool" DROP CONSTRAINT "_StackToTool_A_fkey";

-- DropForeignKey
ALTER TABLE "_StackToTool" DROP CONSTRAINT "_StackToTool_B_fkey";

-- DropIndex
DROP INDEX "Tool_isFeatured_score_idx";

-- DropIndex
DROP INDEX "Tool_repositoryUrl_key";

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "firstCommitDate",
DROP COLUMN "forks",
DROP COLUMN "lastCommitDate",
DROP COLUMN "repositoryUrl",
DROP COLUMN "score",
DROP COLUMN "stars";

-- DropTable
DROP TABLE "License";

-- DropTable
DROP TABLE "Stack";

-- DropTable
DROP TABLE "_StackToTool";

-- CreateIndex
CREATE INDEX "Tool_isFeatured_idx" ON "Tool"("isFeatured");
