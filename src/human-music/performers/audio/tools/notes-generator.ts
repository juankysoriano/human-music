import { CellularAutomata1D } from "../../../cellular-automata/1d/cellularAutomata1D";
import { Chord } from "../music-models/chord";
import { ChordVoice } from "../music-models/chord-voice";
import { Voice } from "../music-models/voice";
import { ProgressionGenerator } from './progressions-generator';

export class ChordsGenerator {
   private tone: number
   private currentChord: Chord
   private chordCount = 0
   private tickCount = 0;
   private automata: CellularAutomata1D
   private beatDuration: number
   private chords: Chord[]

   constructor(automata: CellularAutomata1D, beatDuration: number) {
      this.automata = automata
      this.tone = Math.floor(Math.random() * 13)
      this.beatDuration = beatDuration
      this.chords = new ProgressionGenerator(automata).generateChordsProgression().chords
      this.currentChord = this.chords[0]
   }

   tick() {
      if (this.tickCount % this.beatDuration === 0) {
         this.nextChord()
         this.chordCount++
      }

      this.tickCount++
   }

   noteFor = (voice: Voice) => {
      const noteIndex = this.noteIndex(voice)
      const candidate = this.chordNotes[(noteIndex + voice.toneOffset) % this.chordNotes.length] + voice.octave * 12 + this.tone
      console.log(candidate % 12)
      return { value: noteIndex, midiNote: candidate }
   }

   private get chordNotes() {
      return this.currentChord.notes
   }

   private noteIndex = (voice: Voice) => {
      const noteIndex = voice.currentNote.value + voice.nextNote.value
      return (noteIndex < 0 ? this.chordNotes.length + noteIndex : noteIndex) % this.chordNotes.length
   }

   chordFor = (chordVoice: ChordVoice) => this.currentChord.notes.map((note) => note + chordVoice.octave * 12 + this.tone)

   get progressionFinished(): boolean {
      return this.chordCount % this.chords.length === 1
   }

   private nextChord() {
      const candidate = this.chords[this.chordCount % this.chords.length]
      this.currentChord = Chord.inversion({
         chord: candidate,
         previousChord: this.currentChord,
         defaultInversion: this.automata.leeDistance() % candidate.notes.length
      })
      console.log(`ID: ${this.currentChord.label} Notes: ${this.currentChord.notes}`)
   }
}
