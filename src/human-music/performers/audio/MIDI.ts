import * as MIDI from "midicube"

// Track audio context state for mobile browsers
let audioContextInitialized = false
let pendingStart = false

export function start() {
   // Ensure audio context is resumed (required for mobile browsers)
   if (window.MIDI?.AudioContext) {
      const ctx = window.MIDI.AudioContext
      if (ctx.state === "suspended") {
         ctx.resume().then(() => {
            console.log("AudioContext resumed successfully")
            performStart()
         }).catch(err => {
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
   const instruments = ["acoustic_guitar_nylon", "acoustic_guitar_nylon", "acoustic_guitar_nylon"]
   
   // Mobile browsers require user interaction before initializing audio
   // We load the plugin but don't auto-start
   MIDI.loadPlugin({
      soundfontUrl: "https://juankysoriano.github.io/midi-js-soundfonts/AirFont/",
      targetFormat: "mp3",
      instrument: instruments,
      onsuccess() {
         instruments.forEach((instrument, index) => {
            MIDI.programChange(index, MIDI.GM.byName[instrument].program)
         })
         
         // For mobile: ensure AudioContext is created but suspended
         // It will be resumed on first user interaction
         if (window.MIDI?.AudioContext && window.MIDI.AudioContext.state === "running") {
            // Some browsers auto-start, suspend it until user interaction
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

export const noteOn = (instrument: number, note: number, velocity: number) => {
   // Ensure audio context is running before playing
   if (window.MIDI?.AudioContext?.state === "suspended") {
      window.MIDI.AudioContext.resume()
   }
   MIDI.noteOn(instrument, note, velocity + randomNumber(-5, 5), 0.025 + randomNumber(-0.025, 0.025))
}

export const chordOn = (instrument: number, chord: number[], velocity: number) => {
   if (window.MIDI?.AudioContext?.state === "suspended") {
      window.MIDI.AudioContext.resume()
   }
   MIDI.chordOn(instrument, chord, velocity + randomNumber(-5, 5), 0.025 + randomNumber(-0.025, 0.025))
}

export const noteOff = (instrument: number, note: number) => MIDI.noteOff(instrument, note, 0.2 + randomNumber(-0.05, 0.05))

export const chordOff = (instrument: number, chord: number[]) => MIDI.chordOff(instrument, chord, 0.2 + randomNumber(-0.05, 0.05))

const randomNumber = (min: number, max: number) => Math.random() * (max - min) + min