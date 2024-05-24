-- CreateTable
CREATE TABLE "_MusicToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MusicToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Music" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MusicToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_MusicToUser_AB_unique" ON "_MusicToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicToUser_B_index" ON "_MusicToUser"("B");
