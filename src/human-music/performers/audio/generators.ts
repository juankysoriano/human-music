import { CellularAutomata1D } from '../../cellular-automata/1d/cellularAutomata1D';
import { TreeNode } from '../../utils/data-structures/TreeNote';
import { Chord, progressions, Voice } from './music-models';
export class ChordsGenerator {
    private tone: number
    private currentNode: TreeNode<Chord> = progressions.shuffle()
    private track = 0
    private finishedRecording = false
    private record: TreeNode<Chord>[] = []
    private automata: CellularAutomata1D

    constructor(automata: CellularAutomata1D) {
        this.automata = automata
        this.tone = Math.floor(Math.random() * 13) - 6
    }

    nextChord() {
        if (this.finishedRecording) {
            const index = this.track % this.record.length
            this.currentNode = this.record[index]
            this.track++
        } else {
            const index = this.automata.leeDistance() % this.currentNode.children.length
            this.currentNode = this.currentNode.children[index]
            this.record.push(this.currentNode)
            this.finishedRecording = this.currentNode.isLeaf
        }
        console.log(`ID: ${this.currentNode.value.label} Notes: ${this.currentNode.value.notes.map(note => note - 6)}`)
    }

    get isNewProgression(): boolean {
        const isFirstChord = (this.track - 1) % this.record.length === 0
        return (this.finishedRecording && isFirstChord)
    }

    generateNote = (voice: Voice) => {
        return this.currentNode.value.notes[
            (this.automata.leeDistance() + voice.positionInChord) % this.currentNode.value.notes.length
        ] + voice.octave * 12 + this.tone
    }
}


