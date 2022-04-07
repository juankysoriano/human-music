import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D"
import { Voice } from "./music-models"

export interface Transformation {
    mutate(voice: Voice): void
    restore(): void
}

export class DurationTransformation implements Transformation {
    private staticDurations: number[] = [4, 8, 16, 32].shuffle()
    private durations: number[] = [...this.staticDurations]
    private automata: CellularAutomata1D

    constructor(automata: CellularAutomata1D) {
        this.automata = automata
    }

    mutate(voice: Voice): void {
        let index = this.leeDistance() % this.durations.length
        voice.notesDuration = this.durations[index]
        this.durations.splice(index, 1)
    }

    restore(): void {
        this.durations = [...this.staticDurations]
    }

    private leeDistance(): number {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = this.automata.state[index] > 0 && euclideanDistance > 0 ? Math.min(euclideanDistance, this.automata.states - euclideanDistance) : 0
            return acc + leeDistance
        }, 0)
    }
}

export class PitchTransformation implements Transformation {
    private staticPositionsInChord: number[] = [0, +1, +2].shuffle()
    private positionsInChord: number[] = [...this.staticPositionsInChord]
    private automata: CellularAutomata1D

    constructor(automata: CellularAutomata1D) {
        this.automata = automata
    }

    mutate(voice: Voice): void {
        let index = this.leeDistance() % this.positionsInChord.length
        voice.positionInChord = this.positionsInChord[index]
        this.positionsInChord.splice(index, 1)
    }

    restore(): void {
        this.positionsInChord = [...this.staticPositionsInChord]
    }

    private leeDistance(): number {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = this.automata.state[index] > 0 && euclideanDistance > 0 ? Math.min(euclideanDistance, this.automata.states - euclideanDistance) : 0
            return acc + leeDistance
        }, 0)
    }
}