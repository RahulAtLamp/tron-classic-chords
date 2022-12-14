import { Howl } from 'howler';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export default class Key {
  constructor(note, inputKey, xOffset, soundKey) {
    this.note = note;
    this.envelopes=[];				
    this.inputKey = inputKey;
    this.isFlat = note.length === 3;
    this.midiSounds = null;
    this.soundKey = soundKey;
    this.sound = new Howl({
      src: [`./acoustic_grand_piano_mp3/${note}.mp3`],
    });

    this.theta = Math.PI / 32;
    this.axis = new THREE.Vector3(1, 0, 0);
    this.point = new THREE.Vector3(0, 20, 0);

    if (this.isFlat) {
      const geometry = new THREE.BoxGeometry(4.5, 26, 4);
      const material = new THREE.MeshBasicMaterial({ color: '#0f0f0f' });
      this.keyMesh = new THREE.Mesh(geometry, material);
      this.keyMesh.position.z = 4;
      this.keyMesh.position.y = 7;
    } else {
      const geometry = new THREE.BoxGeometry(9, 40, 4);
      const material = new THREE.MeshStandardMaterial({ color: '#ffffff' });
      this.keyMesh = new THREE.Mesh(geometry, material);
    }

    this.keyGroup = new THREE.Group();
    this.keyGroup.position.x = xOffset;
    this.keyGroup.add(this.keyMesh);
  }

  hideKeyText() {
    this.textMesh.visible = false;
  }

  renderKeyText(font) {
    if (this.textMesh) {
      this.textMesh.visible = true;
    } else {
      const geometry = new TextGeometry(this.note[0], {
        font,
        size: 4,
        height: 2,
      });
      const material = new THREE.MeshNormalMaterial();
      this.textMesh = new THREE.Mesh(geometry, material);
      this.textMesh.position.z = 2;
      this.textMesh.position.x = -1.5;
      this.textMesh.position.y = -18;
      this.keyGroup.add(this.textMesh);
    }
  }

  rotateAroundWorldAxis(rotation) {
    // remove the offset
    this.keyGroup.position.sub(this.point); 

    // rotate the POSITION
    this.keyGroup.position.applyAxisAngle(this.axis, this.theta * rotation);

    // re-add the offset
    this.keyGroup.position.add(this.point);

    // rotate the OBJECT
    this.keyGroup.rotateOnAxis(this.axis, this.theta * rotation);
  }

  keyUp(n){
		if(this.envelopes){
			if(this.envelopes[n]){
				this.envelopes[n].cancel();
				this.envelopes[n]=null;
			}
		}
	}

  keyDown(n,v){
    if(n){
      this.keyUp(n);
      var volume=1;
      if(v){
        volume=v;
      }
      this.envelopes[n]=this.midiSounds.player.queueWaveTable(this.midiSounds.audioContext
        , this.midiSounds.equalizer.input
        , window[this.midiSounds.player.loader.instrumentInfo(this.selectedInstrument).variable]
        , 0, n, 9999,volume);  
    }
	}


  play(highlightColor, midiSounds, selectedInstrument) {
    this.midiSounds = midiSounds;
    this.selectedInstrument = selectedInstrument;
    this.rotateAroundWorldAxis(1);
    this.keyDown(this.soundKey);
    // this.sound.play();
    this.keyMesh.material.color.set(highlightColor);
    // this.sound.fade(1, 0, 1000);
  }


  stopPlaying(eventKey) {
    this.keyDown(this.keyUp(this.soundKey))
    if (this.isFlat) {
      this.keyMesh.material.color.set('#000000');
    } else {
      this.keyMesh.material.color.set('#ffffff');
    }
    this.rotateAroundWorldAxis(-1);
    
  }
}
