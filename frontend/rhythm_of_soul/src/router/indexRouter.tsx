
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
          ]
         },
        { path: 'feed', element: (<Feed />) },
        { path: "post/:postId", element: (<PostDetail />) },
        { path: '', element: (<MainContent />) },
    ]

}

