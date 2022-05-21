import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
import { duration } from '../../../utils/extensions';
import { Note } from '../music-models/note';
import { Voice } from '../music-models/voice';

export class VoiceTransformation {
   private staticToneOffsets: number[] = [0, 1, 2].shuffle()
   private toneOffsets: number[] = [...this.staticToneOffsets]
   private staticMelodyIndexes: number[] = [0, 1, 2].shuffle()
   private melodyIndexes: number[] = [...this.staticMelodyIndexes]
   private melodies: Note[][][]
   private automata: CellularAutomata1D
   private count = 0
   private counterPointer = new CounterPointer()

   constructor(automata: CellularAutomata1D, melodies: Note[][][]) {
      this.automata = automata
      this.melodies = melodies.map(melody => this.counterPointer.counterPointOn(melody))
   }

   transform(voices: Voice[]): void {
      this.restore()
      voices.forEach(voice => {
         this.transformMelody(voice)
         this.transformTone(voice)
      })
   }

   private transformMelody(voice: Voice) {
      const index = this.automata.leeDistance() % this.melodyIndexes.length
      voice.melody = { index: this.melodyIndexes[index], notes: this.melodies[this.count % this.melodies.length][index] }
      this.melodyIndexes.splice(index, 1)
   }

   private transformTone(voice: Voice) {
      const index = this.automata.leeDistance() % this.toneOffsets.length
      voice.toneOffset = this.toneOffsets[index]
      this.toneOffsets.splice(index, 1)
   }

   mutate(voices: Voice[]): void {
      this.automata.mutate()
      voices.forEach(voice => voice.melody = {
         index: voice.melody.index,
         notes: this.melodies[this.count % this.melodies.length][voice.melody.index]
      })
      this.count++
   }

   private restore(): void {
      this.count = 0
      this.toneOffsets = [...this.staticToneOffsets]
      this.melodyIndexes = [...this.staticMelodyIndexes]
   }
}

class CounterPointer {
   counterPointOn(melodies: Note[][]): Note[][] {
      const result: Note[][] = [[]]
      melodies.sort((a, b) => b.length - a.length)
         .forEach((melody, index, array) => {
            result[index] = index === 0 ? melody : this.sync(array[index - 1], melody)
         })
      return result
   }

   private sync(faster: Note[], slower: Note[]) {
      slower.reduce((acc, note, currentIndex) => {
         let index = 0
         while (duration(faster.slice(0, index)) < acc) {
            index++
         }
         slower[currentIndex] = note.copy({ value: faster[Math.min(index, faster.length - 1)].value })
         return (acc + note.duration)
      }, 0)
      return slower
   }
}