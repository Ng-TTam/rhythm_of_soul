
import React, { useState } from 'react';
import { IoMdAddCircle } from '@react-icons/all-files/io/IoMdAddCircle';
import { BsFillPlayFill } from '@react-icons/all-files/bs/BsFillPlayFill';
import CreatePlaylistDialog from './CreatePlaylistDialog';

interface Playlist {
    id: string;
    title: string;
    description: string;
    image: string;
    tracks: number;
    color: string;
}

const PlayListOwner: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([
        {
            id: '01',
            title: "Eliana d'cruz playlist",
            description: 'top 12 songs from Eliana and all type of songs.',
            image: '../assets/images/dashboard/01.png',
            tracks: 12,
            color: 'danger'
        },
    ]);

    const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

    const handleOpenCreateDialog = (): void => {
        setShowCreateDialog(true);
    };

    const handleCloseCreateDialog = (): void => {
        setShowCreateDialog(false);
    };

    const handleCreatePlaylist = (formData: { title: string; description: string }): void => {
        const newPlaylistItem: Playlist = {
            id: `0${playlists.length + 1}`,
            title: formData.title,
            description: formData.description || 'New custom playlist.',
            image: '../assets/images/dashboard/04.png', // Default image
            tracks: 0,
            color: 'primary'
        };

        setPlaylists([...playlists, newPlaylistItem]);
        handleCloseCreateDialog();
    };

    return (
        <>
            {/* Create Playlist Card */}
            <div className="col-xl-3 col-md-6 mb-3">
                <div
                    className="empty-playlist rounded-lg shadow-sm"
                    style={{
                        background: "linear-gradient(180deg, #f8f9fa 0%, #f8f9fa 100%)",
                        border: "1px dashed #e7eaec",
                        borderRadius: "10px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        padding: "20px",
                        minHeight: "200px",
                        transition: "all 0.3s ease"
                    }}
                    onClick={handleOpenCreateDialog}
                    onMouseOver={(e: React.MouseEvent<HTMLDivElement>) =>
                        e.currentTarget.style.backgroundColor = "#f0f0f0"
                    }
                    onMouseOut={(e: React.MouseEvent<HTMLDivElement>) =>
                        e.currentTarget.style.backgroundColor = "#f8f9fa"
                    }
                >
                    <div className="content"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                        }}
                    >
                        <IoMdAddCircle
                            style={{
                                fontSize: "48px",
                                color: "#007bff",
                                marginBottom: "15px"
                            }}
                        />
                        <span
                            style={{
                                fontSize: "20px",
                                color: "#333",
                                fontWeight: "500"
                            }}
                        >Tạo playlist mới</span>
                    </div>
                </div>
            </div>

            {/* Existing Playlists */}
            {playlists.map((playlist) => (
                <div key={playlist.id} className="col-xl-3 col-md-6 mb-3">
                    <div className={`bg-soft-${playlist.color} position-relative rounded-3 card-box mb-3`}>
                        <img
                            src={playlist.image}
                            id={playlist.id}
                            className="img-fluid mx-auto d-block"
                            alt="play-img"
                        />
                        <div className="d-flex align-items-center play-list-icon">
                            <BsFillPlayFill className={`text-${playlist.color}`} size={24} />
                            <span className="ms-2 fw-semibold text-capitalize">{playlist.tracks} tracks</span>
                        </div>
                    </div>
                    <a href="music-player.html" className="text-capitalize h5">{playlist.title}</a>
                    <small className="fw-normal line-count-1 text-capitalize">{playlist.description}</small>
                </div>
            ))}

            {/* Create Playlist Dialog Component */}
            <CreatePlaylistDialog
                isOpen={showCreateDialog}
                onClose={handleCloseCreateDialog}
                onCreatePlaylist={handleCreatePlaylist}
            />
        </>
    );
};

export default PlayListOwner;