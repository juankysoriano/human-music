import * as MIDI from "../MIDI";
import { Chord } from './chord';

export class ChordVoice {
   private instrument: number;
   private octave: number;
   private tone: number;
   private currentChord = { index: -1, value: new Chord({ notes: [], duration: 0, label: "", scale: [] }) }
   private chords: Chord[]
   private get nextChord() {
      const index = this.currentChord.index + 1;
      return { index, value: this.chords[index % this.chords.length].copy({}) }
   }

   constructor(instrument: number, octave: number, tone: number, chords: Chord[]) {
      this.instrument = instrument;
      this.octave = octave;
      this.tone = tone;
      this.chords = chords.map(chord => chord.copy({ notes: chord.midiNotes.map(note => note + this.octave * 12 + this.tone) }));
   }

   play({ attack }: { attack: number }) {
      if (this.currentChord.value.isFinished()) {
         MIDI.chordOff(this.instrument, this.currentChord.value.midiNotes);
         this.currentChord = this.nextChord;
         MIDI.chordOn(this.instrument, this.currentChord.value.midiNotes, attack);
      }
      this.currentChord.value.tick()
   }
   changeChords = (chords: Chord[]) => this.chords = chords.map(chord => chord.copy({ notes: chord.midiNotes.map(note => note + this.octave * 12 + this.tone) }))
   stop = () => MIDI.chordOff(this.instrument, this.currentChord.value.midiNotes)
}
