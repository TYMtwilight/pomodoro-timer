/*
  Warnings:

  - You are about to drop the column `task_id` on the `records` table. All the data in the column will be lost.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "records" DROP CONSTRAINT "records_task_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_user_id_fkey";

-- DropIndex
DROP INDEX "records_task_id_idx";

-- AlterTable
ALTER TABLE "records" DROP COLUMN "task_id";

-- DropTable
DROP TABLE "tasks";
