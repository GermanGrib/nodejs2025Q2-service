/*
  Warnings:

  - You are about to drop the `Favorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FavoriteAlbums` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FavoriteArtists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FavoriteTracks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_userId_fkey";

-- DropForeignKey
ALTER TABLE "_FavoriteAlbums" DROP CONSTRAINT "_FavoriteAlbums_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavoriteAlbums" DROP CONSTRAINT "_FavoriteAlbums_B_fkey";

-- DropForeignKey
ALTER TABLE "_FavoriteArtists" DROP CONSTRAINT "_FavoriteArtists_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavoriteArtists" DROP CONSTRAINT "_FavoriteArtists_B_fkey";

-- DropForeignKey
ALTER TABLE "_FavoriteTracks" DROP CONSTRAINT "_FavoriteTracks_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavoriteTracks" DROP CONSTRAINT "_FavoriteTracks_B_fkey";

-- DropTable
DROP TABLE "Favorites";

-- DropTable
DROP TABLE "_FavoriteAlbums";

-- DropTable
DROP TABLE "_FavoriteArtists";

-- DropTable
DROP TABLE "_FavoriteTracks";
