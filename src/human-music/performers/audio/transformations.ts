import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D"
import { Voice } from "./music-models"

export interface Transformation {
   mutate(voice: Voice): void
   restore(): void
}

export class DurationTransformation implements Transformation {
   private staticDurations: number[] = [1, 2, 4, 8].shuffle()
   private durations: number[] = [...this.staticDurations]
   private automata: CellularAutomata1D

   constructor(automata: CellularAutomata1D) {
      this.automata = automata
   }

   mutate(voice: Voice): void {
      const index = this.automata.leeDistance() % this.durations.length
      voice.notesDuration = this.durations[index]
      this.durations.splice(index, 1)
   }

   restore(): void {
      this.durations = [...this.staticDurations]
   }
}

export class PitchTransformation implements Transformation {
   private staticPositionsInChord: number[] = [0, +1, +2].shuffle()
   private positionsInChord: number[] = [...this.staticPositionsInChord]
   private automata: CellularAutomata1D

   constructor(automata: CellularAutomata1D) {
      this.automata = automata
   }

   mutate(voice: Voice): void {
      const index = this.automata.leeDistance() % this.positionsInChord.length
      voice.positionInChord = this.positionsInChord[index]
      this.positionsInChord.splice(index, 1)
   }

   restore(): void {
      this.positionsInChord = [...this.staticPositionsInChord]
   }
}
