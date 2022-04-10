import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D"
import { TreeNode } from "../../utils/data-structures/TreeNote"
import { ChordsGenerator } from "./generators"
import * as MIDI from './MIDI'
import { DurationTransformation, PitchTransformation } from "./transformations"

export class Music {
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

    play() {
        if (this.isNewBeat()) {
            this.chordsGenerator.nextChord()
        }

        if ((this.isNewBeat() && this.chordsGenerator.isNewProgression) || this.currentBeat === 0) {
            console.log("-----------")
            this.durationTransformation.restore()
            this.pitchTransformation.restore()

            this.voices.forEach(voice => {
                voice.stop()
                this.durationTransformation.mutate(voice)
                this.pitchTransformation.mutate(voice)
            })
        }

        this.voices.forEach(voice => {
            const attack = this.currentBeat % this.beatDuration === 0 ? 96 : 64
            voice.play(this.chordsGenerator.generateNote(voice), attack)
            voice.tick()
        })

        this.currentBeat++
    }

    private isNewBeat = () => this.currentBeat % this.beatDuration === 0

    release() {
        this.voices.forEach(voice => voice.stop())
    }
}

export class Voice {
    private currentNote: Note = new Note(0, 0)
    private instrument

    readonly octave: number
    notesDuration: number = 0
    positionInChord: number = 0

    constructor(instrument: number, octave: number) {
        this.instrument = instrument
        this.octave = octave
    }

    play(midiNote: number, attack: number) {
        if (this.currentNote.isFinished()) {
            if (this.currentNote.value !== midiNote) {
                MIDI.noteOff(this.instrument, this.currentNote.value)
                MIDI.noteOn(this.instrument, Math.max(midiNote, 0), attack)
            }
            this.currentNote = new Note(midiNote, this.notesDuration)
        }
    }

    tick() {
        this.currentNote.tick()
    }

    stop() {
        MIDI.noteOff(this.instrument, this.currentNote.value)
        this.currentNote = new Note(0, 0)
    }
}

export class Chord {
    readonly notes: number[]
    readonly label: string

    constructor(notes: number[], label: string) {
        this.notes = notes
        this.label = label
    }

    get isTriad(): boolean {
        return this.notes.length === 3
    }
}

const root = () => new TreeNode<Chord>(new Chord([0], "root"));
export const progressions =
    root()
        // ########################################################################################################################
        .add("I".node()

            .add("I".node()
                .add("IV".node()
                    .add("IIIm".node())))

            .add("II".node()
                .add("IV".node()
                    .add("V".node()))
                .add("IIIm".node()
                    .add("V6".node())))

            .add("bII".node()
                .add("I".node()
                    .add("IIIm".node()))
                .add("bIII".node()
                    .add("bII".node())))

            .add("IIIm".node()
                .add("IV".node()
                    .add("V".node())
                    .add("VIm".node()))
                .add("VIm".node()
                    .add("IV".node())
                    .add("Isus4".node())))

            .add("bIII".node()
                .add("bVI".node()
                    .add("bVII".node()))
                .add("bVII".node()
                    .add("IV".node())))

            .add("IV".node()
                .add("I".node()
                    .add("V".node())
                    .add("V".node()
                        .add("I".node())))
                .add("Isus2".node()
                    .add("IV".node()))
                .add("IIm".node()
                    .add("V".node()))
                .add("bIII".node()
                    .add("bVI".node()))
                .add("V".node())
                .add("V".node()
                    .add("IV".node())
                    .add("V".node())
                    .add("bVII".node()))
                .add("VIm".node()
                    .add("V".node()))
                .add("bVII".node()
                    .add("IV".node())))

            .add("V".node()
                .add("I".node()
                    .add("IV".node()))
                .add("IV".node()
                    .add("VIm".node()))
                .add("VIm".node()
                    .add("IIm".node())
                    .add("IIIm".node()
                        .add("IV".node())
                        .add("IV".node()
                            .add("I".node()
                                .add("IV".node()
                                    .add("V".node())))))
                    .add("IV".node())
                    .add("V".node()))
                .add("bVII".node()
                    .add("IV".node())))

            .add("VIm".node()
                .add("I".node()
                    .add("IV".node()))
                .add("IIm".node()
                    .add("IV".node())
                    .add("V".node()))
                .add("IV".node()
                    .add("V".node())
                    .add("IIIm".node())))

            .add("bVI".node()
                .add("I".node()
                    .add("bII".node())))

            .add("bVII".node()
                .add("IV".node()
                    .add("I".node()))
                .add("bVI".node()
                    .add("bII".node()))))
        // ########################################################################################################################
        .add("I7".node()
            .add("V7".node()
                .add("VIm9".node()
                    .add("IV7".node()))))
        // ########################################################################################################################
        .add("IIm".node()

            .add("bII".node()
                .add("I".node()
                    .add("bVII".node())))

            .add("IV".node()
                .add("V".node()
                    .add("V".node())))

            .add("V".node()
                .add("I".node())
                .add("I".node()
                    .add("I".node())
                    .add("IV".node())
                    .add("VIm".node())))

            .add("bVII".node()
                .add("I".node())))
        // ########################################################################################################################
        .add("IIm7".node()

            .add("V7".node()
                .add("IIIm7".node()
                    .add("VIm7".node()
                        .add("IIm7".node()
                            .add("V7".node())))))

            .add("V9".node()
                .add("I7".node()
                    .add("I7".node()))))
        // ########################################################################################################################
        .add("IIIm".node()
            .add("VIm".node()
                .add("IV".node()
                    .add("I".node()))))
        // ########################################################################################################################
        .add("bIII".node()
            .add("IIm".node()
                .add("bII".node()
                    .add("I".node()))))
        // ########################################################################################################################
        .add("IV".node()

            .add("I".node()
                .add("IIm".node()
                    .add("VIm".node()))
                .add("IIIm".node()
                    .add("IV".node()))
                .add("V".node()
                    .add("VIm".node())))

            .add("IV".node()
                .add("I".node()
                    .add("V".node())))

            .add("VIm".node()
                .add("IIIm".node()
                    .add("I".node()))))
        // ########################################################################################################################
        .add("V".node()

            .add("I".node()
                .add("VIm".node()
                    .add("V".node())))

            .add("IV".node()
                .add("VIm".node()
                    .add("I".node())))

            .add("VIm".node()
                .add("IV".node()
                    .add("I".node()))))
        // ########################################################################################################################
        .add("VIm".node()

            .add("IV".node()
                .add("I".node()
                    .add("V".node())))

            .add("V".node()
                .add("IV".node()
                    .add("V".node())
                    .add("V".node()
                        .add("IIm".node()
                            .add("V".node()
                                .add("I".node()
                                    .add("I".node())))))))

            .add("bVI".node()
                .add("bVII".node()
                    .add("I".node())))

            .add("VIIm".node()
                .add("V".node()
                    .add("VIm".node()
                        .add("#IVo".node()
                            .add("V".node()))))))
        // ########################################################################################################################
        .filter(value => value.isTriad)
        .filter(value => !value.label.startsWith('b'))
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