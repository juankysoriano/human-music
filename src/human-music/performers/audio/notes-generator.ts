import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D";
import { TreeNode } from "../../utils/data-structures/tree-node";
import { Chord, progressions } from "./music-models/chord";
import { ChordVoice } from "./music-models/chord-voice";
import { Voice } from "./music-models/voice";
export class ChordsGenerator {
   private tone: number
   private currentNode: TreeNode<Chord> = progressions.shuffle()
   private tickCount = 0
   private recordCount = 0
   private finishedRecording = false
   private record: TreeNode<Chord>[] = []
   private automata: CellularAutomata1D
   private beatDuration: number

   constructor(automata: CellularAutomata1D, beatDuration: number) {
      this.automata = automata
      this.tone = Math.floor(Math.random() * 13)
      this.beatDuration = beatDuration
   }

   tick() {
      if (this.tickCount % this.beatDuration === 0) {
         this.nextChord()
      }

      this.tickCount++
   }

   noteFor = (voice: Voice) => {
      const noteIndex = (this.automata.leeDistance() + voice.toneOffset) % this.currentNode.value.notes.length
      const candidate = this.currentNode.value.notes[noteIndex] + voice.octave * 12 + this.tone
      if (candidate === voice.currentNote.value) {
         return this.automata.leeDistance() % 2 === 0 && noteIndex > 0
            ? this.currentNode.value.notes[(noteIndex - 1) % this.currentNode.value.notes.length] + voice.octave * 12 + this.tone
            : this.currentNode.value.notes[(noteIndex + 1) % this.currentNode.value.notes.length] + voice.octave * 12 + this.tone;
      }
      return candidate;
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
}
