import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
export default function Playlist() {
    const navigate = useNavigate();
    const redirectPath = (url : string) => {
        navigate(url);
    }
    const [activeTab, setActiveTab] = useState('all');
    const handleClick = (url : string , type : string) => {
        setActiveTab(type);
        redirectPath(url);
    }
    return (
        <>
        <div className="row mb-5" style={{paddingLeft : "20px"}}>
            <div className="playlist-tabs border-secondary border-bottom">
            <h2 className="fw-bold me-4 "
            style={{
                paddingRight: "10px",
                borderRight: "1px solid #ccc",
            }}>Playlist</h2>
            </div>
            <Outlet />
        </div>
        </>
    )
}
