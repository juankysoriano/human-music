import * as MIDI from "../MIDI";
import { Note } from "./note";


export class Voice {
   private _currentNote: Note = new Note({ value: 0, duration: 0 });
   private _toneOffset: number = 0;
   private instrument;
   private currentPattern: Note[] = []

   readonly octave: number;
   readonly attack: number;

   private noteIndex = 0;

   constructor(instrument: number, octave: number, attack: number) {
      this.instrument = instrument;
      this.octave = octave;
      this.attack = attack;
   }

   get toneOffset(): number {
      return this._toneOffset
   }

   set toneOffset(value: number) {
      this._toneOffset = value
   }

   set rythm(pattern: Note[]) {
      this.currentPattern = pattern
   }

   get currentNote(): Note {
      return this._currentNote
   }

   play(midiNote: number, attack: number) {
      if (this.currentNote.isFinished()) {
         MIDI.noteOff(this.instrument, this.currentNote.value);
         MIDI.noteOn(this.instrument, midiNote, attack);
         this._currentNote = this.currentPattern[this.noteIndex % this.currentPattern.length].copy({ value: midiNote });
         this.noteIndex++
      }
   }

   tick() {
      this.currentNote.tick();
   }

   stop() {
      MIDI.noteOff(this.instrument, this.currentNote.value);
      this._currentNote = new Note({ value: 0, duration: 0 });
   }
}
