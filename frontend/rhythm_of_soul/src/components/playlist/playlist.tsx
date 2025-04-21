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
            <div className="d-flex align-items-center  pb-1" >
                <div
                className={`tab-item me-4 ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => handleClick('/playlist', 'all')}
                >
                TẤT CẢ
                </div>
                <div
                className={`tab-item ${activeTab === 'mine' ? 'active' : ''}`}
                onClick={() => handleClick('/playlist/mine', 'mine')}
                >
                CỦA TÔI
                </div>
            </div>
            </div>
            <Outlet />
        </div>
        </>
    )
}
