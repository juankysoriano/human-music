import { CellularAutomata1D } from '../../cellular-automata/1d/cellularAutomata1D';
import { Voice } from "./music-models";

export class ChordsGenerator {
    private tone: number

    private track = 0
    private finishedRecording = false
    private empty = []

    private opening_tonic_1 = [0, 4, 7] // Tonic
    private opening_subdominant_1 = [2, 5, 9] // SubDominant
    private opening_tonic_2 = [4, 7, 11] // Tonic
    private opening_subdominant_2 = [5, 9, 12] // SubDominant
    private opening_dominant_1 = [7, 11, 14] // Dominant
    private opening_tonic_3 = [9, 12, 16] // Tonic

    private initial = [this.opening_tonic_1, this.opening_tonic_1, this.opening_tonic_2, this.opening_tonic_3].shuffle()[0]

    private closing_tonic_1 = [...this.opening_tonic_1]
    private closing_subdominant_1 = [...this.opening_subdominant_1]
    private closing_tonic_2 = [...this.opening_tonic_2]
    private closing_subdominant_2 = [...this.opening_subdominant_2]
    private closing_dominant_1 = [...this.opening_dominant_1]
    private closing_tonic_3 = [...this.opening_tonic_3]

    private final = this.opening_tonic_1

    private record: number[][] = []
    private currentChord: number[] = this.empty
    private progressionsMap = new Map<number[], number[][]>(
        [
            [this.empty, [this.initial]],
            [this.opening_tonic_1, [this.opening_subdominant_1, this.opening_tonic_2, this.opening_subdominant_2, this.closing_dominant_1, this.opening_tonic_3].shuffle()],
            [this.opening_subdominant_1, [this.opening_subdominant_2, this.closing_dominant_1, this.closing_dominant_1].shuffle()],
            [this.opening_tonic_2, [this.opening_subdominant_2, this.opening_tonic_3].shuffle()],
            [this.opening_subdominant_2, [this.closing_subdominant_1, this.closing_dominant_1, this.closing_dominant_1, this.closing_tonic_3].shuffle()],
            [this.opening_tonic_3, [this.opening_tonic_2, this.opening_subdominant_2, this.closing_dominant_1].shuffle()],
            [this.closing_subdominant_1, [this.final, this.final, this.closing_tonic_2].shuffle()],
            [this.closing_tonic_2, [this.final, this.final, this.closing_tonic_3].shuffle()],
            [this.closing_subdominant_2, [this.final, this.final, this.closing_tonic_2].shuffle()],
            [this.closing_dominant_1, [this.final, this.closing_subdominant_2, this.closing_tonic_3].shuffle()],
            [this.closing_tonic_3, [this.final, this.final, this.closing_tonic_2, this.closing_subdominant_2].shuffle()],
        ]
    )


    private labels = new Map<number[], String>(
        [[this.opening_tonic_1, "I - start"],
        [this.opening_subdominant_1, "ii - start"],
        [this.opening_tonic_2, "iii - start"],
        [this.opening_subdominant_2, "IV - start"],
        [this.opening_dominant_1, "V - start"],
        [this.opening_tonic_3, "vi - start"],
        [this.closing_tonic_1, "I - end"],
        [this.closing_subdominant_1, "ii - end"],
        [this.closing_tonic_2, "iii - end"],
        [this.closing_subdominant_2, "IV - end"],
        [this.closing_dominant_1, "V - end"],
        [this.closing_tonic_3, "vi - end"]]
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
