import "./App.css";
import React, { createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/navbar";
import Home from "./components/home/home";
import Player from "./components/player/player";
import Explore from "./components/explore/explore";
import Streaming from "./components/stream/stream";
import Profile from "./components/profile/Profile";
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import ArtistSingle from "./components/explore/artist-single/artist-single";
import Error404 from "./components/error404/error404";
import CollectionSingle from "./components/explore/artist-single/collections/collection-single";

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

const App = () => {
  return (
    <div>
      <>
        <WagmiConfig client={client}>
          <Router>
            <NavBar />
            <div className="pages">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/player" element={<Player />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/streaming" element={<Streaming />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/artist/:id" element={<ArtistSingle />} />
                <Route path="/artist/:id/collections/:id" element={<CollectionSingle />} />
                <Route path="/*" element={<Error404 />} />
              </Routes>
            </div>
          </Router>
        </WagmiConfig>
      </>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
