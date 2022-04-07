import { CellularAutomata1D } from "../cellular-automata"
import * as MIDI from './MIDI'
export class CellularAutomata1DPlayer {
    private music!: Music
    constructor(music: Music
    ) {
        this.music = music
    }

    async play() {
        this.music.play()
    }

    async stop() {
        this.music.release()
    }

    static Builder = class {
        private automata?: CellularAutomata1D

        private chords = [
            [[0, 4, 7], [2, 5, 9], [4, 7, 11], [5, 9, 12], [7, 11, 14], [9, 12, 16], [0, 4, 7, 11], [2, 5, 9, 12], [4, 7, 11, 14], [5, 9, 12, 16], [7, 11, 14, 17], [9, 12, 16, 19]], //mayor
            [[0, 3, 7], [2, 5, 8], [3, 7, 10], [5, 8, 12], [7, 10, 14], [8, 12, 15], [0, 3, 7, 10], [2, 5, 8, 12], [3, 7, 10, 14], [5, 8, 12, 15], [7, 10, 14, 17], [8, 12, 15, 19]],  //minor
            [[0, 3, 7], [2, 5, 9], [3, 7, 10], [5, 9, 12], [7, 10, 14], [9, 12, 15], [0, 3, 7, 10], [2, 5, 9, 12], [3, 7, 10, 14], [5, 9, 12, 15], [7, 10, 14, 17], [9, 12, 15, 19]], //doryan
            [[0, 3, 7], [1, 5, 8], [3, 7, 10], [5, 8, 12], [7, 10, 13], [8, 12, 15], [0, 3, 7, 10], [1, 5, 8, 12], [3, 7, 10, 13], [5, 8, 12, 15], [7, 10, 13, 17], [8, 12, 15, 19]],  //phygrian
            [[0, 4, 7], [2, 6, 9], [4, 7, 11], [6, 9, 12], [7, 11, 14], [9, 12, 16], [0, 4, 7, 11], [2, 6, 9, 12], [4, 7, 11, 14], [6, 9, 12, 16], [7, 11, 14, 18], [9, 12, 16, 19]], //lydian
            [[0, 4, 7], [2, 5, 9], [4, 7, 10], [5, 9, 12], [7, 10, 14], [9, 12, 16], [0, 4, 7, 10], [2, 5, 9, 12], [4, 7, 10, 14], [5, 9, 12, 16], [7, 10, 14, 17], [9, 12, 16, 19]], //mixolydian
            [[0, 3, 6], [1, 5, 8], [3, 6, 10], [5, 8, 12], [6, 10, 13], [8, 12, 15], [0, 3, 6, 10], [1, 5, 8, 12], [3, 6, 10, 13], [5, 8, 12, 15], [6, 10, 13, 17], [8, 12, 15, 18]], //locrian
            [[0, 4, 9], [2, 7, 12], [4, 9, 14], [7, 12, 16], [9, 14, 19], [0, 4, 9, 14], [2, 7, 12, 16], [4, 9, 14, 19], [7, 12, 16, 21], [9, 14, 19, 24]], //pentatonic
            [[0, 5, 10], [3, 7, 12], [5, 10, 15], [7, 12, 17], [10, 15, 19], [0, 5, 10, 15], [3, 7, 12, 17], [5, 10, 15, 19], [7, 12, 17, 22], [10, 15, 19, 24]], //minor pentatonic
            [[0, 5, 7], [3, 6, 10], [5, 7, 12], [6, 10, 15], [7, 12, 17], [0, 5, 7, 12], [3, 6, 10, 15], [5, 7, 12, 17], [6, 10, 15, 18], [7, 12, 17, 19]], //blues
            [[0, 4, 8], [1, 6, 10], [4, 8, 11], [6, 10, 12], [8, 11, 13], [10, 12, 16], [0, 4, 8, 11], [1, 6, 10, 12], [4, 8, 11, 13], [6, 10, 12, 16], [8, 11, 13, 18], [10, 12, 16, 20]], //enigmatic
            [[0, 4, 7], [1, 5, 8], [4, 7, 11], [5, 8, 12], [7, 11, 13], [8, 12, 16], [0, 4, 7, 11], [1, 5, 8, 12], [4, 7, 11, 13], [5, 8, 12, 16], [7, 11, 13, 17], [8, 12, 16, 19]], //flamenco
            [[0, 3, 7], [2, 6, 8], [3, 7, 11], [6, 8, 12], [7, 11, 14], [8, 12, 15], [11, 14, 17], [12, 15, 19], [14, 17, 20], [0, 3, 7, 11], [2, 6, 8, 12], [3, 7, 11, 14], [6, 8, 12, 15], [7, 11, 14, 17], [8, 12, 15, 19], [11, 14, 17, 20], [12, 15, 19, 23], [14, 17, 20, 24]],  //algerian
            [[0, 6, 11], [4, 7, 12], [6, 11, 16], [7, 12, 18], [0, 6, 11, 16], [4, 7, 12, 18], [6, 11, 16, 19], [7, 12, 18, 23]] //hirajoshi
        ]

        withAutomata(automata: CellularAutomata1D) {
            this.automata = automata
            return this
        }

        async build() {
            if (this.automata === null) {
                throw new Error("Must pass a cellular automata upon building")
            }

            const music = new Music(
                this.automata!,
                [new Voice(2, 5), new Voice(1, 4), new Voice(0, 3)]
            )

            return new CellularAutomata1DPlayer(music)
        }
    }
}

class Music {
    private durationTransformation: DurationTransformation
    private pitchTransformation: PitchTransformation
    private chordsGenerator: ChordsGenerator
    private beatDuration: number = 64
    private currentBeat: number = 0

    readonly voices: Voice[]

    constructor(automata: CellularAutomata1D, voices: Voice[]) {
        this.voices = voices
        this.durationTransformation = new DurationTransformation(automata)
        this.pitchTransformation = new PitchTransformation(automata)
        this.chordsGenerator = new ChordsGenerator(automata)
    }

    async play() {
        if (this.isNewBeat()) {
            this.chordsGenerator.nextChord()
        }

        if (this.isNewBeat() && this.chordsGenerator.isNewProgression() || this.currentBeat == 0) {
            this.durationTransformation.restore()
            this.pitchTransformation.restore()

            this.voices.forEach(voice => {
                voice.stop()
                this.durationTransformation.mutate(voice)
                this.pitchTransformation.mutate(voice)
            })
        }

        this.voices.forEach(voice => {
            let attack = this.currentBeat % this.beatDuration === 0 ? 96 : 64
            voice.play(this.chordsGenerator.generateNote(voice), attack)
            voice.tick()
        })

        this.currentBeat++
    }

    private isNewBeat = () => this.currentBeat % this.beatDuration === 0

    async release() {
        this.voices.forEach(voice => voice.stop())
    }
}

class Voice {
    private currentNote: Note = new Note(0, 0)
    private instrument

    readonly octave: number
    notesDuration: number = 0
    positionInChord: number = 0

    constructor(instrument: number, octave: number) {
        this.instrument = instrument
        this.octave = octave
    }

    async play(midiNote: number, attack: number) {
        if (this.currentNote.isFinished()) {
            if (this.currentNote.value !== midiNote) {
                MIDI.noteOff(this.instrument, this.currentNote.value)
                MIDI.noteOn(this.instrument, Math.max(midiNote, 0), attack)
            }
            this.currentNote = new Note(midiNote, this.notesDuration)
        }
    }

    async tick() {
        this.currentNote.tick()
    }

    async stop() {
        MIDI.noteOff(this.instrument, this.currentNote.value)
        this.currentNote = new Note(0, 0)
    }
}

interface Transformation {
    mutate(voice: Voice): void
    restore(): void
}

class DurationTransformation implements Transformation {
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

class PitchTransformation implements Transformation {
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

class ChordsGenerator {
    private tone: number

    private track = 0;
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
            this.track = this.final == this.initial && this.track % this.record.length == 0 ? 1 : 0;
            let index = this.track % this.record.length
            this.currentChord = this.record[index]
            this.track++;
        } else {
            let candidates = this.progressionsMap.get(this.currentChord) as number[][]
            let index = this.leeDistance() % candidates.length
            this.currentChord = candidates[index]
            this.record.push(this.currentChord)

            this.finishedRecording = this.currentChord === this.final && this.record.length > 0 || this.finishedRecording
        }

        console.log("Selected: " + this.labels.get(this.currentChord))
    }

    isNewProgression = () => {
        let isFirstChord = (this.final == this.initial ? this.track : this.track - 1) % this.record.length == 0
        return this.finishedRecording && isFirstChord
    }

    generateNote = (voice: Voice) => this.currentChord[(this.leeDistance() + voice.positionInChord) % this.currentChord.length] + voice.octave * 12 + this.tone

    private leeDistance(): number {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = this.automata.state[index] > 0 && euclideanDistance > 0 ? Math.min(euclideanDistance, this.automata.states - euclideanDistance) : 0
            return acc + leeDistance
        }, 0)
    }
}
class Note {
    readonly value!: number
    duration!: number

    constructor(value: number, duration: number) {
        this.value = value
        this.duration = duration
    }

    tick = () => this.duration--

    isFinished = () => this.duration <= 0
}
