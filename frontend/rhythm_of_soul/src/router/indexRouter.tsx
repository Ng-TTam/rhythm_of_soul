
import React from 'react'
import Dashboard from '../pages/dashboard/Dashboard'
import AdminDashboard from '../pages/admin/Dashboard'
import PlayList from '../components/playlist/playlist'
import MainContent from '../components/mainContent'
import PlayListGrid from '../components/playlist/PlayListGrid'
import PlayListOwner from '../components/playlist/PlayListOwner'
import APlayList from '../components/playlist/PlayListDetail'
import Feed from '../pages/feed/Feed'
import PostTrackDetail from '../pages/feed/PostTrackDetail'
import PostPlaylistDetail from '../pages/feed/PostPlaylistDetail'
import UserProfile from '../pages/user/UserProfile'
import Feeds from '../pages/user/Feeds'
import Follows from '../pages/user/Follows'
import AlbumPage from '../components/album/AlbumPage'
import AlbumsCollectionPage from '../components/album/AlbumCollectionPage'
import AlbumMain from '../components/album/AlbumMain'
import AdminUser from '../pages/admin/AdminUser'
import ProtectedRoute from './ProtectedRoute'
export const indexRouter: any = {
    path: '/',
    element: (<Dashboard />),
    children: [
        {
            path: 'playlist',
            element: (<PlayList />),
            children: [
                { path: '', element: (<PlayListGrid />) },
                { path: 'mine', element: (<PlayListOwner />) },

            ]
        },
        {
          path: 'userProfile',
          element: <UserProfile />,
          children: [
            { path: 'feeds', element: <Feeds /> },
            { path: 'follows', element: <Follows /> },
            { path: 'songs', element: <div>Songs</div> },
            { path: 'albums', element: <div>Albums</div> },
            { path: 'playlists', element: <div>Playlists</div> },
            { index: true, element: <Feeds /> } // mặc định là feeds
          ]
        },
        { path: 'albums', element: (<AlbumMain />),
          children: [
            {path: '', element: (<AlbumsCollectionPage />) },
            {path: 'album/:ablumId', element: (<AlbumPage />) },
          ]
         },
        { path: 'feed', element: (<Feed />) },
        { path: "postTrack/:postId", element: (<PostTrackDetail />) },
        { path: "postPlaylist/:postId", element: (<PostPlaylistDetail />) },
        { path: 'aplaylist', element: <APlayList /> },
        {
          path: 'admin',
          // element: <ProtectedRoute allowedRoles={['ADMIN']} />, // Bảo vệ tất cả route con
          children: [
            // { path: '', element: <AdminDashboard /> },
            { path: 'admin-user', element: <AdminUser /> },
          ],
        },
        { path: '', element: (<MainContent />) },
    ]

}

