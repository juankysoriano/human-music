import * as MIDI from "midicube"

export function start() {
   MIDI.setVolume(0, 0, 0)
   MIDI.noteOn(0, 30, 0, 0)
   MIDI.noteOff(0, 30, 0)
   MIDI.setVolume(0, 127, 0)
}

declare global {
   interface Window {
      MIDI: any
   }
}

export function loadMidi(loaded: () => void) {
   window.MIDI = MIDI || {}
   const instruments = ["acoustic_grand_piano", "acoustic_grand_piano", "acoustic_grand_piano"]
   MIDI.loadPlugin({
      soundfontUrl: "https://juankysoriano.github.io/midi-js-soundfonts/AirFont/",
      targetFormat: "mp3",
      instrument: instruments,
      onsuccess() {
         instruments.forEach((instrument, index) => {
            MIDI.programChange(index, MIDI.GM.byName[instrument].program)
         })
         loaded()
      },
   })
}

export const noteOn = (instrument: number, note: number, velocity: number) => MIDI.noteOn(instrument, note, velocity + randomNumber(-5, 5), randomNumber(0, 0.015))

export const chordOn = (instrument: number, chord: number[], velocity: number) => MIDI.chordOn(instrument, chord, velocity + randomNumber(-5, 5), randomNumber(0, 0.015))

export const noteOff = (instrument: number, note: number) => MIDI.noteOff(instrument, note, 0.2 + randomNumber(-0.05, 0.05))

export const chordOff = (instrument: number, chord: number[]) => MIDI.chordOff(instrument, chord, 0.2 + randomNumber(-0.05, 0.05))

const randomNumber = (min: number, max: number) => 0
