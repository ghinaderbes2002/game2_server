/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Round` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Round_name_key` ON `Round`(`name`);
