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

   get rythm(): Note[] {
      return [...this.currentPattern]
   }

   get currentNote(): Note {
      const pattern = this.currentPattern
      return pattern[this.noteIndex % pattern.length]
   }

   get lastValue(): number {
      return this._currentNote.value
   }

   play(midiNote: number, attack: number) {
      if (this._currentNote.isFinished()) {
         MIDI.noteOff(this.instrument, this._currentNote.value);
         MIDI.noteOn(this.instrument, midiNote, attack);
         const pattern = this.currentPattern.flat()
         this._currentNote = pattern[this.noteIndex % pattern.length].copy({ value: midiNote });
         this.noteIndex++
      }
   }

   tick() {
      this._currentNote.tick();
   }

   stop() {
      MIDI.noteOff(this.instrument, this._currentNote.value);
      this._currentNote = new Note({ value: 0, duration: 0 });
   }
}
