import { Chord as CH, Note as N, Progression } from "@tonaljs/tonal";
import { CellularAutomata1D } from '../../cellular-automata/1d/cellularAutomata1D';
import { TreeNode } from '../../utils/data-structures/TreeNote';
import { Voice } from './music-models';

export class Chord {
    readonly notes: number[]
    readonly label: string

    constructor(notes: number[], label: string) {
        this.notes = notes
        this.label = label
    }
}

const _I = new Chord([0, 4, 7], "I")
const _Isus4 = new Chord([0, 5, 7], "Isus4")
const _Isus2 = new Chord([0, 2, 7], "Isus2")
const _I7 = new Chord([0, 4, 7, 10], "I7")
const _ii = new Chord([2, 5, 9], "ii")
const _ii7 = new Chord([2, 5, 9, 12], "ii7")
const _iim7 = new Chord([2, 5, 9, 12], "iim7")
const _IIM = new Chord([2, 6, 9], "IIM")
const _bIIM = new Chord([1, 5, 8], "bIIM")
const _iii = new Chord([4, 7, 11], "iii")
const _iiim7 = new Chord([4, 7, 11, 14], "iiim7")
const _bIIIM = new Chord([3, 7, 10], "bIIIM")
const _IV = new Chord([5, 9, 12], "IV")
const _IV7 = new Chord([5, 9, 12, 16], "IV7")
const _sosIVdim = new Chord([], "#IVMdim")
const _V = new Chord([7, 11, 14], "V")
const _V6 = new Chord([7, 11, 14, 16], "V6")
const _V7 = new Chord([7, 11, 14, 17], "V7")
const _V9 = new Chord([7, 11, 14, 17, 21], "V9")
const _vi = new Chord([9, 12, 16], "vi")
const _vi7 = new Chord([9, 12, 16, 19], "vi7")
const _bVIM = new Chord([8, 12, 15], "bVIM")
const _vi9 = new Chord([9, 12, 16, 19, 23], "vi9")
const _vii = new Chord([11, 14, 18], "vii")
const _bVIIM = new Chord([10, 14, 17], "bVIIM")

const _end = new Chord([-1], "end ")

console.log(Progression.fromRomanNumerals("C", ["#IVdim"])
    .map(note => CH.get(note).notes)[0]
    .map(note => N.midi(`${note}0`) as number - 12)
    .map((value, index, array) => index - 1 >= 0 && array[index - 1] >= value ? value + 12 : value)
    .map((value, index, array) => index - 1 >= 0 && array[index - 1] >= value ? value + 12 : value)
    .map((value, index, array) => index - 1 >= 0 && array[index - 1] >= value ? value + 12 : value)
    .map((value, index, array) => index - 1 >= 0 && array[index - 1] >= value ? value + 12 : value))



//private opening_I = [0, 4, 7] // Tonic
//private opening_II = [2, 5, 9] // SubDominant
//private opening_III = [4, 7, 11] // Tonic
//private opening_IV = [5, 9, 12] // SubDominant
//private opening_V = [7, 11, 14] // Dominant
//private opening_VI = [9, 12, 16] // Tonic
const empty = new TreeNode<Chord>(new Chord([0], "empty"));
const I = () => new TreeNode(_I)
const Isus4 = () => new TreeNode(_Isus4)
const Isus2 = () => new TreeNode(_Isus2)
const I7 = () => new TreeNode(_I7)
const ii = () => new TreeNode(_ii)
const ii7 = () => new TreeNode(_ii7)
const iim7 = () => new TreeNode(_iim7)
const IIM = () => new TreeNode(_IIM)
const bIIM = () => new TreeNode(_bIIM)
const iii = () => new TreeNode(_iii)
const iiim7 = () => new TreeNode(_iiim7)
const bIIIM = () => new TreeNode(_bIIIM)
const IV = () => new TreeNode(_IV)
const IV7 = () => new TreeNode(_IV7)
const sosIVdim = () => new TreeNode(_sosIVdim)
const V = () => new TreeNode(_V)
const V6 = () => new TreeNode(_V6)
const V7 = () => new TreeNode(_V7)
const V9 = () => new TreeNode(_V9)
const vi = () => new TreeNode(_vi)
const vi7 = () => new TreeNode(_vi7)
const bVIM = () => new TreeNode(_bVIM)
const vi9 = () => new TreeNode(_vi9)
const vii = () => new TreeNode(_vii)
const bVIIM = () => new TreeNode(_bVIIM)
const end = () => new TreeNode(_end)

const progression =
    empty
        .node(I()
            .node(I()
                .node(IV()
                    .node(iii())))
            .node(IIM()
                .node(iii()
                    .node(V6())))
            .node(bIIM()
                .node(I()
                    .node(iii()))
                .node(bIIIM()
                    .node(bIIM())))
            .node(iii()
                .node(IV()
                    .node(vi()))
                .node(vi()
                    .node(IV())
                    .node(Isus4())))
            .node(bIIIM()
                .node(bVIM()
                    .node(bVIIM()))
                .node(bVIIM()
                    .node(IV())))
            .node(IV()
                .node(Isus2()
                    .node(IV()))
                .node(ii()
                    .node(V()))
                .node(bIIIM()
                    .node(bVIM()))
                .node(V()
                    .node(V())
                    .node(bVIIM()))
                .node(vi()
                    .node(V()))
                .node(bVIIM()
                    .node(IV())))
            .node(V()
                .node(I()
                    .node(IV()))
                .node(IV()
                    .node(vi()))
                .node(vi()
                    .node(ii())
                    .node(iii()
                        .node(IV()
                            .node(end())
                            .node(I()
                                .node(IV()
                                    .node(V())))))
                    .node(IV())
                    .node(V()))
                .node(bVIIM()
                    .node(IV())))
            .node(vi()
                .node(I()
                    .node(IV()))
                .node(ii()
                    .node(IV())
                    .node(V()))
                .node(IV()
                    .node(V())
                    .node(iii())))
            .node(bVIM()
                .node(I()
                    .node(bIIM())))
            .node(bVIIM()
                .node(IV()
                    .node(I()))
                .node(bVIM()
                    .node(bIIM()))))
        .node(I7()
            .node(V7()
                .node(vi9()
                    .node(IV7()))))
        .node(ii()
            .node(bIIM()
                .node(I()
                    .node(bVIIM())))
            .node(IV()
                .node(V()
                    .node(V())))
            .node(V()
                .node(I()
                    .node(I())
                    .node(IV())))
            .node(bVIIM()
                .node(I())))
        .node(ii7()
            .node(V9()
                .node(I7()
                    .node(I7()))))
        .node(iim7()
            .node(V7()
                .node(iiim7()
                    .node(vi7()
                        .node(iim7()
                            .node(V7()))))))
        .node(iii()
            .node(vi()
                .node(IV()
                    .node(I()))))
        .node(bIIIM()
            .node(ii()
                .node(bIIM()
                    .node(I()))))
        .node(IV()
            .node(I()
                .node(ii()
                    .node(vi()))
                .node(iii()
                    .node(IV()))
                .node(V()
                    .node(vi())))
            .node(IV()
                .node(I()
                    .node(V())))
            .node(vi()
                .node(iii()
                    .node(I()))))
        .node(V()
            .node(I()
                .node(vi()
                    .node(V())))
            .node(IV()
                .node(vi()
                    .node(I())))
            .node(vi()
                .node(IV()
                    .node(I()))))
        .node(vi()
            .node(IV()
                .node(I()
                    .node(V())))
            .node(V()
                .node(IV()
                    .node(V()
                        .node(end())
                        .node(ii()
                            .node(V()
                                .node(I()
                                    .node(I())))))))
            .node(bVIM()
                .node(bVIIM()
                    .node(I())))
            .node(vii()
                .node(V()
                    .node(vi()
                        .node(sosIVdim()
                            .node(V()))))))
        .filter(value => value.notes.length !== 0)

export class ChordsGenerator {
    private tone: number
    private currentNode: TreeNode<Chord> = progression.shuffle()
    private track = 0
    private finishedRecording = false
    private record: TreeNode<Chord>[] = []
    private automata: CellularAutomata1D

    constructor(automata: CellularAutomata1D) {
        this.automata = automata
        this.tone = Math.floor(Math.random() * 13)
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
            if (this.currentNode.value === _end) {
                this.currentNode = this.record[0]
                this.track++
            }
        }

        console.log(`Selected: ${this.currentNode.value.label}`)
    }

    isNewProgression = () => {
        const isFirstChord = (this.track - 1) % this.record.length === 0
        return this.finishedRecording && isFirstChord
    }

    generateNote = (voice: Voice) => this.currentNode.value.notes[
        (this.automata.leeDistance() + voice.positionInChord) % this.currentNode.value.notes.length
    ] + voice.octave * 12 + this.tone
}


