import React, { useState, useEffect } from "react";
import Composer from "./piano/Composer";
import ArtGenerator from "./art/ArtGenerator";
import "./player.css";
import CustomPiano from "./piano/CustomPiano";

const Player = () => {

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (notes.length > 0) {
      console.log(notes)
    }
  }, [notes])

  return (
    <div className="player">
      <div className="player-main">
        <span className="piano-label">PIANO</span>
        <div className="piano-holder">
          <div className="piano-main">
            <Composer setNotes={setNotes} />
            {/* <CustomPiano /> */}
          </div>
        </div>
      </div>
      <div>
        <ArtGenerator notes={notes} />
      </div>
    </div>
  );
};

export default Player;
