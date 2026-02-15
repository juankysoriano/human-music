import * as MIDI from "midicube"

// Track audio context state for mobile browsers
let audioContextInitialized = false
let pendingStart = false

// ===== INSTRUMENTOS CLÁSICOS Y RICOS =====
export interface InstrumentSet {
   solo: string
   accompaniment: string
   bass: string
}

// Sets de instrumentos por estilo
export const classicalInstruments: InstrumentSet = {
   solo: "acoustic_grand_piano",      // Piano de cola
   accompaniment: "string_ensemble_1", // Cuerdas
   bass: "contrabass",                 // Contrabajo
}

export const cinematicInstruments: InstrumentSet = {
   solo: "violin",                     // Violín
   accompaniment: "string_ensemble_1", // Cuerdas
   bass: "cello",                      // Cello
}

export const romanticInstruments: InstrumentSet = {
   solo: "acoustic_grand_piano",
   accompaniment: "pizzicato_strings", // Pizzicato
   bass: "contrabass",
}

export const baroqueInstruments: InstrumentSet = {
   solo: "harpsichord",               // Clavecín
   accompaniment: "string_ensemble_1",
   bass: "contrabass",
}

export const jazzInstruments: InstrumentSet = {
   solo: "acoustic_grand_piano",
   accompaniment: "electric_piano_1",  // Rhodes
   bass: "acoustic_bass",
}

// Set actual (configurable)
let currentInstruments: InstrumentSet = classicalInstruments

export function setInstruments(instruments: InstrumentSet) {
   currentInstruments = instruments
}

export function getCurrentInstruments(): InstrumentSet {
   return currentInstruments
}

export function start() {
   // Ensure audio context is resumed (required for mobile browsers)
   if (window.MIDI?.AudioContext) {
      const ctx = window.MIDI.AudioContext
      if (ctx.state === "suspended") {
         ctx.resume().then(() => {
            console.log("AudioContext resumed successfully")
            performStart()
         }).catch((err: Error) => {
            console.error("Failed to resume AudioContext:", err)
         })
         return
      }
   }
   performStart()
}

function performStart() {
   MIDI.setVolume(0, 0, 0)
   MIDI.noteOn(0, 30, 0, 0)
   MIDI.noteOff(0, 30, 0)
   MIDI.setVolume(0, 127, 0)
   audioContextInitialized = true
}

declare global {
   interface Window {
      MIDI: any
   }
}

export function loadMidi(loaded: () => void) {
   window.MIDI = MIDI || {}
   
   // Cargar instrumentos ricos (piano, cuerdas, etc.)
   const instruments = [
      currentInstruments.solo,
      currentInstruments.accompaniment,
      currentInstruments.bass,
   ]
   
   MIDI.loadPlugin({
      soundfontUrl: "https://juankysoriano.github.io/midi-js-soundfonts/FluidR3_GM/",
      targetFormat: "mp3",
      instrument: instruments,
      onsuccess() {
         // Asignar instrumentos a canales
         MIDI.programChange(0, MIDI.GM.byName[currentInstruments.solo]?.program || 0)
         MIDI.programChange(1, MIDI.GM.byName[currentInstruments.accompaniment]?.program || 48)
         MIDI.programChange(2, MIDI.GM.byName[currentInstruments.bass]?.program || 43)
         
         // Volumen por canal
         MIDI.setVolume(0, 110)  // Solo
         MIDI.setVolume(1, 90)   // Acompañamiento  
         MIDI.setVolume(2, 100)  // Bajo
         
         // For mobile: ensure AudioContext is created but suspended
         if (window.MIDI?.AudioContext && window.MIDI.AudioContext.state === "running") {
            window.MIDI.AudioContext.suspend()
         }
         
         loaded()
      },
   })
}

// Helper to check if audio is ready (for UI state)
export function isAudioReady(): boolean {
   return audioContextInitialized
}

// Helper to resume audio context (call on any user interaction)
export async function resumeAudioContext(): Promise<boolean> {
   if (window.MIDI?.AudioContext) {
      const ctx = window.MIDI.AudioContext
      if (ctx.state === "suspended") {
         try {
            await ctx.resume()
            console.log("AudioContext resumed")
            return true
         } catch (err) {
            console.error("Failed to resume AudioContext:", err)
            return false
         }
      }
   }
   return true
}

// Notas con instrumentos específicos
export const noteOnSolo = (note: number, velocity: number) => {
   if (window.MIDI?.AudioContext?.state === "suspended") {
      window.MIDI.AudioContext.resume()
   }
   MIDI.noteOn(0, note, velocity + randomNumber(-3, 3), 0.02 + randomNumber(-0.02, 0.02))
}

export const noteOnAccompaniment = (note: number, velocity: number) => {
   if (window.MIDI?.AudioContext?.state === "suspended") {
      window.MIDI.AudioContext.resume()
   }
   MIDI.noteOn(1, note, velocity * 0.8 + randomNumber(-3, 3), 0.02 + randomNumber(-0.02, 0.02))
}

export const noteOnBass = (note: number, velocity: number) => {
   if (window.MIDI?.AudioContext?.state === "suspended") {
      window.MIDI.AudioContext.resume()
   }
   MIDI.noteOn(2, note, velocity * 0.9 + randomNumber(-2, 2), 0.02 + randomNumber(-0.02, 0.02))
}

// Compatibilidad hacia atrás
export const noteOn = (instrument: number, note: number, velocity: number) => {
   if (window.MIDI?.AudioContext?.state === "suspended") {
      window.MIDI.AudioContext.resume()
   }
   MIDI.noteOn(instrument, note, velocity + randomNumber(-3, 3), 0.025 + randomNumber(-0.025, 0.025))
}

export const chordOn = (instrument: number, chord: number[], velocity: number) => {
   if (window.MIDI?.AudioContext?.state === "suspended") {
      window.MIDI.AudioContext.resume()
   }
   MIDI.chordOn(instrument, chord, velocity + randomNumber(-3, 3), 0.025 + randomNumber(-0.025, 0.025))
}

export const noteOff = (instrument: number, note: number) => MIDI.noteOff(instrument, note, 0.2 + randomNumber(-0.05, 0.05))

export const chordOff = (instrument: number, chord: number[]) => MIDI.chordOff(instrument, chord, 0.2 + randomNumber(-0.05, 0.05))

const randomNumber = (min: number, max: number) => Math.random() * (max - min) + min