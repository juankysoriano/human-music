import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
import { Note } from './note';
import { Voice } from './voice';
export interface Transformation {
   transform(voice: Voice): void
   restore(): void
}

export class RythmTransformation implements Transformation {
   private staticDurations: number[] = [0, 1, 2].shuffle()
   private durations: number[] = [...this.staticDurations]
   private automata: CellularAutomata1D
   private rythms: Note[][]

   constructor(automata: CellularAutomata1D, rythms: Note[][]) {
      this.automata = automata
      this.rythms = rythms
   }

   transform(voice: Voice): void {
      const index = this.automata.leeDistance() % this.durations.length
      voice.rythm = this.rythms[this.durations[index]]
      this.durations.splice(index, 1)
   }

   mutate(): void {
      this.rythms = this.rythms.map(rythm => rythm.reverse())
   }

   restore(): void {
      this.durations = [...this.staticDurations]
   }
}

export class PitchTransformation implements Transformation {
   private staticToneOffsets: number[] = [0, 1, 2].shuffle()
   private toneOffsets: number[] = [...this.staticToneOffsets]
   private automata: CellularAutomata1D

   constructor(automata: CellularAutomata1D) {
      this.automata = automata
   }

   transform(voice: Voice): void {
      const index = this.automata.leeDistance() % this.toneOffsets.length
      voice.toneOffset = this.toneOffsets[index]
      this.toneOffsets.splice(index, 1)
   }

   restore(): void {
      this.toneOffsets = [...this.staticToneOffsets]
   }
}
