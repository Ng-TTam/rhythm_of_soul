CREATE DATABASE artist_service;

CREATE TABLE artists
(
    id            CHAR(40) PRIMARY KEY,
    user_id       CHAR(40)     NOT NULL UNIQUE,
    stage_name    VARCHAR(100) NOT NULL,
    bio           TEXT,
    avatar_url    TEXT,
    facebook_url  TEXT,
    instagram_url TEXT,
    youtube_url   TEXT,
    is_verified   BOOLEAN   DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#   INDEX idx_artists_user_id (user_id)
);

CREATE TABLE albums
(
    id           CHAR(40) PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    cover_url    TEXT,
    release_date DATE,
    artist_id    CHAR(40)     NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists (id) ON DELETE CASCADE
#   INDEX idx_albums_artist_id (artist_id)
);

-- Bảng songs
CREATE TABLE songs
(
    id               CHAR(40) PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    duration         INT,
    audio_url        TEXT,
    thumbnail_url    TEXT,
    release_date     DATE,
    is_published     BOOLEAN   DEFAULT FALSE,
    last_notified_at TIMESTAMP,
    artist_id        CHAR(40)     NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists (id) ON DELETE CASCADE
        #                        INDEX idx_songs_artist_id (artist_id),
    #                        INDEX idx_songs_release_date (release_date),
    #                        INDEX idx_songs_is_published (is_published)
);

CREATE TABLE genres
(
    id          CHAR(40) PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Bảng song_genres (liên kết n-n songs và genres)
CREATE TABLE song_genres
(
    song_id  CHAR(40) NOT NULL,
    genre_id CHAR(40) NOT NULL,
    PRIMARY KEY (song_id, genre_id),
    FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE,
    INDEX idx_song_genres_song_id (song_id),
    INDEX idx_song_genres_genre_id (genre_id)
);

-- Bảng album_songs (liên kết n-n albums và songs)
CREATE TABLE album_songs
(
    album_id CHAR(40) NOT NULL,
    song_id  CHAR(40) NOT NULL,
    PRIMARY KEY (album_id, song_id),
    FOREIGN KEY (album_id) REFERENCES albums (id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE
        #     INDEX idx_album_songs_album_id (album_id),
    #     INDEX idx_album_songs_song_id (song_id)
);

-- Bảng song_tags (lưu tag của bài hát)
CREATE TABLE song_tags
(
    song_id CHAR(40)    NOT NULL,
    tag     VARCHAR(50) NOT NULL,
    PRIMARY KEY (song_id, tag),
    FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE
        #     INDEX idx_song_tags_song_id (song_id),
    #     INDEX idx_song_tags_tag (tag)
);

-- Bảng collaborations (lưu thông tin hợp tác)
CREATE TABLE collaborations
(
    song_id    CHAR(40) NOT NULL,
    artist_id  CHAR(40) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (song_id, artist_id),
    FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists (id) ON DELETE CASCADE
        #     INDEX idx_collaborations_song_id (song_id),
    #     INDEX idx_collaborations_artist_id (artist_id)
);

# -- Trigger để tự updated_at
# CREATE OR REPLACE FUNCTION update_timestamp()
#     RETURNS TRIGGER AS $$
# BEGIN
#     NEW.updated_at = CURRENT_TIMESTAMP;
#     RETURN NEW;
# END;
# $$
# language 'plpgsql';
#
# CREATE TRIGGER update_artists_timestamp
    #     BEFORE UPDATE
                     #     ON artists
                     #     FOR EACH ROW
                     #     EXECUTE FUNCTION update_timestamp();
#
# CREATE TRIGGER update_albums_timestamp
    #     BEFORE UPDATE
                     #     ON albums
                     #     FOR EACH ROW
                     #     EXECUTE FUNCTION update_timestamp();
#
# CREATE TRIGGER update_songs_timestamp
    #     BEFORE UPDATE
                     #     ON songs
                     #     FOR EACH ROW
                     #     EXECUTE FUNCTION update_timestamp();