import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D"
import { TreeNode } from "../../utils/data-structures/TreeNote"
import { ChordsGenerator } from "./generators"
import * as MIDI from './MIDI'
import { DurationTransformation, PitchTransformation } from "./transformations"

export class Music {
    private durationTransformation: DurationTransformation
    private pitchTransformation: PitchTransformation
    private chordsGenerator: ChordsGenerator
    private beatDuration: number = 32
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
}

const root = () => new TreeNode<Chord>(new Chord([0], "root"));
export const progressions =
    root()
        .node("I".toNode()
            .node("I".toNode()
                .node("IV".toNode()
                    .node("IIIm".toNode())))
            .node("II".toNode()
                .node("IIIm".toNode()
                    .node("V6".toNode())))
            .node("bII".toNode()
                .node("I".toNode()
                    .node("IIIm".toNode()))
                .node("bIII".toNode()
                    .node("bII".toNode())))
            .node("IIIm".toNode()
                .node("IV".toNode()
                    .node("VIm".toNode()))
                .node("VIm".toNode()
                    .node("IV".toNode())
                    .node("Isus4".toNode())))
            .node("bIII".toNode()
                .node("bVI".toNode()
                    .node("bVII".toNode()))
                .node("bVII".toNode()
                    .node("IV".toNode())))
            .node("IV".toNode()
                .node("Isus2".toNode()
                    .node("IV".toNode()))
                .node("IIm".toNode()
                    .node("V".toNode()))
                .node("bIII".toNode()
                    .node("bVI".toNode()))
                .node("V".toNode()
                    .node("V".toNode())
                    .node("bVII".toNode()))
                .node("VIm".toNode()
                    .node("V".toNode()))
                .node("bVII".toNode()
                    .node("IV".toNode())))
            .node("V".toNode()
                .node("I".toNode()
                    .node("IV".toNode()))
                .node("IV".toNode()
                    .node("VIm".toNode()))
                .node("VIm".toNode()
                    .node("IIm".toNode())
                    .node("IIIm".toNode()
                        .node("IV".toNode())
                        .node("IV".toNode()
                            .node("I".toNode()
                                .node("IV".toNode()
                                    .node("V".toNode())))))
                    .node("IV".toNode())
                    .node("V".toNode()))
                .node("bVII".toNode()
                    .node("IV".toNode())))
            .node("VIm".toNode()
                .node("I".toNode()
                    .node("IV".toNode()))
                .node("IIm".toNode()
                    .node("IV".toNode())
                    .node("V".toNode()))
                .node("IV".toNode()
                    .node("V".toNode())
                    .node("IIIm".toNode())))
            .node("bVI".toNode()
                .node("I".toNode()
                    .node("bII".toNode())))
            .node("bVII".toNode()
                .node("IV".toNode()
                    .node("I".toNode()))
                .node("bVI".toNode()
                    .node("bII".toNode()))))
        .node("I7".toNode()
            .node("V7".toNode()
                .node("VIm9".toNode()
                    .node("IV7".toNode()))))
        .node("IIm".toNode()
            .node("bII".toNode()
                .node("I".toNode()
                    .node("bVII".toNode())))
            .node("IV".toNode()
                .node("V".toNode()
                    .node("V".toNode())))
            .node("V".toNode()
                .node("I".toNode()
                    .node("I".toNode())
                    .node("IV".toNode())))
            .node("bVII".toNode()
                .node("I".toNode())))
        .node("IIm7".toNode()
            .node("V7".toNode()
                .node("IIIm7".toNode()
                    .node("VIm7".toNode()
                        .node("IIm7".toNode()
                            .node("V7".toNode())))))
            .node("V9".toNode()
                .node("I7".toNode()
                    .node("I7".toNode()))))
        .node("IIIm".toNode()
            .node("VIm".toNode()
                .node("IV".toNode()
                    .node("I".toNode()))))
        .node("bIII".toNode()
            .node("IIm".toNode()
                .node("bII".toNode()
                    .node("I".toNode()))))
        .node("IV".toNode()
            .node("I".toNode()
                .node("IIm".toNode()
                    .node("VIm".toNode()))
                .node("IIIm".toNode()
                    .node("IV".toNode()))
                .node("V".toNode()
                    .node("VIm".toNode())))
            .node("IV".toNode()
                .node("I".toNode()
                    .node("V".toNode())))
            .node("VIm".toNode()
                .node("IIIm".toNode()
                    .node("I".toNode()))))
        .node("V".toNode()
            .node("I".toNode()
                .node("VIm".toNode()
                    .node("V".toNode())))
            .node("IV".toNode()
                .node("VIm".toNode()
                    .node("I".toNode())))
            .node("VIm".toNode()
                .node("IV".toNode()
                    .node("I".toNode()))))
        .node("VIm".toNode()
            .node("IV".toNode()
                .node("I".toNode()
                    .node("V".toNode())))
            .node("V".toNode()
                .node("IV".toNode()
                    .node("V".toNode())
                    .node("V".toNode()
                        .node("IIm".toNode()
                            .node("V".toNode()
                                .node("I".toNode()
                                    .node("I".toNode())))))))
            .node("bVI".toNode()
                .node("bVII".toNode()
                    .node("I".toNode())))
            .node("VIIm".toNode()
                .node("V".toNode()
                    .node("VIm".toNode()
                        .node("#IVo".toNode()
                            .node("V".toNode()))))))
        .filter(value => !value.label.startsWith('b') && value.notes.length === 3) // TODO change to allow seventh chords
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