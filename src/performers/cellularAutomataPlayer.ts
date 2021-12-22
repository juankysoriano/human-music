import * as Tone from 'tone'
import { CellularAutomata1D } from "../cellular-automata";
import { Chord } from "@tonaljs/tonal";

const NOTE_DURATION = 40;

export class CellularAutomata1DPlayer {
    private note = "";
    private lastNote = "";
    private voice = "";
    private lastVoice = "";
    private notes = [
        "C4", "D4",
        "C4", "D4", "E4",
        "C4", "D4", "E4", "F4",
        "C4", "D4", "E4", "F4", "G4",
        "C4", "D4", "E4", "F4", "G4", "A4", "B4"
    ]
    private voices = [
        "C5", "D5",
        "C5", "D5", "E5", "F5",
        "C5", "D5", "E5", "F5", "G5", "A5", "B5"
    ]
    private chords = [
        "C2major", "C2maj7",
        "D2m", "D2m7",
        "E2m", "E2m7",
        "F2maj7",
        "A2m", "A2m7",
        "B2m7b5",
        "C3major", "C3maj7",
        "D3m", "D3m7",
        "E3m", "E3m7",
        "F3maj7",
        "A3m", "A3m7",
        "B3m7b5"
    ];
    private instrument: Tone.Sampler;
    private automata: CellularAutomata1D;
    private offset = 0;
    private chordsDistance = 8;
    private voicesDistance = 4;
    private noteDistance = 1;
    private step = 0;

    constructor(instrument: Tone.Sampler, automata: CellularAutomata1D, offset: number) {
        this.instrument = instrument;
        this.automata = automata;
        this.offset = offset;
    }

    play() {
        this.playNote();
        this.playVoice();
        this.playChord();

        this.step++;
    }

    private playNote() {
        let targetIndex = this.leeDistance(1) % (this.notes.length * 2);
        let actualIndex = targetIndex >= this.notes.length ? this.notes.length - (targetIndex % this.notes.length) - 1 : targetIndex;
        this.note = this.notes[actualIndex % this.notes.length];

        if (this.step % this.noteDistance == 0 && this.note != this.lastNote) {
            let midiNote = Tone.Frequency(this.note).transpose(this.offset).toFrequency();
            this.instrument.triggerAttackRelease(midiNote, NOTE_DURATION, undefined, 0.15);
        }

        this.lastNote = this.note;
    }

    private playVoice() {
        let targetIndex = this.leeDistance(2) % (this.voices.length * 2);
        let actualIndex = targetIndex >= this.voices.length ? this.voices.length - (targetIndex % this.voices.length) - 1 : targetIndex;
        this.voice = this.voices[actualIndex % this.voices.length];

        if (this.step % this.voicesDistance == 0 && this.automata.states == 3 && this.voice != this.lastVoice) {
            let midiNote = Tone.Frequency(this.voice).transpose(this.offset).toFrequency();
            this.instrument.triggerAttackRelease(midiNote, NOTE_DURATION, undefined, 0.2);
        }

        this.lastVoice = this.voice;
    }

    private playChord() {
        let targetIndex = this.leeDistance(0) % (this.chords.length * 2);
        let actualIndex = targetIndex >= this.chords.length ? this.chords.length - (targetIndex % this.chords.length) - 1 : targetIndex;
        let chord = this.chords[actualIndex % this.chords.length];
        if (this.step % this.chordsDistance == 0) {
            let midiNotes = Chord.get(chord).notes.map((note) => Tone.Frequency(note).transpose(this.offset).toFrequency())
            this.instrument.triggerAttackRelease(midiNotes, NOTE_DURATION, undefined, 0.1);
        }
    }

    private leeDistance(state: number) {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = Math.min(euclideanDistance, this.automata.states - euclideanDistance)
            return this.automata.state[index] != state ? acc : acc + leeDistance;
        }, 0);
    }

    stop() {
        this.instrument.releaseAll();
        this.instrument.dispose();
        this.note = "";
        this.lastNote = "";
        this.step = 0;
    }

    static Builder = class {
        private automata?: CellularAutomata1D
        private offset = 0;

        withAutomata(automata: CellularAutomata1D) {
            this.automata = automata;
            return this;
        }

        withOffset(offset: number) {
            this.offset = offset;
            return this;
        }

        async build() {
            if (this.automata === null) {
                throw new Error("Must pass a cellular automata upon building");
            }
            const instrument = new Tone.Sampler({
                urls: {
                    "C4": "fart-c.mp3",
                    "D4": "fart-d.mp3",
                    "E4": "fart-e.mp3",
                    "F4": "fart-f.mp3",
                    "G4": "fart-g.mp3",
                    "A4": "fart-a.mp3",
                    "B4": "fart-b.mp3"
                },
                baseUrl: process.env.PUBLIC_URL + "/sounds/",
            }).toDestination();

            await Tone.loaded();

            return new CellularAutomata1DPlayer(instrument, this.automata!, this.offset);
        }
    }
}