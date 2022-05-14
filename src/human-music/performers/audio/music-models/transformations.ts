import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
import { Note } from './note';
import { Voice } from './voice';
export interface Transformation {
   transform(voices: Voice[]): void
   restore(): void
}

enum Operations {
   NOTHING,
   REVERSE,
}
export class RythmTransformation implements Transformation {
   private staticDurations: number[] = [0, 1, 2].shuffle()
   private staticRythms: Note[][][]
   private durations: number[] = [...this.staticDurations]
   private automata: CellularAutomata1D
   private rythms: Note[][][]
   private count = 0
   private operations: Operations[] =
      [
         Operations.NOTHING,
         Operations.REVERSE,
      ].shuffle()


   constructor(automata: CellularAutomata1D, rythms: Note[][][]) {
      this.automata = automata
      this.rythms = rythms
      this.staticRythms = [...rythms]
   }

   transform(voices: Voice[]): void {
      voices.forEach(voice => {
         const index = this.automata.leeDistance() % this.durations.length
         voice.rythmIndex = this.durations[index]
         this.durations.splice(index, 1)
      })
      this.count = 0
   }

   mutate(voices: Voice[]): void {
      voices.forEach(voice => {
         voice.rythm = this.rythms[this.count % this.rythms.length][voice.rythmIndex]
      })
      this.count++
   }

   restore(): void {
      this.durations = [...this.staticDurations]
      this.rythms = [...this.staticRythms]
   }
}

export class MelodyTransformation implements Transformation {
   private staticToneOffsets: number[] = [0, 1, 2].shuffle()
   private toneOffsets: number[] = [...this.staticToneOffsets]

   private automata: CellularAutomata1D

   constructor(automata: CellularAutomata1D) {
      this.automata = automata
   }

   transform(voices: Voice[]): void {
      voices.forEach(voice => {
         const index = this.automata.leeDistance() % this.toneOffsets.length
         voice.offset = this.toneOffsets[index]
         this.toneOffsets.splice(index, 1)
      })
   }

   restore(): void {
      this.toneOffsets = [...this.staticToneOffsets]
   }
}
