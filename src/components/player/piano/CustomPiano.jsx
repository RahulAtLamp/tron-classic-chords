import React, { useEffect, useState, useRef } from "react";
import Notes from "./notes";
import OBEvent from "./notes";
import "./piano-style.less";
import $ from "jquery";
import SampleLibrary from "./custom/tonejs-instruments";
// import bandImg from "../../../images/band.png";

function CustomPiano() {
  const [pianoState, setPianoState] = useState({
    DEV: false,
    pianoShow: true,
    bandImg: "./images/band.png",
    enableBlackKey: false, // 启用黑色按键
    showKeyName: true, // 显示键名
    showNoteName: false, // 显示音符名
    Notes: Notes,
    synth: null,
    keydownTimer: null,
    keyLock: false,
    lastKeyCode: '',
    lastKeyTime: 0
  });

  const PianoComponentRef = useRef();
  const audioEffectCanvasRef = useRef();

  const WHITE_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  const BLACK_KEYS = ['s', 'd', 'g', 'h', 'j']

  const keys = document.querySelectorAll('.key')
  const whiteKeys = document.querySelectorAll('.key.white')
  const blackKeys = document.querySelectorAll('.key.black')

  useEffect(() => {
    // console.log(Notes);
    // keys.forEach(key => {
    //   key.addEventListener('click', () => playNote(key))
    // })

    // document.addEventListener('keydown', e => {
    //   if (e.repeat) return
    //   const key = e.key
    //   const whiteKeyIndex = WHITE_KEYS.indexOf(key)
    //   const blackKeyIndex = BLACK_KEYS.indexOf(key)

    //   if (whiteKeyIndex > -1) playNote(whiteKeys[whiteKeyIndex])
    //   if (blackKeyIndex > -1) playNote(blackKeys[blackKeyIndex])
    // })
    initPiano();
  }, []);

  // function playNote(key) {
  //   console.log(key.dataset.note);
  //   // const noteAudio = document.getElementById(key.dataset.note)
  //   // console.log(noteAudio);
  //   // noteAudio.currentTime = 0
  //   // noteAudio.play()
  //   // key.classList.add('active')
  //   // noteAudio.addEventListener('ended', () => {
  //   //   key.classList.remove('active')
  //   // })
  // };

  const clickPianoKey = (e, keyCode) => {
    let pressedNote = getNoteByKeyCode(keyCode)
    if (pressedNote) {
      playNote(pressedNote.name)
    }
  };

  const getNoteByKeyCode = (keyCode) => {
    // 改为更高性能的写法
    let target
    let len = this.Notes.length || 0
    for (let i = 0; i < len; i++) {
      let note = Notes[i]
      if (note.keyCode == keyCode) {
        target = note
        break
      }
    }
    return target
  };

  const playNote = (notename = 'C4', duration = '1n') => {
    if (!pianoState.synth) return
    try {
      pianoState.synth.triggerAttackRelease(notename, duration);
    } catch (e) { }
  };

  // 钢琴初始化
  const initPiano = async () => {
    setTimeout(() => {
      computeEleSize()
      setPianoState(...pianoState, pianoState.pianoShow = true)
    }, 300)
    bindKeyBoradEvent()
    setListener()

    pianoState.synth = SampleLibrary.load({
      instruments: "piano"
    }).toMaster()

    // this.synth = new Tone.PolySynth( 10 ).toMaster()
  };

  const computeEleSize = () => {
    let wkey_width = $('.piano-key-wrap').width() / 36;
    let wkey_height = wkey_width * 7;
    let bkey_height = wkey_height * 0.7;
    $('.piano-key-wrap').height(wkey_height);
    $('.bkey').height(bkey_height);
  };

  const bindKeyBoradEvent = () => {
    const ShiftKeyCode = 16
    document.addEventListener('keydown', (e) => {
      let keyCode = e.keyCode;
      if (this.DEV) console.log('keydown', keyCode);
      // 按住Shfit键，则启用黑色按键
      if (keyCode == ShiftKeyCode) {
        this.enableBlackKey = true
      }
      if (this.enableBlackKey) keyCode = 'b' + keyCode

      if (keyCode == this.lastKeyCode) {
        // 连续触发同一个键时，应节流 + 延音
        if (!this.keyLock) {
          playNoteByKeyCode(keyCode)
          // 这里应该延音，解决中...
          this.lastKeyCode = keyCode
          this.keyLock = true
        }
        if (this.keydownTimer) {
          clearTimeout(this.keydownTimer)
          this.keydownTimer = null
        }
        this.keydownTimer = setTimeout(() => {
          this.keyLock = false
        }, 120)
      } else {
        playNoteByKeyCode(keyCode)
        this.lastKeyCode = keyCode
      }
    }, false)
    // document.addEventListener('keydown', debounce((e) => {
    //   let keyCode = e.keyCode;
    //   let time = +new Date()
    //   if (this.DEV) console.log('keydown', keyCode);
    //   // 按住Shfit键，则启用黑色按键
    //   if (keyCode == ShiftKeyCode) {
    //     this.enableBlackKey = true
    //   }
    //   if (this.enableBlackKey) keyCode = 'b' + keyCode
    //   this.playNoteByKeyCode(keyCode)
    //   this.lastKeyCode = keyCode
    //   this.lastKeyTime = +new Date()
    // }, 100, { leading: true, trailing: false }), false)

    document.addEventListener('keyup', (e) => {
      // console.log('keyup');
      let keyCode = e.keyCode;
      // 松开Shfit键，则禁用黑色按键
      if (keyCode == ShiftKeyCode) {
        this.enableBlackKey = false;
      }
      $(`.wkey`).removeClass('wkey-active')
      $(`.bkey`).removeClass('bkey-active')
    }, false)
  };

  const playNoteByKeyCode = (keyCode) => {
    let pressedNote = this.getNoteByKeyCode(keyCode)
    if (pressedNote) {
      this.playNote(pressedNote.name)
      let keyType = pressedNote.type;
      if (keyType == 'white') {
        $(`[data-keyCode=${pressedNote.keyCode}]`).addClass('wkey-active');
      } else if (keyType == 'black') {
        $(`[data-keyCode=${pressedNote.keyCode}]`).addClass('bkey-active');
      }
    }
  };

  const setListener = () => {
    window.onresize = computeEleSize()
    window.onorientationchange = computeEleSize()

    // 数字简谱自动播放
    // Observe = new IntersectionObserver(OBEvent.AUTO_PLAY_NUM_SCORE, (scorename) => {
    //   this.playScoreByName(scorename)
    // })
    // // XML乐谱自动播放
    // Observe = new IntersectionObserver(OBEvent.AUTO_PLAY_XML_SCORE, (musicScore) => {
    //   this.addToPlayQueue(musicScore)
    //   // try {
    //   //   this.playXMLScore(musicScore)
    //   // } catch (e) {
    //   //   console.log(e)
    //   // }
    // })
    // // MIDI 自动播放
    // Observe = new IntersectionObserver(OBEvent.AUTO_PLAY_MIDI, (midiUrl) => {
    //   this.loadMidiAndPlay(midiUrl)
    // })
    // // 暂停自动播放
    // Observe = new IntersectionObserver(OBEvent.STOP_AUTO_PLAY, (scoreItem) => {
    //   this.pauseAutoPlay(scoreItem)
    //   this.pauseXMLPlay()
    //   this.pauseXMLPlay()
    //   this.stopMidiPlay()
    // })
  }

  return (
    <>
      {/* <div className='piano'>
        {
          Notes.map((note, i) => (
            <>
              {
                note.type === "white"
                  ?
                  <div data-note={note.keyCode} key={i} className='key white' dangerouslySetInnerHTML={{__html:note.key}}></div>
                  :
                  <div data-note={note.keyCode} key={i} className='key black' dangerouslySetInnerHTML={{__html:note.key}}></div>
              }
            </>
          ))
        }
        <div data-note="C" className='key white'></div>
        <div data-note="Db" className='key black'></div>
        <div data-note="D" className='key white'></div>
        <div data-note="E" className='key black'></div>
        <div data-note="Eb" className='key white'></div>
        <div data-note="F" className='key white'></div>
        <div data-note="Gb" className='key black'></div>
        <div data-note="G" className='key white'></div>
        <div data-note="Ab" className='key black'></div>
        <div data-note="A" className='key white'></div>
        <div data-note="Bb" className='key black'></div>
        <div data-note="B" className='key white'></div>
      </div> */}

      {/*
        //   Notes.map((note,i)=>(
        //     <audio id={note.key} src={`./samples/piano/${note.keyCode}.mp3`} />    
        //   ))
        // }

        // <audio id="C" src="./samples/piano/a48.mp3" />
        // <audio id="Db" src="./samples/piano/Db.mp3" />
        // <audio id="D" src="./samples/piano/D.mp3" />
        // <audio id="E" src="./samples/piano/E.mp3" />
        // <audio id="Eb" src="./samples/piano/Eb.mp3" />
        // <audio id="F" src="./samples/piano/F.mp3" />
        // <audio id="Gb" src="./samples/piano/Gb.mp3" />
        // <audio id="G" src="./samples/piano/G.mp3" />
        // <audio id="Ab" src="./samples/piano/Ab.mp3" />
        // <audio id="A" src="./samples/piano/A.mp3" />
        // <audio id="Bb" src="./samples/piano/Bb.mp3" />
        // <audio id="B" src="./samples/piano/B.mp3" />
      */}

      {/* --------------------------------------------------------------------------------------------
      ----------------------------    Vue Player    --------------------------------------------------
      -------------------------------------------------------------------------------------------- */}

      <div className="component-autopiano" ref={PianoComponentRef}>
        <div className="piano-scroll-wrap">
          {
            pianoState.pianoShow
              ?
              <div className="piano-wrap responsive-section-a">
                <div className="piano-band">
                  <img className="piano-band-img" src={pianoState.bandImg} alt="" />
                  <div className="piano-tip">⇧ 代表 shift 键</div>
                </div>
                <div className="piano-key-wrap">
                  {
                    Notes.map((note) => (

                      note.type === 'white'
                        ?
                        <div className="piano-key wkey" key={note.keyCode} data-name="note.name" onClick={(e) => { clickPianoKey(e, note.keyCode) }}>
                          <div className="keytip">
                            {
                              pianoState.showKeyName
                                ?
                                <div className="keyname" v-show="showKeyName">{note.key}</div>
                                :
                                null
                            }
                            {
                              pianoState.showNoteName
                                ?
                                <div className="notename" v-show="showKeyName">{note.name}</div>
                                :
                                null
                            }
                          </div>
                        </div>
                        :
                        null

                    ))
                  }
                  <div className="bkey-wrap bkey-wrap1">
                    {
                      Notes.map((note) => (
                        note.type === 'black' && note.id >= 36 && note.id <= 40
                          ?
                          <div className="piano-key bkey" key={note.keyCode} onClick={(e) => { clickPianoKey(e, note.keyCode) }}>
                            <div className="keytip">
                              {
                                pianoState.showKeyName
                                  ?
                                  <div className="keyname" dangerouslySetInnerHTML={{ __html: note.key }} v-show="showKeyName"></div>
                                  :
                                  null
                              }
                            </div>
                          </div>
                          :
                          null
                      ))
                    }
                  </div>
                  <div className="bkey-wrap bkey-wrap2">
                    {
                      Notes.map((note) => (
                        note.type === 'black' && note.id >= 41 && note.id <= 45
                          ?
                          <div className="piano-key bkey" key={note.keyCode} onClick={(e) => { clickPianoKey(e, note.keyCode) }}>
                            <div className="keytip">
                              {
                                pianoState.showKeyName
                                  ?
                                  <div className="keyname" dangerouslySetInnerHTML={{ __html: note.key }}></div>
                                  :
                                  null
                              }
                            </div>
                          </div>
                          :
                          null
                      ))
                    }
                    <div className="bkey-wrap bkey-wrap3">
                      {
                        Notes.map((note) => (
                          note.type === 'black' && note.id >= 46 && note.id <= 50
                            ?
                            <div className="piano-key bkey" key={note.keyCode} onClick={(e) => { clickPianoKey(e, note.keyCode) }}>
                              <div className="keytip">
                                {
                                  pianoState.showKeyName
                                    ?
                                    <div className="keyname" dangerouslySetInnerHTML={{ __html: note.key }}></div>
                                    :
                                    null
                                }
                              </div>
                            </div>
                            :
                            null
                        ))
                      }
                    </div>
                  </div>
                  <div className="bkey-wrap bkey-wrap3">
                    {
                      Notes.map((note) => (
                        note.type == 'black' && note.id >= 46 && note.id <= 50
                          ?
                          <div className="piano-key bkey" key={note.keyCode} onClick={(e) => { clickPianoKey(e, note.keyCode) }}>
                            <div className="keytip">
                              {
                                pianoState.showKeyName
                                  ?
                                  <div className="keyname" dangerouslySetInnerHTML={{ __html: note.key }}></div>
                                  :
                                  null
                              }
                            </div>
                          </div>
                          :
                          null
                      ))
                    }
                  </div>
                  <div className="bkey-wrap bkey-wrap4">
                    {
                      Notes.map((note) => (
                        note.type == 'black' && note.id >= 51 && note.id <= 55
                          ?
                          <div className="piano-key bkey" key={note.keyCode} onClick={(e) => { clickPianoKey(e, note.keyCode) }}>
                            <div className="keytip">
                              {
                                pianoState.showKeyName
                                  ?
                                  <div className="keyname" dangerouslySetInnerHTML={{ __html: note.key }}></div>
                                  :
                                  null
                              }
                            </div>
                          </div>
                          :
                          null
                      ))
                    }
                  </div>
                  <div className="bkey-wrap bkey-wrap5">
                    {
                      Notes.map((note) => (
                        note.type == 'black' && note.id >= 56 && note.id <= 60
                          ?
                          <div className="piano-key bkey" key={note.keyCode} onClick={(e) => { clickPianoKey(e, note.keyCode) }}>
                            <div className="keytip">
                              {
                                pianoState.showKeyName
                                  ?
                                  <div className="keyname" dangerouslySetInnerHTML={{ __html: note.key }}></div>
                                  :
                                  null
                              }
                            </div>
                          </div>
                          :
                          null
                      ))
                    }
                  </div>
                </div>
              </div>
              :
              null
          }
        </div>
        <div className="piano-options responsive-section-a">

          <div className="option-item-wrap">
            <div className="option-item">
              <label className="label">
                显示按键提示
                <input type="checkbox" id="keyname" defaultValue={pianoState.showKeyName} onChange={() => { setPianoState({ ...pianoState, showKeyName: !pianoState.showKeyName }) }} />
                <i></i>
              </label>
            </div>

            <div className="option-item">
              <label className="label">
                显示音名
                <input type="checkbox" id="notename" defaultValue={pianoState.showNoteName} onChange={() => { setPianoState({ ...pianoState, showNoteName: !pianoState.showNoteName }) }} />
                <i></i>
              </label>
            </div>
          </div>
        </div>
        <canvas id="audioEffectCanvas" ref={audioEffectCanvasRef}>您的浏览器不支持<pre>Canvas</pre>。请升级到最新版的chrome、firefox、edge等浏览器。</canvas>
      </div>
    </>
  )
}

export default CustomPiano