import * as MIDI from "../MIDI";
import { Note } from "./note";


export class Voice {
   private instrument: number
   private octave: number;
   private tone: number
   private notes: Note[] = []
   private currentNote = { index: -1, value: new Note() }
   private get nextNote() {
      const index = this.currentNote.index + 1;
      return { index, value: this.notes[index % this.notes.length].copy() }
   }

   constructor(instrument: number, octave: number, tone: number, notes: Note[]) {
      this.instrument = instrument;
      this.octave = octave;
      this.tone = tone;
      this.notes = notes.map(note => note.copy({ value: note.midiNote + this.octave * 12 + this.tone }));
   }

   play({ attack }: { attack: number }) {
      if (this.currentNote.value.isFinished()) {
         MIDI.noteOff(this.instrument, this.currentNote.value.midiNote);
         this.currentNote = this.nextNote;
         MIDI.noteOn(this.instrument, this.currentNote.value.midiNote, attack);
      }
      this.currentNote.value.tick()
   }
   changeMelody = (melody: Note[]) => this.notes = melody.map(note => note.copy({ value: note.midiNote + this.octave * 12 + this.tone }))
   stop = () => MIDI.noteOff(this.instrument, this.currentNote.value.midiNote)
}
