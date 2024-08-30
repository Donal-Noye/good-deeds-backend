/*
  Warnings:

  - A unique constraint covering the columns `[userId,friendId]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Friends_userId_friendId_key" ON "Friends"("userId", "friendId");
