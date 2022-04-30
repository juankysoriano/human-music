import * as MIDI from "../MIDI";
import { Note } from "./note";


export class Voice {
   private currentNote: Note = new Note(0, 0);
   private instrument;

   readonly octave: number;
   readonly attack: number;
   notesDuration: number = 0;
   positionInChord: number = 0;

   constructor(instrument: number, octave: number, attack: number) {
      this.instrument = instrument;
      this.octave = octave;
      this.attack = attack;
   }

   play(midiNote: number, attack: number) {
      if (this.currentNote.isFinished() && !isNaN(midiNote)) {
         if (this.currentNote.value !== midiNote) {
            MIDI.noteOff(this.instrument, this.currentNote.value);
            MIDI.noteOn(this.instrument, midiNote, attack);
         }
         this.currentNote = new Note(midiNote, this.notesDuration);
      }
   }

   tick() {
      this.currentNote.tick();
   }

   stop() {
      MIDI.noteOff(this.instrument, this.currentNote.value);
      this.currentNote = new Note(0, 0);
   }
}
