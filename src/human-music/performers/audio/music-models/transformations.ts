import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
import { Note } from './note';
import { Voice } from './voice';
export interface Transformation {
   transform(voice: Voice): void
   restore(): void
}

enum Operations {
   NOTHING,
   REVERSE,
}
export class RythmTransformation implements Transformation {
   private staticDurations: number[] = [0, 1, 2].shuffle()
   private staticRythms: Note[][]
   private durations: number[] = [...this.staticDurations]
   private automata: CellularAutomata1D
   private rythms: Note[][]
   private operations: Operations[] =
      [
         Operations.NOTHING,
         Operations.REVERSE,
      ].shuffle()
   private backup = new Map<Voice, Note[]>()


   constructor(automata: CellularAutomata1D, rythms: Note[][]) {
      this.automata = automata
      this.rythms = rythms
      this.staticRythms = [...rythms]
   }

   transform(voice: Voice): void {
      const index = this.automata.leeDistance() % this.durations.length
      voice.rythm = this.rythms[this.durations[index]]
      this.backup.set(voice, voice.rythm)
      this.durations.splice(index, 1)
   }

   mutate(voices: Voice[]): void {
      const operation = this.operations[this.automata.leeDistance() % this.operations.length]
      switch (operation) {
         case Operations.NOTHING: break;
         case Operations.REVERSE: voices.forEach(voice => voice.rythm = voice.rythm.reverse()); break;
      }
   }

   restore(): void {
      this.durations = [...this.staticDurations]
      this.rythms = [...this.staticRythms]
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
