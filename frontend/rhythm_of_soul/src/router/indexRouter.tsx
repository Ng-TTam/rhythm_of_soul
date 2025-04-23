
    import React from 'react'
    import Dashboard from '../pages/dashboard/Dashboard'
    import PlayList from '../components/playlist/playlist'
    import MainContent from '../components/mainContent'
    import PlayListGrid from '../components/playlist/PlayListGrid'
    import PlayListOwner from '../components/playlist/PlayListOwner'
    import APlayList  from '../components/playlist/PlayListDetail'
    import Feed from '../pages/feed/Feed'
    import PostTrackDetail from '../pages/feed/PostTrackDetail'
    import PostPlaylistDetail from '../pages/feed/PostPlaylistDetail'
    import UserProfile from '../pages/user/UserProfile'
    export const indexRouter : any = {
        path:'/',
        element : (<Dashboard />),
        children :[
                {path : 'playlist',
                element : (<PlayList />),
                children : [
                    {path : '',element : (<PlayListGrid />)},
                    {path : 'mine',element : (<PlayListOwner />)},
                    
                ]
            
            },
            {path : 'userProfile/:id',element : (<UserProfile />)},
            {path : 'feed',element : (<Feed />)},
            {path: "postTrack/:postId", element:(<PostTrackDetail />)},
            {path: "postPlaylist/:postId", element:(<PostPlaylistDetail />)},
            {path : 'aplaylist', element :<APlayList />},
            {path : '',element : (<MainContent />)},
        ]

    }

