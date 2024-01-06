-- CreateTable
CREATE TABLE `BaileysSession` (
    `pkId` BIGINT NOT NULL AUTO_INCREMENT,
    `sessionId` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `data` LONGTEXT NOT NULL,

    INDEX `BaileysSession_sessionId_idx`(`sessionId`),
    UNIQUE INDEX `unique_id_per_session_id_session`(`sessionId`, `id`),
    PRIMARY KEY (`pkId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
