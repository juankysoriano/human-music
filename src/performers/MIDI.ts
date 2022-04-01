import * as MIDI from "midicube";

export function start() {
  MIDI.setVolume(0, 0, 0);
  MIDI.noteOn(0, 30, 0, 0);
  MIDI.noteOff(0, 30, 0);
  MIDI.setVolume(0, 127, 0);
}

declare global {
  interface Window { MIDI: any; }
}

export function loadMidi() {
  window.MIDI = MIDI || {};
  let instruments = [
    "acoustic_grand_piano",
    "acoustic_grand_piano",
    "acoustic_grand_piano",
  ];
  MIDI.loadPlugin({
    soundfontUrl: "https://gleitz.github.io/midi-js-soundfonts/MusyngKite/",
    targetFormat: "mp3",
    instrument: instruments,
    onsuccess: function () {
      instruments.forEach((instrument, index) => {
        MIDI.programChange(index, MIDI.GM.byName[instrument].program);
      });
    },
  });
}

export function noteOn(instrument: number, note: number, velocity: number) {
  MIDI.noteOn(instrument, note, velocity + randomNumber(-5, 5), 0);
}

export function noteOff(instrument: number, note: number) {
  MIDI.noteOff(instrument, note, 0.2 + randomNumber(-0.05, 0.05));
}

export function stopAll() {
  MIDI.stopAllNotes();
}

function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
