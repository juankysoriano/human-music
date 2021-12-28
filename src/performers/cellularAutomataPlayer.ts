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
    private chords = [] as number[][];
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
        chords: number[][],
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
        } else if (this.playedChords == 0) {
            this.currentChord = 0;
            this.progressionChords.push(this.currentChord);
        } else {
            let targetIndex = this.leeDistance(0) % (this.chords.length * 2);
            let actualIndex = targetIndex >= this.chords.length ? this.chords.length - (targetIndex % this.chords.length) - 1 : targetIndex;
            this.currentChord = actualIndex % this.chords.length;
            this.progressionChords.push(this.currentChord);
        }

        let midiNotes = this.chords[this.currentChord % this.chords.length].map((note) => Tone.Frequency(note, "midi").transpose(this.chordsOctave * 12).toFrequency())
        this.instrument.triggerAttackRelease(midiNotes, NOTE_DURATION, undefined, 0.10);
        this.playedChords++;
    }

    private playVoice() {
        if (this.leeDistance(1) == 0 || (this.step % this.voicesDuration) != 0) {
            return;
        }

        let notes = this.chords[this.currentChord % this.chords.length];
        let targetIndex = this.leeDistance(1) % (notes.length * 2);
        let actualIndex = targetIndex >= notes.length ? notes.length - (targetIndex % notes.length) - 1 : targetIndex;
        this.voice = actualIndex % notes.length;

        if (this.voice != this.lastVoice) {
            let midiNote = Tone.Frequency(notes[this.voice], "midi").transpose(this.voicesOctave * 12).toFrequency();
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
            let notes = this.chords[this.currentChord % this.chords.length];
            let targetIndex = this.leeDistance(state) % (notes.length * 2);
            let actualIndex = targetIndex >= notes.length ? notes.length - (targetIndex % notes.length) - 1 : targetIndex;
            this.note = actualIndex % notes.length;
            this.progressionNotes.push(this.note);
        }

        if (this.note != this.lastNote) {
            let notes = this.chords[this.currentChord % this.chords.length];
            let midiNote = Tone.Frequency(notes[this.note], "midi").transpose(this.notesOctave * 12).toFrequency();
            this.instrument.triggerAttackRelease(midiNote, NOTE_DURATION, undefined, 0.3);
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

            let tone = Math.floor(Math.random() * 13);
            let chord = this.chords[Math.floor(Math.random() * this.chords.length)].map(chord => chord.map(interval => interval + tone));
            let chordOctave = Math.round(Math.random() * 2) + 3;
            let voiceOctave = Math.round(Math.random()) + 4;
            let noteOctave = Math.round(Math.random()) + 4;

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


/**
 *          let mayor = [2, 2, 1, 2, 2, 2, 1]
            let minor = [2, 1, 2, 2, 1, 2, 2]
            let dorian = [2, 1, 2, 2, 2, 1, 2]
            let phrygian = [1, 2, 2, 2, 1, 2, 2]
            let lydian = [2, 2, 2, 1, 2, 2, 1]
            let mixolydian = [2, 2, 1, 2, 2, 1, 2]
            let locrian = [1, 2, 2, 1, 2, 2, 2]
            let pentatonic = [2, 2, 3, 2, 3]
            let minor_pentatonic = [3, 2, 2, 3, 2]
            let blues = [3, 2, 1, 1, 3, 2]
            let enigmatic = [1, 3, 2, 2, 2, 1, 1]
            let flamenco = [1, 3, 1, 2, 1, 3, 1]
            let algerian = [2, 1, 3, 1, 1, 3, 1, 2, 1, 2]
            let hirajoshi = [4, 2, 1, 4, 1]


            let scale = hirajoshi
            let copy = [...scale]
            console.log(
                scale.map((value, index) => {
                    let scale = [] as number[]
                    let sumBefore = 0
                    for (let i = 0; i < index; i++) {
                        sumBefore += copy[i]
                    }
                    scale.push(sumBefore)
                    scale.push(sumBefore + copy[index] + copy[(index + 1) % copy.length])
                    scale.push(sumBefore + copy[index] + copy[(index + 1) % copy.length] + copy[(index + 2) % copy.length] + copy[(index + 3) % copy.length])
                    return scale.toString()
                })
            )
            console.log(
                scale.map((value, index) => {
                    let scale = [] as number[]
                    let sumBefore = 0
                    for (let i = 0; i < index; i++) {
                        sumBefore += copy[i]
                    }
                    scale.push(sumBefore)
                    scale.push(sumBefore + copy[index] + copy[(index + 1) % copy.length])
                    scale.push(sumBefore + copy[index] + copy[(index + 1) % copy.length] + copy[(index + 2) % copy.length] + copy[(index + 3) % copy.length])
                    scale.push(sumBefore + copy[index] + copy[(index + 1) % copy.length] + copy[(index + 2) % copy.length] + copy[(index + 3) % copy.length] + copy[(index + 4) % copy.length] + copy[(index + 4) % copy.length])
                    return scale.toString()
                })
            )
 */