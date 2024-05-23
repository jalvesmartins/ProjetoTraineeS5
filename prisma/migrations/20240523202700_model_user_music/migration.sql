-- CreateTable
CREATE TABLE "UserMusic" (
    "userId" INTEGER NOT NULL,
    "musicId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "musicId"),
    CONSTRAINT "UserMusic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserMusic_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "Music" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
