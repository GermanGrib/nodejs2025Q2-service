-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "artistIds" TEXT[],
    "albumIds" TEXT[],
    "trackIds" TEXT[],

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);
