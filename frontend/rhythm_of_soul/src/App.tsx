import React from 'react';
import logo from './logo.svg';
import './App.css';
// import Error404 from './pages/errors/Error404';
// import Error500 from './pages/errors/error500';
import Maintenance from './pages/errors/Maintenance';
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUser from './pages/admin/AdminUser';
import UserProfile from './pages/user/UserProfile';
import AddSong from './components/songs/AddSong';

function App() {
  return (
    <>
      <AddSong />
    </>
  );
}

export default App;
