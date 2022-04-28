import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D"
import { TreeNode } from "../../utils/data-structures/tree-node"
import { Chord, ChordVoice, progressions, Voice } from "./music-models"
import { mutations, Operations, operations } from "./operations"
export class ChordsGenerator {
   private tone: number
   private currentNode: TreeNode<Chord> = progressions.shuffle()
   private mutations = mutations.shuffle()
   private currentPattern: number[] = []
   private tickCount = 0
   private operations: Operations[] = operations.shuffle()
   private recordCount = 0
   private finishedRecording = false
   private record: TreeNode<Chord>[] = []
   private automata: CellularAutomata1D
   private pulsesInBeat: number

   constructor(automata: CellularAutomata1D, pulsesInBeat: number) {
      this.automata = automata
      this.tone = Math.floor(Math.random() * 13) - 6
      this.pulsesInBeat = pulsesInBeat
   }

   nextChord() {
      if (this.finishedRecording) {
         const index = this.recordCount % this.record.length
         this.currentNode = this.record[index]
         this.recordCount++
      } else {
         const index = this.automata.leeDistance() % this.currentNode.children.length
         const previousChord = this.currentNode.value
         this.currentNode = this.currentNode.children[index]
         this.currentNode.value.inversion(this.automata, previousChord)
         this.record.push(this.currentNode)
         this.finishedRecording = this.currentNode.isLeaf
      }
      console.log(`ID: ${this.currentNode.value.label} Notes: ${this.currentNode.value.notes.map((note) => note - 6)}`)
   }

   get progressionFinished(): boolean {
      const isFirstChord = (this.recordCount - 1) % this.record.length === 0
      return this.finishedRecording && isFirstChord
   }

   get patternLenght(): number {
      return this.currentPattern.length
   }

   nextNote() {
      if (this.currentPattern.length < this.pulsesInBeat) {
         const nextOperation =
            this.currentPattern.length === 0 ? Operations.NEXT : this.operations[this.automata.leeDistance() % this.operations.length]
         switch (nextOperation) {
            case Operations.NEXT:
               this.currentPattern.push(this.automata.leeDistance() % 3)
               break
            case Operations.PLUS:
               this.currentPattern = this.currentPattern.concat(this.currentPattern.map((value) => value + 1))
               break
            case Operations.MINUS:
               this.currentPattern = this.currentPattern.concat(this.currentPattern.map((value) => value - 1))
               break
            case Operations.MULTIPLY:
               this.currentPattern = this.currentPattern.concat(this.currentPattern.map((value) => value * 2))
               break
            case Operations.DIVIDE:
               this.currentPattern = this.currentPattern.concat(this.currentPattern.map((value) => Math.floor(value / 2)))
               break
            case Operations.REFLECTION:
               this.currentPattern = this.currentPattern.concat(this.currentPattern.reverse())
               break
            case Operations.REPEAT:
               this.currentPattern = this.currentPattern.concat(this.currentPattern)
               break
            case Operations.INVERSE:
               this.currentPattern = this.currentPattern.concat(this.currentPattern.map((value) => 2 - value))
               break
         }
      }

      this.currentPattern = this.currentPattern
         .map((value) => (value < 0 ? value + 3 : value))
         .map((value) => value % 3)
         .slice(0, this.pulsesInBeat)

      //console.log(this.currentPattern)

      this.tickCount++
   }

   mutatePattern() {
      if (this.automata.leeDistance() % 4 === 0 && this.currentPattern.length === this.pulsesInBeat) {
         console.log("MUTATE")
         const mutation = this.mutations[this.automata.leeDistance() % this.mutations.length]
         this.currentPattern = this.currentPattern
            .map((value, index) => value + mutation[index])
            .map((value) => (value < 0 ? value + 3 : value))
            .map((value) => value % 3)
            .slice(0, this.pulsesInBeat)
      }
   }

   noteFor = (voice: Voice) =>
      this.currentNode.value.notes[
         (this.currentPattern[(this.tickCount - 1) % this.currentPattern.length] + voice.positionInChord) % this.currentNode.value.notes.length
      ] +
      voice.octave * 12 +
      this.tone

   chordFor = (chordVoice: ChordVoice) => this.currentNode.value.notes.map((note) => note + chordVoice.octave * 12 + this.tone)
}
