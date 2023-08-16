-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN', 'MANAGER', 'TENDER') NOT NULL DEFAULT 'USER',
    `forgotPasswordToken` VARCHAR(191) NULL,
    `forgotPasswordExpiry` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Amenity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Property` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numberOfBedrooms` INTEGER NOT NULL,
    `numberOfBathrooms` INTEGER NOT NULL,
    `possession` VARCHAR(191) NOT NULL,
    `hasBalcony` BOOLEAN NOT NULL,
    `isApartment` BOOLEAN NOT NULL,
    `hasParking` BOOLEAN NOT NULL,
    `hasPowerBackup` BOOLEAN NOT NULL,
    `buildingAge` VARCHAR(191) NOT NULL,
    `maintenanceCharges` DOUBLE NOT NULL,
    `builtupArea` DOUBLE NOT NULL,
    `furnishingStatus` VARCHAR(191) NOT NULL,
    `floor` VARCHAR(191) NOT NULL,
    `gatedSecurity` BOOLEAN NOT NULL,
    `ownershipType` VARCHAR(191) NOT NULL,
    `flooring` VARCHAR(191) NOT NULL,
    `carpetArea` DOUBLE NOT NULL,
    `facing` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PropertyAmenities` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PropertyAmenities_AB_unique`(`A`, `B`),
    INDEX `_PropertyAmenities_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PropertyAmenities` ADD CONSTRAINT `_PropertyAmenities_A_fkey` FOREIGN KEY (`A`) REFERENCES `Amenity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PropertyAmenities` ADD CONSTRAINT `_PropertyAmenities_B_fkey` FOREIGN KEY (`B`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
