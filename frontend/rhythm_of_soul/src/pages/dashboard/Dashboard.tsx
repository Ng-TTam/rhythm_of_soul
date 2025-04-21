import Nav from "../../components/Nav";
import PlaybackBar from "../../components/songs/PlaybackBar";

import FloatMenu from "../../components/floatMenu/FloatMenu";
import Sidebar from "../../components/Sidebar";
import { Outlet } from 'react-router-dom';
export default function Dashboard() {
  
  return (
    <>
      {/* <div id="loading">
        <div className="loader simple-loader">
          <div className="loader-body ">
            <img
              src="assets/images/loader.gif"
              alt="loader"
              className=" img-fluid "
            />
          </div>
        </div>
      </div> */}

      <Sidebar />
      <main className="main-content">
        <Nav /> 
        <Outlet />
      </main>
      
      <PlaybackBar />
      <FloatMenu />
    </>
  );
}
