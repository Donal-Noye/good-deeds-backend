/*
  Warnings:

  - Made the column `tag` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "tag" SET NOT NULL;
