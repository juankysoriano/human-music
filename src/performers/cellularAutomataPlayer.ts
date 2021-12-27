import * as Tone from 'tone'
import { CellularAutomata1D } from "../cellular-automata";
import { Chord } from "@tonaljs/tonal";

const NOTE_DURATION = 5;

enum VerticalTransformations {
    REFLECTION,
    TRANSPOSE_UP,
    TRANSPOSE_DOWN,
    ESCALE_UP,
    ESCALE_DOWN,
    NONE,
}

enum HorizontalTransformations {
    FASTER,
    SLOWER,
    NONE
}

export class CellularAutomata1DPlayer {
    private note = 0;
    private lastNote = 0;
    private voice = 0;
    private lastVoice = 0;
    private currentChord = 0;
    private chords = [""];
    private progressionChords = [] as number[]
    private chordsTracker = 0;
    private progressionNotes = [] as number[]
    private notesTracker = 0;
    private instrument: Tone.Sampler;
    private automata: CellularAutomata1D;
    private chordsDuration;
    private voicesDuration;
    private notesDuration;
    private chordsOctave;
    private voicesOctave;
    private notesOctave;
    private progressionLength;
    private chordsToTransformation;
    private step = 0;
    private playedChords = 0;
    private verticalTransformations = [
        VerticalTransformations.REFLECTION,
        VerticalTransformations.TRANSPOSE_UP,
        VerticalTransformations.TRANSPOSE_DOWN,
        VerticalTransformations.ESCALE_UP,
        VerticalTransformations.ESCALE_DOWN,
        VerticalTransformations.NONE
    ]
    private horizontalTransformations = [
        HorizontalTransformations.FASTER,
        HorizontalTransformations.SLOWER,
        HorizontalTransformations.NONE
    ]
    private upEscalations = 0;

    constructor(instrument: Tone.Sampler,
        automata: CellularAutomata1D,
        chordsOctave: number,
        voicesOctave: number,
        notesOctave: number,
        chordsDuration: number,
        voicesDuration: number,
        notesDuration: number,
        chords: string[],
        progressionLength: number,
        progressionsToTransformation: number
    ) {
        this.instrument = instrument;
        this.automata = automata;
        this.chordsOctave = chordsOctave;
        this.voicesOctave = voicesOctave;
        this.notesOctave = notesOctave;
        this.chordsDuration = chordsDuration;
        this.notesDuration = notesDuration;
        this.voicesDuration = voicesDuration;
        this.chords = chords;
        this.progressionLength = progressionLength;
        this.chordsToTransformation = progressionLength * progressionsToTransformation;
    }

    play() {
        this.playChord();
        this.playVoice();
        this.playNote();

        if (this.playedChords % this.chordsToTransformation == 0 && this.step % this.chordsDuration == 0) {
            this.step = 0;
            //this.transformChords();
            this.transformNotes();
            this.transformVoices();
        }

        this.step++;
    }

    private playChord() {
        if (this.step % this.chordsDuration != 0) {
            return;
        }

        if (this.progressionChords.length == this.progressionLength) {
            this.currentChord = this.progressionChords[this.chordsTracker % this.progressionChords.length];
            this.chordsTracker++;
        } else {
            let targetIndex = this.leeDistance(0) % (this.chords.length * 2);
            let actualIndex = targetIndex >= this.chords.length ? this.chords.length - (targetIndex % this.chords.length) - 1 : targetIndex;
            this.currentChord = actualIndex % this.chords.length;
            this.progressionChords.push(this.currentChord);
        }

        console.log(this.chords[this.currentChord % this.chords.length])
        let midiNotes = Chord.get(this.chords[this.currentChord % this.chords.length]).notes.map((note) => Tone.Frequency(note).transpose(this.chordsOctave * 12).toFrequency())
        this.instrument.triggerAttackRelease(midiNotes, NOTE_DURATION, undefined, 0.15);
        this.playedChords++;
    }

    private playVoice() {
        if (this.leeDistance(1) == 0 || (this.step % this.voicesDuration) != 0) {
            return;
        }

        let notes = Chord.get(this.chords[this.currentChord % this.chords.length]).notes;
        let targetIndex = this.leeDistance(1) % (notes.length * 2);
        let actualIndex = targetIndex >= notes.length ? notes.length - (targetIndex % notes.length) - 1 : targetIndex;
        this.voice = actualIndex % notes.length;

        if (this.voice != this.lastVoice) {
            let midiNote = Tone.Frequency(notes[this.voice]).transpose(this.voicesOctave * 12).toFrequency();
            this.instrument.triggerAttackRelease(midiNote, NOTE_DURATION, undefined, 0.4);
            this.lastVoice = this.voice;
        }

    }

    private playNote() {
        let state = this.automata.states == 3 ? 2 : 0;
        if (this.leeDistance(state) == 0 || this.step % this.notesDuration != 0) {
            return;
        }

        if (this.progressionChords.length == this.progressionLength) {
            this.note = this.progressionNotes[this.notesTracker % this.progressionNotes.length];
            this.notesTracker++;
        } else {
            let notes = Chord.get(this.chords[this.currentChord % this.chords.length]).notes;
            let targetIndex = this.leeDistance(state) % (notes.length * 2);
            let actualIndex = targetIndex >= notes.length ? notes.length - (targetIndex % notes.length) - 1 : targetIndex;
            this.note = actualIndex % notes.length;
            this.progressionNotes.push(this.note);
        }

        if (this.note != this.lastNote) {
            let notes = Chord.get(this.chords[this.currentChord % this.chords.length]).notes;
            let midiNote = Tone.Frequency(notes[Math.min(this.note, notes.length - 1)]).transpose(this.notesOctave * 12).toFrequency();
            this.instrument.triggerAttackRelease(midiNote, NOTE_DURATION, undefined, 0.2);
            this.lastNote = this.note;
        }
    }

    private transformChords() {
        //let horizontalTransformation = this.horizontalTransformations[this.hammingDistance(0) % this.horizontalTransformations.length];
        //switch (horizontalTransformation) {
        //    case HorizontalTransformations.FASTER:
        //        this.chordsDuration = Math.min(10, this.chordsDuration + 2);
        //        break;
        //    case HorizontalTransformations.SLOWER:
        //        this.chordsDuration = Math.max(3, this.chordsDuration - 2);
        //        break;
        //    case HorizontalTransformations.NONE: break;
        //}

        let verticalTransformation = this.verticalTransformations[this.aliveDistance(0) % this.verticalTransformations.length];
        switch (verticalTransformation) {
            case VerticalTransformations.REFLECTION:
                this.progressionChords = this.progressionChords.reverse();
                break;
            case VerticalTransformations.ESCALE_DOWN:
                this.progressionChords = this.progressionChords.map((chord) =>
                    this.upEscalations > 0 ? Math.round(chord / 2) : chord
                );
                this.upEscalations = Math.min(0, this.upEscalations - 1)
                break;
            case VerticalTransformations.ESCALE_UP:
                this.progressionChords = this.progressionChords.map((chord) =>
                    chord * 2
                );
                this.upEscalations++
                break;
            case VerticalTransformations.TRANSPOSE_DOWN:
                this.progressionChords = this.progressionChords.map((chord) =>
                    chord == 0 ? this.progressionChords.length - 1 : chord - 1
                );
                break;
            case VerticalTransformations.TRANSPOSE_UP:
                this.progressionChords = this.progressionChords.map((chord) =>
                    chord + 1
                );
                break;
            case VerticalTransformations.NONE: break;
        }
    }

    private transformVoices() {
        let horizontalTransformation = this.horizontalTransformations[this.hammingDistance(1) % this.horizontalTransformations.length];
        switch (horizontalTransformation) {
            case HorizontalTransformations.FASTER:
                this.voicesDuration = Math.max(1, this.voicesDuration - 2);
                break;
            case HorizontalTransformations.SLOWER:
                this.voicesDuration = Math.min(5, this.voicesDuration + 2);
                break;
            case HorizontalTransformations.NONE: break;
        }
    }

    private transformNotes() {
        let state = this.automata.states == 3 ? 2 : 0;
        let horizontalTransformation = this.horizontalTransformations[this.hammingDistance(state) % this.horizontalTransformations.length];
        switch (horizontalTransformation) {
            case HorizontalTransformations.FASTER:
                this.notesDuration = Math.max(2, this.notesDuration - 2);
                break;
            case HorizontalTransformations.SLOWER:
                this.notesDuration = Math.min(6, this.notesDuration + 2);
                break;
            case HorizontalTransformations.NONE: break;
        }
    }

    private leeDistance(state: number) {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = Math.min(euclideanDistance, this.automata.states - euclideanDistance)
            return this.automata.state[index] != state ? acc : acc + leeDistance;
        }, 0);
    }

    private hammingDistance(state: number) {
        return this.automata.state.reduce((acc, _, index) => {
            return this.automata.state[index] != state || this.automata.state[index] == this.automata.previousState[index] ? acc : acc + 1;
        }, 0);
    }

    private aliveDistance(state: number) {
        let aliveNow = this.automata.state.filter(value => value == state).length;
        let aliveBefore = this.automata.previousState.filter(value => value == state).length;

        return Math.abs(aliveNow - aliveBefore);
    }

    stop() {
        this.instrument.releaseAll();
        this.instrument.dispose();
        this.note = 0;
        this.lastNote = 0;
        this.step = 0;
        this.notesTracker = 0;
        this.chordsTracker = 0;
        this.playedChords = 0;
    }

    static Builder = class {
        private automata?: CellularAutomata1D;
        private chords = [
            ["C0major", "D0m", "E0m", "F0major", "G0major", "A0m", "C0maj7", "D0m7", "E0m7", "F0maj7", "G0maj7", "A0m7"],
            ["D0major", "E0m", "F#0m", "G0major", "A0major", "B0m", "D0maj7", "E0m7", "F#0m7", "G0maj7", "A0maj7", "B0m7"],
            ["E0major", "F#0m", "G#0m", "A0major", "B0major", "C#1m", "E0maj7", "F#0m7", "G#0m7", "A0maj7", "B0maj7", "C#1m7"],
            ["F#0major", "G#0m", "A#0m", "B0major", "C#1major", "Eb1m", "F#0maj7", "G#0m7", "A#0m7", "B0maj7", "C#1maj7"],
            ["G0major", "C0major", "D0major", "A0m", "E0m", "B0m", "G0maj7", "C0maj7", "D0maj7", "A0m7", "E0m7", "B0m7"],
            ["A0major", "C#1m", "D1major", "E1major", "F#1m", "B1m", "A0maj7", "C#1m7", "D1maj7", "E1major7", "F#1m7"],
            ["B0major", "C#1m", "D#1m", "E1major", "F#1major", "G#1m", "B0maj7", "C#1m7", "D#1m7", "E1maj7", "F#1maj7", "G#1m7"],
        ];

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
            let chordOctave = Math.round(Math.random() * 2) + 2;
            let voiceOctave = Math.round(Math.random()) + 3;
            let noteOctave = Math.round(Math.random()) + 3;

            let chordsDurations = [3, 4, 6, 8, 10];
            let notesDurations = [2, 3, 4, 5, 6];
            let voicesDurations = [1, 2, 3, 4, 5];

            let chordDuration = chordsDurations[Math.floor(Math.random() * chordsDurations.length)]
            let voicesDuration = voicesDurations[Math.floor(Math.random() * voicesDurations.length)]
            let notesDuration = notesDurations[Math.floor(Math.random() * notesDurations.length)]

            let progressionLengths = [2, 3, 4];
            let progressionLength = progressionLengths[Math.floor(Math.random() * progressionLengths.length)];

            let progressionsToTransformations = [1];
            let progressionsToTransformation = progressionsToTransformations[Math.floor(Math.random() * progressionsToTransformations.length)];

            return new CellularAutomata1DPlayer(
                instrument,
                this.automata!,
                chordOctave,
                voiceOctave,
                noteOctave,
                chordDuration,
                voicesDuration,
                notesDuration,
                chord,
                progressionLength,
                progressionsToTransformation
            );
        }
    }
}