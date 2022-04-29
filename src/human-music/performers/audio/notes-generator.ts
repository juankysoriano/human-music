import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D";
import { TreeNode } from "../../utils/data-structures/tree-node";
import { Chord, progressions } from "./music-models/chord";
import { ChordVoice } from "./music-models/chord-voice";
import { Voice } from "./music-models/voice";
import { mutations, Operations, operations } from './music-models/operations';
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
   private beatDuration: number
   private pulsesInBeat: number

   constructor(automata: CellularAutomata1D, beatDuration: number, pulsesInBeat: number) {
      this.automata = automata
      this.tone = Math.floor(Math.random() * 13) - 6
      this.beatDuration = beatDuration
      this.pulsesInBeat = pulsesInBeat
   }

   tick() {
      if (this.tickCount % this.beatDuration === 0) {
         this.nextChord()
         this.mutatePattern()
      }

      this.nextNote()

      this.tickCount++
   }

   noteFor = (voice: Voice) => {
      const patternValue = Math.abs(this.currentPattern[(this.tickCount - 1) % this.currentPattern.length])
      const noteIndex = (patternValue + voice.positionInChord) % this.currentNode.value.notes.length
      return this.currentNode.value.notes[noteIndex] + voice.octave * 12 + this.tone;
   }

   chordFor = (chordVoice: ChordVoice) => this.currentNode.value.notes.map((note) => note + chordVoice.octave * 12 + this.tone)

   get progressionFinished(): boolean {
      const isFirstChord = (this.recordCount - 1) % this.record.length === 0
      return this.finishedRecording && isFirstChord
   }

   private nextChord() {
      if (this.finishedRecording) {
         const index = this.recordCount % this.record.length
         this.currentNode = this.nodeFrom({
            candidate: this.record[index],
            previous: index === 0 ? null : this.currentNode
         })
         this.recordCount++
      } else {
         const index = this.automata.leeDistance() % this.currentNode.children.length
         this.currentNode = this.nodeFrom({
            candidate: this.currentNode.children[index],
            previous: this.currentNode
         })
         this.record.push(this.currentNode)
         this.finishedRecording = this.currentNode.isLeaf
      }
      console.log(`ID: ${this.currentNode.value.label} Notes: ${this.currentNode.value.notes}`)
   }

   private nodeFrom({ candidate, previous }: { candidate: TreeNode<Chord>; previous: TreeNode<Chord> | null }): TreeNode<Chord> {
      return new TreeNode(
         Chord.inversion({
            chord: candidate.value,
            previousChord: previous?.value,
            defaultInversion: this.automata.leeDistance() % candidate.value.notes.length
         }),
         candidate.isLeaf,
         candidate.children
      )
   }

   private nextNote() {
      if (this.currentPattern.length < this.pulsesInBeat) {
         const operation = this.currentPattern.length === 0
            ? Operations.NEXT
            : this.operations[this.automata.leeDistance() % this.operations.length]
         this.currentPattern = Operations.execute(operation, this.currentPattern, this.currentNode.value.notes, this.automata)
      }
   }

   private mutatePattern() {
      if (this.automata.leeDistance() % 7 === 0 && this.currentPattern.length === this.pulsesInBeat) {
         const mutation = this.mutations[this.automata.leeDistance() % this.mutations.length]
         this.currentPattern = this.currentPattern.map((value, index) => value + mutation[index])
      }
   }
}
