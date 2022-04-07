import { CellularAutomata1D } from '../../cellular-automata/1d/cellularAutomata1D';
import { Voice } from "./music-models";

export class ChordsGenerator {
    private tone: number

    private track = 0
    private finishedRecording = false
    private empty = []

    private opening_first = [0, 4, 7] // Tonic
    private opening_second = [2, 5, 9] // SubDominant
    private opening_third = [4, 7, 11] // Tonic
    private opening_fourth = [5, 9, 12] // SubDominant
    private opening_fifth = [7, 11, 14] // Dominant
    private opening_sixth = [9, 12, 16] // Tonic

    private initial = [this.opening_first, this.opening_first, this.opening_third, this.opening_sixth].shuffle()[0]

    private closing_first = [...this.opening_first]
    private closing_second = [...this.opening_second]
    private closing_third = [...this.opening_third]
    private closing_fourth = [...this.opening_fourth]
    private closing_fifth = [...this.opening_fifth]
    private closing_sixth = [...this.opening_sixth]

    private final = this.opening_first

    private record: number[][] = []
    private currentChord: number[] = this.empty
    private progressionsMap = new Map<number[], number[][]>(
        [
            [this.empty, [this.initial]],
            [this.opening_first, [this.opening_second, this.opening_third, this.opening_fourth, this.closing_fifth, this.opening_sixth].shuffle()],
            [this.opening_second, [this.opening_fourth, this.closing_fifth, this.closing_fifth].shuffle()],
            [this.opening_third, [this.opening_fourth, this.opening_sixth].shuffle()],
            [this.opening_fourth, [this.closing_second, this.closing_fifth, this.closing_fifth, this.closing_sixth].shuffle()],
            [this.opening_sixth, [this.opening_third, this.opening_fourth, this.closing_fifth].shuffle()],
            [this.closing_second, [this.final, this.final, this.closing_third].shuffle()],
            [this.closing_third, [this.final, this.final, this.closing_sixth].shuffle()],
            [this.closing_fourth, [this.final, this.final, this.closing_third].shuffle()],
            [this.closing_fifth, [this.final, this.closing_fourth, this.closing_sixth].shuffle()],
            [this.closing_sixth, [this.final, this.final, this.closing_third, this.closing_fourth].shuffle()],
        ]
    )


    private labels = new Map<number[], String>(
        [[this.opening_first, "I - start"],
        [this.opening_second, "ii - start"],
        [this.opening_third, "iii - start"],
        [this.opening_fourth, "IV - start"],
        [this.opening_fifth, "V - start"],
        [this.opening_sixth, "vi - start"],
        [this.closing_first, "I - end"],
        [this.closing_second, "ii - end"],
        [this.closing_third, "iii - end"],
        [this.closing_fourth, "IV - end"],
        [this.closing_fifth, "V - end"],
        [this.closing_sixth, "vi - end"]]
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
