
import Dashboard from '../pages/dashboard/Dashboard'
import PlayList from '../components/playlist/playlist'
import MainContent from '../components/mainContent'
import PlayListGrid from '../components/playlist/PlayListGrid'
import Feed from '../pages/feed/Feed'
import PostDetail from '../pages/feed/PostDetail'
import UserProfile from '../pages/user/UserProfile'
import Feeds from '../pages/user/Feeds'
import Follows from '../pages/user/Follows'
import AlbumsCollectionPage from '../components/album/AlbumCollectionPage'
import AlbumMain from '../components/album/AlbumMain'
import  PostSong  from '../components/songs/PostSong'
import Songs from '../components/songs/Songs'
import RankSong from '../components/ranking/RankSong'
import SearchResult from '../pages/dashboard/SearchResults'
import FollowTabs from '../pages/user/FollowTabs'
import PublicUserProfile from '../pages/user/PublicUserProfile'
import AdminUser from '../pages/admin/AdminUser'
import AssignArtist from '../pages/admin/AssignArtist'
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
            ]

        },
        {path: 'ranking', element: (<RankSong />) },
        {
          path: 'songs',
              element: (<Songs />),
          children : [
            {path: '', element: (<PostSong />) },
          ]
         },
        {
          path: 'userProfile',
          element: <UserProfile />,
          children: [
            { path: 'feeds', element: <Feeds /> },
            { path: 'user/:userId/followers', element: <FollowTabs /> },
            { path: 'songs', element: <div>Songs</div> },
            { path: 'albums', element: <div>Albums</div> },
            { path: 'playlists', element: <div>Playlists</div> },
            { index: true, element: <Feeds /> } // mặc định là feeds
          ]
        },
        {
          path: 'albums',
          element: <ProtectedRoute allowedRoles={['ROLE_ARTIST']} />,
          children: [
            {
              path: '',
              element: <AlbumMain />,
              children: [
                { path: '', element: <AlbumsCollectionPage /> }
              ]
            }
          ]
        },
        { path: 'feed', element: (<Feed />) },
        { path: "post/:postId", element: (<PostDetail />) },
        {
          path: 'admin',
          element: <ProtectedRoute allowedRoles={['ROLE_ADMIN']} />,
          children: [
            { path: 'admin-user', element: <AdminUser /> },
            { path: 'admin-assign', element: <AssignArtist /> },
          ],
        },
        { path: 'search', element: <SearchResult /> },
        {
          path: "user/:userId/followers",
          element: <FollowTabs />
        },
        {
          path: "user/:userId/following",
          element: <FollowTabs />
        },
        {
          path: 'user/:userId',
          element: <PublicUserProfile />
        },
        { path: '', element: (<MainContent />) },
    ]

}

