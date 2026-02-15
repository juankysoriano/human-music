import { useEffect, useState } from "react"
import earth from "../resources/images/earth.png"
import github from "../resources/images/github.png"
import { CellularAutomata1D } from "./cellular-automata/1d/cellularAutomata1D"
import { AutomataSelector } from "./cellular-automata/automata-selector"
import * as MIDI from "./performers/audio/MIDI"
import CellularAutomataSketch from "./sketch/sketch"
import SketchProvider from "./sketch/sketch-provider"
import "./styles/human-music-style.css"

export default function HumanMusic() {
   const [started, setStarted] = useState(false)
   const [loaded, setLoaded] = useState(false)
   const [automata, setAutomata] = useState(null as unknown as CellularAutomata1D)

   const ruleSelector = new AutomataSelector()

   useEffect(() => {
      load()
   }, [])

   async function load() {
      if (!loaded) {
         MIDI.loadMidi(() => {
            setLoaded(true)
         })
      }
   }

   async function start() {
      // CRITICAL: For mobile browsers, we must resume AudioContext on user gesture
      const resumed = await MIDI.resumeAudioContext()
      if (!resumed) {
         console.warn("AudioContext could not be resumed")
         // Still try to start - some browsers may work anyway
      }
      
      MIDI.start()
      setStarted(true)
      randomiseAutomata()
   }

   async function randomiseAutomata() {
      // Ensure audio context is active before generating new music
      await MIDI.resumeAudioContext()
      
      const automata = ruleSelector.randomSelection()
      setAutomata(automata)
   }

   // Handle touch events for mobile
   const handleTouchStart = async (e: React.TouchEvent) => {
      // Prevent default to ensure our handler runs
      e.preventDefault()
      await start()
   }

   return (
      <SketchProvider.Provider value={automata}>
         <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, viewport-fit=cover" />
         <div className="HumanMusic">
            <div className="Headers">
               <img src={earth} className="EarthRadioLogo" alt="Earth" />
               <h1 className="Title">Human Music</h1>
               <h2 className="Subtitle">by Earth Radio</h2>
            </div>
            <div className="Automata">
               <div className="flip-card">
                  <div className="flip-card-inner">
                     <div className="flip-card-front">
                        {loaded ? (
                           <CellularAutomataSketch />
                        ) : (
                           <div className="Loading">
                              <p className="LoadingText">{`Loading`}</p>
                           </div>
                        )}
                     </div>
                     <div className="flip-card-back">
                        <p className="PlayingRule">{started ? `Playing rule: ${automata?.rule}` : "--"}</p>
                     </div>
                  </div>
               </div>
               <div className="Controllers" style={{ visibility: loaded ? "visible" : "hidden" }}>
                  {started ? (
                     <button 
                        className="ruleButton" 
                        onClick={randomiseAutomata}
                        onTouchEnd={(e) => { e.preventDefault(); randomiseAutomata(); }}
                     >
                        Randomise
                     </button>
                  ) : (
                     <button 
                        className="startButton" 
                        onClick={start}
                        onTouchEnd={handleTouchStart}
                     >
                        Start
                     </button>
                  )}
               </div>
            </div>
            <div className="Misc">
               <a className="GitHubLink" href="https://github.com/juankysoriano/human-music">
                  <img className="GitHubLogo" alt="GitHub" src={github} />
               </a>
               <p className="Dad">A mi padre ♥</p>
            </div>
         </div>
      </SketchProvider.Provider>
   )
}