import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D"
import { ChordsGenerator } from "./generators"
import * as MIDI from "./MIDI"
import { convertToTree, progressions_list } from "./progressions"
import { DurationTransformation, PitchTransformation } from "./transformations"

export class Music {
   private durationTransformation: DurationTransformation
   private pitchTransformation: PitchTransformation
   private chordsGenerator: ChordsGenerator
   private beatDuration: number = 32
   private currentBeat: number = 0

   readonly voices: Voice[]

   constructor(automata: CellularAutomata1D, voices: Voice[]) {
      this.voices = voices
      this.durationTransformation = new DurationTransformation(automata)
      this.pitchTransformation = new PitchTransformation(automata)
      this.chordsGenerator = new ChordsGenerator(automata)
   }

   play() {
      if (this.isNewBeat()) {
         this.chordsGenerator.nextChord()
      }

      if ((this.isNewBeat() && this.chordsGenerator.isNewProgression) || this.currentBeat === 0) {
         this.durationTransformation.restore()
         this.pitchTransformation.restore()

         this.voices.forEach((voice) => {
            voice.stop()
            this.durationTransformation.mutate(voice)
            this.pitchTransformation.mutate(voice)
         })
      }

      this.voices.forEach((voice) => {
         const attack = this.currentBeat % this.beatDuration === 0 ? 64 : 96
         voice.play(this.chordsGenerator.generateNote(voice), attack)
         voice.tick()
      })

      this.currentBeat++
   }

   private isNewBeat = () => this.currentBeat % this.beatDuration === 0

   release() {
      this.voices.forEach((voice) => voice.stop())
   }
}

export class Voice {
   private currentNote: Note = new Note(0, 0)
   private instrument

   readonly octave: number
   notesDuration: number = 0
   positionInChord: number = 0

   constructor(instrument: number, octave: number) {
      this.instrument = instrument
      this.octave = octave
   }

   play(midiNote: number, attack: number) {
      if (this.currentNote.isFinished()) {
         if (this.currentNote.value !== midiNote) {
            MIDI.noteOff(this.instrument, this.currentNote.value)
            MIDI.noteOn(this.instrument, midiNote, attack)
         }
         this.currentNote = new Note(midiNote, this.notesDuration)
      }
   }

   tick() {
      this.currentNote.tick()
   }

   stop() {
      MIDI.noteOff(this.instrument, this.currentNote.value)
      this.currentNote = new Note(0, 0)
   }
}

export class Chord {
   readonly notes: number[]
   readonly label: string

   constructor({ notes, label }: { notes: number[]; label: string }) {
      this.notes = notes
      this.label = label
   }

   get isTriad(): boolean {
      return this.notes.length === 3
   }
}
class Note {
   readonly value!: number
   duration!: number

   constructor(value: number, duration: number) {
      this.value = value
      this.duration = duration
   }

   tick = () => this.duration--

   isFinished = () => this.duration <= 0
}

export const progressions = convertToTree(progressions_list).filter((value) => value.isTriad)
//.filter(value => !value.label.startsWith('b'))
