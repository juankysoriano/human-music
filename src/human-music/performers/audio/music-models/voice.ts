import * as MIDI from "../MIDI";
import { Note } from "./note";


export class Voice {
   private _currentNote: Note = new Note({ value: 0, duration: 0 });
   private instrument;
   private currentRythm: Note[] = []
   private _lastValue: number = 0
   offset: number = 0
   rythmIndex: number = 0;

   readonly octave: number;
   readonly attack: number;

   noteIndex = 0;

   constructor(instrument: number, octave: number, attack: number) {
      this.instrument = instrument;
      this.octave = octave;
      this.attack = attack;
   }

   set rythm(rythm: Note[]) {
      this._lastValue = 0
      this.currentRythm = rythm
   }

   get rythm(): Note[] {
      return [...this.currentRythm]
   }

   get currentNote(): Note {
      const pattern = this.currentRythm
      return pattern[this.noteIndex % pattern.length]
   }

   get lastValue(): number {
      return this._lastValue
   }

   get isFinished(): boolean {
      return this._currentNote.isFinished()
   }

   play(midiNote: number[], attack: number) {
      if (this._currentNote.isFinished()) {
         MIDI.noteOff(this.instrument, this._currentNote.value);
         MIDI.noteOn(this.instrument, midiNote[0], attack);
         const rythm = this.currentRythm
         this._currentNote = rythm[this.noteIndex % rythm.length].copy({ value: midiNote[0] });
         this._lastValue = midiNote[1]
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
