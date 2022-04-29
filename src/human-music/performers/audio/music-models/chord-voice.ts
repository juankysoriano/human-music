import * as MIDI from "../MIDI";


export class ChordVoice {
   readonly octave: number;
   readonly attack: number;
   private instrument: number;
   private currentChord: number[] = [];

   constructor(instrument: number, octave: number, attack: number) {
      this.instrument = instrument;
      this.octave = octave;
      this.attack = attack;
   }

   play(chord: number[], attack: number) {
      MIDI.chordOff(this.instrument, this.currentChord);
      MIDI.chordOn(this.instrument, chord, attack);
      this.currentChord = chord;
   }

   stop() {
      MIDI.chordOff(this.instrument, this.currentChord);
   }
}
