import * as Tone from 'tone'
import { CellularAutomata1D } from "../cellular-automata";
import { Chord } from "@tonaljs/tonal";

const NOTE_DURATION = 5;

export class CellularAutomata1DPlayer {
    private note = "";
    private lastNote = "";
    private voice = "";
    private lastVoice = "";
    private currentChord = "";
    private chords = [""];
    private instrument: Tone.Sampler;
    private automata: CellularAutomata1D;
    private chordsDistance = 8;
    private voicesDistance = 4;
    private noteDistance = 1;
    private chordOctave = 3;
    private voiceOctave = 5;
    private noteOctave = 4;
    private step = 0;

    constructor(instrument: Tone.Sampler, automata: CellularAutomata1D, chordOctave: number, voiceOctave: number, noteOctave: number, chords: string[]) {
        this.instrument = instrument;
        this.automata = automata;
        this.chordOctave = chordOctave;
        this.voiceOctave = voiceOctave;
        this.noteOctave = noteOctave;
        this.chords = chords;
    }

    play() {
        this.playChord();
        this.playNote();
        this.playVoice();

        this.step++;
    }

    private playNote() {
        if (this.leeDistance(1) == 0) {
            return;
        }
        let notes = Chord.get(this.currentChord).notes;
        let targetIndex = this.leeDistance(1) % (notes.length * 2);
        let actualIndex = targetIndex >= notes.length ? notes.length - (targetIndex % notes.length) - 1 : targetIndex;
        this.note = notes[actualIndex % notes.length];

        if (this.step % this.noteDistance == 0 && this.note != this.lastNote) {
            let midiNote = Tone.Frequency(this.note).transpose(this.noteOctave * 12).toFrequency();
            this.instrument.triggerAttackRelease(midiNote, NOTE_DURATION, undefined, 0.75);
            this.lastNote = this.note;
        }

    }

    private playVoice() {
        if (this.leeDistance(2) == 0) {
            return;
        }
        let notes = Chord.get(this.currentChord).notes;
        let targetIndex = this.leeDistance(2) % (notes.length * 2);
        let actualIndex = targetIndex >= notes.length ? notes.length - (targetIndex % notes.length) - 1 : targetIndex;
        this.voice = notes[actualIndex % notes.length];

        if (this.step % this.voicesDistance == 0 && this.automata.states == 3 && this.voice != this.lastVoice) {
            let midiNote = Tone.Frequency(this.voice).transpose(this.voiceOctave * 12).toFrequency();
            this.instrument.triggerAttackRelease(midiNote, NOTE_DURATION, undefined, 0.5);
        }

        this.lastVoice = this.voice;
    }

    private playChord() {
        let targetIndex = this.leeDistance(0) % (this.chords.length * 2);
        let actualIndex = targetIndex >= this.chords.length ? this.chords.length - (targetIndex % this.chords.length) - 1 : targetIndex;
        let chord = this.chords[actualIndex % this.chords.length];
        if (this.step % this.chordsDistance == 0) {
            this.currentChord = chord;
            let midiNotes = Chord.get(chord).notes.map((note) => Tone.Frequency(note).transpose(this.chordOctave * 12).toFrequency())
            this.instrument.triggerAttackRelease(midiNotes, NOTE_DURATION, undefined, 0.25);
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
        private automata?: CellularAutomata1D;
        private chords = [
            ["C0major", "F0major", "G0major", "D0m", "A0m", "E0m"],
            ["C0major", "F0major", "A0m", "E0m"],
            ["C0major", "G0major", "D0m", "E0m"],
            ["G0major", "C0major", "D0major", "A0m", "E0m", "B0m"],
            ["G0major", "C0major", "E0m", "B0m"],
            ["G0major", "D0major", "A0m", "B0m"],
            ["D0major", "G0major", "A0major", "E0m", "B0m", "F#0m"],
            ["D0major", "G0major", "B0m", "F#0m"],
            ["D0major", "A0major", "E0m", "F#0m"],
            ["A0major", "D0major", "E0major", "B0m", "F#0m", "C#0m"],
            ["A0major", "D0major", "F#0m", "C#0m"],
            ["A0major", "E0major", "B0m", "C#0m"],
            ["E0major", "A0major", "B0major", "F#0m", "C#0m", "G#0m"],
            ["E0major", "A0major", "C#0m", "G#0m"],
            ["E0major", "B0major", "F#0m", "G#0m"],
            ["B0major", "E0major", "F#0major", "C#0m", "G#0m", "Eb0m"],
            ["B0major", "E0major", "G#0m", "Eb0m"],
            ["B0major", "F#0major", "C#0m", "Eb0m"],
            ["F#0major", "B0major", "C#0major", "G#0m", "Eb0m", "Bb0m"],
            ["F#0major", "B0major", "Eb0m", "Bb0m"],
            ["F#0major", "C#0major", "G#0m", "Bb0m"]
        ]

        withAutomata(automata: CellularAutomata1D) {
            this.automata = automata;
            return this;
        }

        async build() {
            if (this.automata === null) {
                throw new Error("Must pass a cellular automata upon building");
            }
            const instrument = new Tone.Sampler({
                urls: {
                    "C1": "C1.mp3",
                    "D#1": "Ds1.mp3",
                    "F#1": "Fs1.mp3",
                    "A1": "A1.mp3",
                    "C2": "C2.mp3",
                    "D#2": "Ds2.mp3",
                    "F#2": "Fs2.mp3",
                    "A2": "A2.mp3",
                    "C3": "C3.mp3",
                    "D#3": "Ds3.mp3",
                    "F#3": "Fs3.mp3",
                    "A3": "A3.mp3",
                    "C4": "C4.mp3",
                    "D#4": "Ds4.mp3",
                    "F#4": "Fs4.mp3",
                    "A4": "A4.mp3",
                    "C5": "C5.mp3",
                    "D#5": "Ds5.mp3",
                    "F#5": "Fs5.mp3",
                    "A5": "A5.mp3",
                },
                baseUrl: "https://tonejs.github.io/audio/salamander/",
            }).toDestination();

            await Tone.loaded();

            let chord = this.chords[Math.floor(Math.random() * this.chords.length)];
            let chordOctave = Math.round(Math.random() * 2) + 2
            let voiceOctave = Math.round(Math.random() * 2) + 2
            let noteOctave = Math.round(Math.random() * 2) + 2
            return new CellularAutomata1DPlayer(instrument, this.automata!, noteOctave, voiceOctave, chordOctave, chord);
        }
    }
}