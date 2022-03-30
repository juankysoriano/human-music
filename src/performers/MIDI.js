import * as MIDI from "midicube";

export function start() {
  MIDI.setVolume(0, 0, 0);
  MIDI.noteOn(0, 30, 0, 0);
  MIDI.noteOff(0, 30, 0);
  MIDI.setVolume(0, 127, 0);
}

export function loadMidi() {
  window.MIDI = MIDI;
  MIDI.loadPlugin({
    soundfontUrl: "https://gleitz.github.io/midi-js-soundfonts/MusyngKite/",
    instrument: [
      "electric_guitar_jazz",
      "electric_guitar_clean",
      "electric_guitar_muted",
    ],
    onsuccess: function () {
      MIDI.programChange(0, MIDI.GM.byName["electric_guitar_jazz"].program);
      MIDI.programChange(1, MIDI.GM.byName["electric_guitar_clean"].program);
      MIDI.programChange(2, MIDI.GM.byName["electric_guitar_muted"].program);
    },
  });
}

export function noteOn(instrument, note) {
  MIDI.noteOn(instrument, note, 127, 0);
}

export function noteOff(instrument, note) {
  MIDI.noteOff(instrument, note, 0);
}

export function stopAll() {
  MIDI.stopAllNotes();
}
