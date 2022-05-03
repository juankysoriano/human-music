import * as MIDI from "../MIDI";
import { Note } from "./note";


export class Voice {
   currentNote: Note = new Note({ value: 0, duration: 0 });
   private instrument;
   private patterns: Note[][] = [[]];
   private pattern: Note[] = [];

   readonly octave: number;
   readonly attack: number;
   readonly notesDuration: number = 0;
   positionInChord: number = 0;
   private noteIndex = 0;

   constructor(instrument: number, octave: number, attack: number, patterns: Note[][]) {
      this.instrument = instrument;
      this.octave = octave;
      this.attack = attack;
      this.patterns = patterns;
   }

   play(midiNote: number, attack: number) {
      if (this.currentNote.isFinished()) {
         if (this.currentNote.value !== midiNote || !this.currentNote.allowExtension) {
            MIDI.noteOff(this.instrument, this.currentNote.value);
            MIDI.noteOn(this.instrument, midiNote, attack);
         }
         this.currentNote = this.pattern[this.noteIndex % this.pattern.length].copy({ value: midiNote });
         this.noteIndex++
      }
   }

   updateDurations(index: number) {
      this.pattern = this.patterns[index % this.patterns.length]
      this.noteIndex = 0;
   }

   tick() {
      this.currentNote.tick();
   }

   stop() {
      MIDI.noteOff(this.instrument, this.currentNote.value);
      this.currentNote = new Note({ value: 0, duration: 0 });
   }
}
