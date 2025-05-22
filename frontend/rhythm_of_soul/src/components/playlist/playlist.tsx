import { Outlet} from 'react-router-dom';
export default function Playlist() {
    return (
        <>
        <div className="row mb-5" style={{paddingLeft : "20px"}}>
            <div className="playlist-tabs border-secondary border-bottom">
            <h2 className="fw-bold me-4 "
            style={{
                paddingRight: "10px",
                borderRight: "1px solid #ccc",
                color : "black"
            }}>Playlist</h2>
            </div>
            <Outlet />
        </div>
        </>
    )
}
