import { CellularAutomata1D } from '../../cellular-automata/1d/cellularAutomata1D';
import { Voice } from "./music-models";

export class ChordsGenerator {
    private tone: number

    private track = 0
    private finishedRecording = false
    private empty = []

    private opening_I = [0, 3, 7] // Tonic
    private opening_II = [10, 14, 17] // SubDominant
    private opening_III = [3, 7, 10] // Tonic
    private opening_IV = [5, 8, 12] // SubDominant
    private opening_V = [7, 10, 14] // Dominant
    private opening_VI = [8, 12, 15] // Tonic

    //private opening_I = [0, 4, 7] // Tonic
    //private opening_II = [2, 5, 9] // SubDominant
    //private opening_III = [4, 7, 11] // Tonic
    //private opening_IV = [5, 9, 12] // SubDominant
    //private opening_V = [7, 11, 14] // Dominant
    //private opening_VI = [9, 12, 16] // Tonic

    private initial = [this.opening_I, this.opening_I, this.opening_III, this.opening_VI].shuffle()[0]

    private closing_I = [...this.opening_I]
    private closing_II = [...this.opening_II]
    private closing_III = [...this.opening_III]
    private closing_IV = [...this.opening_IV]
    private closing_V = [...this.opening_V]
    private closing_VI = [...this.opening_VI]

    private final = this.opening_I

    private record: number[][] = []
    private currentChord: number[] = this.empty
    private progressionsMap = new Map<number[], number[][]>(
        [
            [this.empty, [this.initial]],
            [this.opening_I, [this.opening_II, this.opening_III, this.opening_IV, this.closing_V, this.opening_VI].shuffle()],
            [this.opening_II, [this.opening_IV, this.closing_V, this.closing_V].shuffle()],
            [this.opening_III, [this.opening_IV, this.opening_VI].shuffle()],
            [this.opening_IV, [this.closing_II, this.closing_V, this.closing_V, this.closing_VI].shuffle()],
            [this.opening_VI, [this.opening_III, this.opening_IV, this.closing_V].shuffle()],
            [this.closing_II, [this.final, this.final, this.closing_III].shuffle()],
            [this.closing_III, [this.final, this.final, this.closing_VI].shuffle()],
            [this.closing_IV, [this.final, this.final, this.closing_III].shuffle()],
            [this.closing_V, [this.final, this.closing_IV, this.closing_VI].shuffle()],
            [this.closing_VI, [this.final, this.final, this.closing_III, this.closing_IV].shuffle()],
        ]
    )


    private labels = new Map<number[], String>(
        [[this.opening_I, "I - start"],
        [this.opening_II, "ii - start"],
        [this.opening_III, "iii - start"],
        [this.opening_IV, "IV - start"],
        [this.opening_V, "V - start"],
        [this.opening_VI, "vi - start"],
        [this.closing_I, "I - end"],
        [this.closing_II, "ii - end"],
        [this.closing_III, "iii - end"],
        [this.closing_IV, "IV - end"],
        [this.closing_V, "V - end"],
        [this.closing_VI, "vi - end"]]
    )

    private automata: CellularAutomata1D

    constructor(automata: CellularAutomata1D) {
        this.automata = automata
        this.tone = Math.floor(Math.random() * 13)
    }

    nextChord() {
        if (this.finishedRecording) {
            this.track = this.track % this.record.length !== 0 ? this.track : this.final === this.initial ? 1 : 0
            const index = this.track % this.record.length
            this.currentChord = this.record[index]
            this.track++
        } else {
            const candidates = this.progressionsMap.get(this.currentChord) as number[][]
            const index = this.automata.leeDistance() % candidates.length
            this.currentChord = candidates[index]
            this.record.push(this.currentChord)

            this.finishedRecording = (this.currentChord === this.final && this.record.length > 1) || this.finishedRecording
        }

        console.log(`Selected: ${this.labels.get(this.currentChord)}`)
    }

    isNewProgression = () => {
        const isFirstChord = (this.final === this.initial ? this.track : this.track - 1) % this.record.length === 0
        return this.finishedRecording && isFirstChord
    }

    generateNote = (voice: Voice) => this.currentChord[(this.automata.leeDistance() + voice.positionInChord) % this.currentChord.length] + voice.octave * 12 + this.tone
}
