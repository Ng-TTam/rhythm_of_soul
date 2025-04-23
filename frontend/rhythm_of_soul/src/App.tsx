import React from 'react';
import './App.css';
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { indexRouter } from './router/indexRouter';
import { authRouter } from './router/authRouter';
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
  );
}

export default App;
