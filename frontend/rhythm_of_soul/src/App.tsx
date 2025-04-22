import React from 'react';
import './App.css';
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { indexRouter } from './router/indexRouter';
import { authRouter } from './router/authRouter';
import UserProfile from './pages/user/UserProfile';
import AddSong from './components/songs/AddSong';
import CreateAlbum from './pages/artist/CreateAlbum';
import AdminSong from './pages/admin/AdminSong';
import AdminUser from './pages/admin/AdminUser';
function AppRouter() {
  const routes = useRoutes([
    ...authRouter,
    indexRouter
  ]);
  return routes;
}
function App() {
  
  return (
    <Router>
      <AppRouter />
    </Router>
    // <UserProfile
    //   user={{
    //     name: "Austin Robertson",
    //     position: "Web Developer",
    //     avatar: "/assets/images/dashboard/64.jpg",
    //     description: "Passionate dev",
    //     bio: "Lover of music",
    //     joined: "Feb 15, 2021",
    //     location: "United States of America",
    //     email: "austin@gmail.com",
    //     url: "https://austin.dev",
    //     contact: "(001) 4544 565 456",
    //     role: "artist",
    //   }}
    // />
  );
}

export default App;
