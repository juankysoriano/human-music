import { useEffect, useState, useCallback } from "react"
import earth from "../resources/images/earth.png"
import github from "../resources/images/github.png"
import { CellularAutomata1D } from "./cellular-automata/1d/cellularAutomata1D"
import { AutomataSelector } from "./cellular-automata/automata-selector"
import * as MIDI from "./performers/audio/MIDI"
import { 
   classicalInstruments, 
   cinematicInstruments, 
   romanticInstruments, 
   baroqueInstruments,
   setInstruments 
} from "./performers/audio/MIDI"
import { getPremiumProgressions, getClassicalProgressions } from "./performers/audio/progressions-classical"
import { euclideanRhythm, swingPresets } from "./performers/audio/rhythms"
import CellularAutomataSketch from "./sketch/sketch"
import SketchProvider from "./sketch/sketch-provider"
import "./styles/human-music-style.css"

export default function HumanMusic() {
   const [started, setStarted] = useState(false)
   const [loaded, setLoaded] = useState(false)
   const [automata, setAutomata] = useState(null as unknown as CellularAutomata1D)
   
   // Debug mode states
   const [earthClicks, setEarthClicks] = useState(0)
   const [debugMode, setDebugMode] = useState(false)
   const [debugInfo, setDebugInfo] = useState({
      currentProgression: "",
      currentInstrument: "classical",
      rhythmPattern: "",
      section: "exposition"
   })

   const ruleSelector = new AutomataSelector()

   useEffect(() => {
      load()
   }, [])
   
   // Reset earth clicks after timeout
   useEffect(() => {
      if (earthClicks > 0) {
         const timer = setTimeout(() => setEarthClicks(0), 2000)
         return () => clearTimeout(timer)
      }
   }, [earthClicks])

   async function load() {
      if (!loaded) {
         MIDI.loadMidi(() => {
            setLoaded(true)
         })
      }
   }

   async function start() {
      const resumed = await MIDI.resumeAudioContext()
      if (!resumed) {
         console.warn("AudioContext could not be resumed")
      }
      
      MIDI.start()
      setStarted(true)
      randomiseAutomata()
   }

   async function randomiseAutomata() {
      await MIDI.resumeAudioContext()
      
      const newAutomata = ruleSelector.randomSelection()
      setAutomata(newAutomata)
      
      // Update debug info
      setDebugInfo(prev => ({
         ...prev,
         currentProgression: "Random",
         section: "exposition"
      }))
   }

   // Handle earth icon clicks for debug mode
   const handleEarthClick = useCallback(() => {
      const newClicks = earthClicks + 1
      setEarthClicks(newClicks)
      
      if (newClicks >= 5) {
         setDebugMode(true)
         setEarthClicks(0)
         console.log("🔧 Debug mode activated!")
      }
   }, [earthClicks])

   // Debug functions
   const testProgression = (type: "premium" | "classical") => {
      const progressions = type === "premium" ? getPremiumProgressions() : getClassicalProgressions()
      const randomProg = progressions[Math.floor(Math.random() * progressions.length)]
      console.log(`Testing ${type} progression:`, randomProg)
      setDebugInfo(prev => ({ ...prev, currentProgression: randomProg }))
      
      // Trigger re-render with new automata
      const newAutomata = ruleSelector.randomSelection()
      setAutomata(newAutomata)
   }

   const changeInstrument = (type: "classical" | "cinematic" | "romantic" | "baroque") => {
      switch(type) {
         case "classical":
            setInstruments(classicalInstruments)
            break
         case "cinematic":
            setInstruments(cinematicInstruments)
            break
         case "romantic":
            setInstruments(romanticInstruments)
            break
         case "baroque":
            setInstruments(baroqueInstruments)
            break
      }
      
      // Reload MIDI with new instruments
      MIDI.loadMidi(() => {
         console.log(`Instruments changed to: ${type}`)
         setDebugInfo(prev => ({ ...prev, currentInstrument: type }))
      })
   }

   const testRhythm = (pulses: number, steps: number) => {
      const pattern = euclideanRhythm(pulses, steps, 0)
      const patternStr = pattern.map(p => p ? "X" : ".").join("")
      console.log(`Testing rhythm: ${pulses}/${steps} = ${patternStr}`)
      setDebugInfo(prev => ({ ...prev, rhythmPattern: `${pulses}/${steps}: ${patternStr}` }))
   }

   // Handle touch events for mobile
   const handleTouchStart = async (e: React.TouchEvent) => {
      e.preventDefault()
      await start()
   }

   return (
      <SketchProvider.Provider value={automata}>
         <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, viewport-fit=cover" />
         <div className="HumanMusic">
            <div className="Headers">
               <img 
                  src={earth} 
                  className="EarthRadioLogo" 
                  alt="Earth"
                  onClick={handleEarthClick}
                  style={{ cursor: "pointer" }}
               />
               {earthClicks > 0 && earthClicks < 5 && (
                  <span style={{ position: "absolute", top: "10px", left: "10px", color: "#666", fontSize: "12px" }}>
                     {5 - earthClicks} more...
                  </span>
               )}
               <h1 className="Title">Human Music</h1>
               <h2 className="Subtitle">by Earth Radio</h2>
            </div>
            
            {/* Debug Panel */}
            {debugMode && (
               <div style={{
                  position: "fixed",
                  top: "10px",
                  right: "10px",
                  width: "300px",
                  background: "rgba(0,0,0,0.9)",
                  color: "#0f0",
                  padding: "15px",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  zIndex: 1000,
                  maxHeight: "80vh",
                  overflowY: "auto"
               }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                     <strong>🔧 DEBUG MODE</strong>
                     <button 
                        onClick={() => setDebugMode(false)}
                        style={{ background: "#333", color: "#fff", border: "none", padding: "2px 8px", cursor: "pointer" }}
                     >
                        ✕
                     </button>
                  </div>
                  
                  {/* Current State */}
                  <div style={{ marginBottom: "15px", padding: "8px", background: "#111", borderRadius: "4px" }}>
                     <strong>Current State:</strong><br/>
                     Progression: {debugInfo.currentProgression || "N/A"}<br/>
                     Instrument: {debugInfo.currentInstrument}<br/>
                     Rhythm: {debugInfo.rhythmPattern || "N/A"}<br/>
                     Section: {debugInfo.section}
                  </div>

                  {/* Progressions */}
                  <div style={{ marginBottom: "15px" }}>
                     <strong>Test Progressions:</strong><br/>
                     <button onClick={() => testProgression("premium")} style={debugButtonStyle}>
                        🎵 Premium
                     </button>
                     <button onClick={() => testProgression("classical")} style={debugButtonStyle}>
                        🎼 Classical
                     </button>
                  </div>

                  {/* Instruments */}
                  <div style={{ marginBottom: "15px" }}>
                     <strong>Change Instruments:</strong><br/>
                     <button onClick={() => changeInstrument("classical")} style={debugButtonStyle}>
                        🎹 Classical
                     </button>
                     <button onClick={() => changeInstrument("cinematic")} style={debugButtonStyle}>
                        🎻 Cinematic
                     </button>
                     <button onClick={() => changeInstrument("romantic")} style={debugButtonStyle}>
                        💕 Romantic
                     </button>
                     <button onClick={() => changeInstrument("baroque")} style={debugButtonStyle}>
                        🏛️ Baroque
                     </button>
                  </div>

                  {/* Rhythm Tests */}
                  <div style={{ marginBottom: "15px" }}>
                     <strong>Test Rhythms:</strong><br/>
                     <button onClick={() => testRhythm(3, 8)} style={debugButtonStyle}>
                        3:8 (Tresillo)
                     </button>
                     <button onClick={() => testRhythm(5, 8)} style={debugButtonStyle}>
                        5:8 (Cinquillo)
                     </button>
                     <button onClick={() => testRhythm(3, 4)} style={debugButtonStyle}>
                        3:4 (Waltz)
                     </button>
                     <button onClick={() => testRhythm(4, 4)} style={debugButtonStyle}>
                        4:4 (Common)
                     </button>
                  </div>

                  {/* Quick Actions */}
                  <div>
                     <strong>Actions:</strong><br/>
                     <button onClick={randomiseAutomata} style={debugButtonStyle}>
                        🔄 Randomize
                     </button>
                     <button onClick={() => console.log("Current automata:", automata)} style={debugButtonStyle}>
                        📊 Log State
                     </button>
                  </div>
               </div>
            )}
            
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

const debugButtonStyle: React.CSSProperties = {
   background: "#222",
   color: "#0f0",
   border: "1px solid #0f0",
   padding: "4px 8px",
   margin: "2px",
   fontSize: "11px",
   cursor: "pointer",
   fontFamily: "monospace"
}