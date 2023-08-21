/*
  Warnings:

  - You are about to drop the `_propertyamenities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `availableDate` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildingType` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedDeposit` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedRent` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyType` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentNegotiable` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalFloor` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_propertyamenities` DROP FOREIGN KEY `_PropertyAmenities_A_fkey`;

-- DropForeignKey
ALTER TABLE `_propertyamenities` DROP FOREIGN KEY `_PropertyAmenities_B_fkey`;

-- AlterTable
ALTER TABLE `amenity` ADD COLUMN `icon` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `property` ADD COLUMN `availableDate` DATETIME(3) NOT NULL,
    ADD COLUMN `buildingType` VARCHAR(191) NOT NULL,
    ADD COLUMN `expectedDeposit` VARCHAR(191) NOT NULL,
    ADD COLUMN `expectedRent` VARCHAR(191) NOT NULL,
    ADD COLUMN `propertyType` VARCHAR(191) NOT NULL,
    ADD COLUMN `rentNegotiable` BOOLEAN NOT NULL,
    ADD COLUMN `totalFloor` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `token` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_propertyamenities`;

-- CreateTable
CREATE TABLE `PropertyAmenity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `propertyId` INTEGER NOT NULL,
    `amenityId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Photo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `propertyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ticket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyAmenity` ADD CONSTRAINT `PropertyAmenity_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyAmenity` ADD CONSTRAINT `PropertyAmenity_amenityId_fkey` FOREIGN KEY (`amenityId`) REFERENCES `Amenity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
