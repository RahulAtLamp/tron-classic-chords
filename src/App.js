import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/navbar";
import Home from "./components/home/home";
import Player from "./components/player/player";
import Explore from "./components/explore/explore";
import Streaming from "./components/stream/stream";
import Profile from "./components/profile/Profile";

const App = () => {
  return (
    <div>
      <>
        <Router>
          <NavBar />
          <div className="pages">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/player" element={<Player />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/streaming" element={<Streaming />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      </>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
