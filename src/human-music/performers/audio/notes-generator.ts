import { CellularAutomata1D } from '../../cellular-automata/1d/cellularAutomata1D';
import { TreeNode } from "../../utils/data-structures/TreeNote";
import { Chord, ChordVoice, progressions, Voice } from './music-models';
import { Operations, operations, patterns } from './patterns';
export class ChordsGenerator {
   private tone: number
   private currentNode: TreeNode<Chord> = progressions.shuffle()
   private patterns = patterns.shuffle()
   private currentPattern: number[] = []
   private tickCount = 0
   private operations: Operations[] = operations.shuffle()
   private recordCount = 0
   private finishedRecording = false
   private record: TreeNode<Chord>[] = []
   private automata: CellularAutomata1D

   constructor(automata: CellularAutomata1D) {
      this.automata = automata
      this.tone = Math.floor(Math.random() * 13) - 6
   }

   nextChord() {
      if (this.finishedRecording) {
         const index = this.recordCount % this.record.length
         this.currentNode = this.record[index]
         this.recordCount++
      } else {
         const index = this.automata.leeDistance() % this.currentNode.children.length
         this.currentNode = this.currentNode.children[index]
         this.record.push(this.currentNode)
         this.finishedRecording = this.currentNode.isLeaf
      }
      console.log(`ID: ${this.currentNode.value.label} Notes: ${this.currentNode.value.notes.map((note) => note - 6)}`)
   }

   get progressionFinished(): boolean {
      const isFirstChord = (this.recordCount - 1) % this.record.length === 0
      return this.finishedRecording && isFirstChord
   }

   tick() {
      if (this.tickCount < 8) {
         const nextOperation = this.operations[this.automata.leeDistance() % this.operations.length]
         if (nextOperation === Operations.NEXT || this.currentPattern.length === 0) {
            const next = this.automata.leeDistance() % 3
            this.currentPattern.push(next)
         } else if (nextOperation === Operations.PLUS) {
            this.currentPattern = this.currentPattern.concat(this.currentPattern.map((value) => value + 1))
         } else if (nextOperation === Operations.MINUS) {
            this.currentPattern = this.currentPattern.concat(this.currentPattern.map((value) => value - 1))
         } else if (nextOperation === Operations.MULTIPLY) {
            this.currentPattern = this.currentPattern.concat(this.currentPattern.map((value) => value * 2))
         } else if (nextOperation === Operations.DIVIDE) {
            this.currentPattern = this.currentPattern.concat(this.currentPattern.map((value) => Math.floor(value / 2)))
         } else if (nextOperation === Operations.REFLECTION) {
            this.currentPattern = this.currentPattern.concat(this.currentPattern.reverse())
         } else if (nextOperation === Operations.REPEAT) {
            this.currentPattern = this.currentPattern.concat(this.currentPattern)
         } else if (nextOperation === Operations.INVERSE) {
            this.currentPattern = this.currentPattern.concat(this.currentPattern.map((value) => 2 - value))
         }
      }
      this.currentPattern = this.currentPattern.slice(0, 8)
      this.currentPattern = this.currentPattern.map(value => value < 0 ? value + 3 : value)
      this.currentPattern = this.currentPattern.map(value => value % 3)
      console.log(this.currentPattern)
      this.tickCount++
   }

   generateNote = (voice: Voice) =>
      this.currentNode.value.notes[(this.currentPattern[(this.tickCount - 1) % this.currentPattern.length] + voice.positionInChord) % this.currentNode.value.notes.length] +
      voice.octave * 12 +
      this.tone

   currentChord = (chordVoice: ChordVoice) =>
      this.currentNode.value.notes.map((note) => note + chordVoice.octave * 12 + this.tone)
}
