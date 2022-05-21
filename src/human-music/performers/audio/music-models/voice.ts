import * as MIDI from "../MIDI";
import { Note } from "./note";


export class Voice {
   private _currentNote: Note = new Note({ value: 0, duration: 0 });
   private _lastMidiNote: number = 0
   private _toneOffset: number = 0
   private instrument;
   private _melody: { index: number, notes: Note[] } = { index: 0, notes: [] }
   private _nextNoteIndex = 0;

   readonly octave: number;
   readonly attack: number;


   constructor(instrument: number, octave: number, attack: number) {
      this.instrument = instrument;
      this.octave = octave;
      this.attack = attack;
   }

   set toneOffset(value: number) {
      this._toneOffset = value
   }

   get toneOffset() {
      return this._toneOffset
   }

   set melody(value: { index: number, notes: Note[] }) {
      this._currentNote = new Note({ value: 0, duration: 0 });
      this._lastMidiNote = 0
      this._nextNoteIndex = 0
      this._melody = value
   }

   get melody() {
      return this._melody
   }

   get currentNote(): Note {
      return this._currentNote
   }

   get nextNote(): Note {
      return this._melody.notes[this._nextNoteIndex]
   }

   get isFinished(): boolean {
      return this._currentNote.isFinished()
   }

   play({ value, midiNote }: { value: number, midiNote: number }, attack: number) {
      if (this._currentNote.isFinished()) {
         MIDI.noteOff(this.instrument, this._lastMidiNote);
         MIDI.noteOn(this.instrument, midiNote, attack);
         this._currentNote = this.melody.notes[this._nextNoteIndex % this._melody.notes.length].copy({ value });
         this._lastMidiNote = midiNote
         this._nextNoteIndex++
      }
   }

   tick() {
      this._currentNote.tick();
   }

   stop() {
      MIDI.noteOff(this.instrument, this._lastMidiNote);
      this._currentNote = new Note({ value: 0, duration: 0 });
   }
}
