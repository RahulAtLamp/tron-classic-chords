import { useEffect } from 'react';

import { GUI } from 'dat.gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import SceneInit from './lib/SceneInit';
import Piano from './lib/Piano';
import MIDISounds from 'midi-sounds-react';
import { useState, useRef } from 'react';
import Visualizer from "./art/visualizer";

function Player() {
  const [selectedInstrument, setSelectedInstrument] = useState(31);
  const p = new Piano();
  const gui = new GUI();


  let items = null;
  const midiSounds = useRef(null);
  useEffect(() => {
    const test = new SceneInit('pianoCanvas');
    test.initScene();
    test.animate();
    // midiSounds.cacheInstrument(selectedInstrument);

    test.scene.add(p.getPianoGroup());


    const fontLoader = new FontLoader();
    fontLoader.load('./fonts/Helvetica-Bold.typeface.json', (font) => {
      p.renderText(font);
    });


    test.camera.position.z = 226;
    test.camera.position.x = -40;
    test.camera.position.y = 30;

    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(test.camera.position, 'z', 100, 250);
    cameraFolder.open();

    // NOTE: UI bug caused by importing tailwind css.
    const pianoFolder = gui.addFolder('Piano');
    pianoFolder.addColor(p, 'highlightColor').name('Highlight Color');
    pianoFolder
      .add(p, 'displayText')
      .name('Display Text')
      .onChange((value) => {
        if (value) {
          p.renderText();
        } else {
          p.hideText();
        }
      });


      const createSelectItems = () => {
        if (midiSounds) {
          if (!(items)) {
            let items = {};
            for (let i = 0; i < midiSounds.current.player.loader.instrumentKeys().length; i++) {
              items[midiSounds.current.player.loader.instrumentInfo(i).title] = i;
            }
            return items;
          }
        }
      }

      // console.log(createSelectItems());
    

    var config = {
      'Select Instrument': selectedInstrument,
    };      
    pianoFolder.add( config, 'Select Instrument', createSelectItems())
    .onChange((value) => {
      if (value) {
        setSelectedInstrument(value);
        midiSounds.current.cacheInstrument(value);
      } 
    });

    pianoFolder.open();


    // NOTE: Play piano with mouse.
    // const mouse = new THREE.Vector2();
    // const raycaster = new THREE.Raycaster();
    // function onMouseDown(event) {
    //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //   raycaster.setFromCamera(mouse, test.camera);
    //   const intersects = raycaster.intersectObjects(pianoObject.children);
    //   console.log(intersects);
    //   if (intersects.length > 0) {
    //     intersects.forEach((note) =>
    //       console.log((note.object.position.z = -10))
    //     );
    //   }
    // }
  },);

  useEffect(() => {
    const test = new SceneInit('pianoCanvas');
    test.initScene();
    test.animate();
    // midiSounds.cacheInstrument(selectedInstrument);

    test.scene.add(p.getPianoGroup());


    const fontLoader = new FontLoader();
    fontLoader.load('./fonts/Helvetica-Bold.typeface.json', (font) => {
      console.log(font);
      p.renderText(font);
    });


    test.camera.position.z = 226;
    test.camera.position.x = -40;
    test.camera.position.y = 30;


    console.log(selectedInstrument);
    if (selectedInstrument) {
      midiSounds.current.selectedInstrument = selectedInstrument;
      midiSounds.current.cacheInstrument(selectedInstrument);
    }

    const onKeyDown = (event) => {
      if(event.key == 'h'){
        gui.__proto__.constructor.toggleHide();
      }
      if (event.repeat) {
        return;
      }
      p.maybePlayNote(event.key,midiSounds.current, selectedInstrument);
    };

    const onKeyUp = (event) => {
      p.maybeStopPlayingNote(event.key);
    };

    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);
    };

  }, [selectedInstrument])

  return (
    <div>
      <canvas id="pianoCanvas"></canvas>

      <div style={{display:'none'}}>
      <MIDISounds 
			ref= { midiSounds } 
			appElementName="root" 
			instruments={[selectedInstrument]} 
			/>	
      </div>
      <Visualizer />

    </div>
  );
}

export default Player