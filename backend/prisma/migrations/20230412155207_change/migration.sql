/*
  Warnings:

  - You are about to drop the column `type` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "type",
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;
