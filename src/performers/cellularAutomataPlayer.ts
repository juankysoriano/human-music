import { CellularAutomata1D } from "../cellular-automata";
import * as MIDI from './MIDI';
const NOTE_DURATION = 5;
export class CellularAutomata1DPlayer {
    private music!: Music
    constructor(music: Music
    ) {
        this.music = music;
    }

    async play() {
        this.music.play();
    }

    async stop() {
        this.music.release();
    }

    static Builder = class {
        private automata?: CellularAutomata1D;
        private scales = [[-1, 0, 2, 4, 5, 7, 9, 11]] // mayor
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

            const music = new Music([
                new Voice(2, this.scales[0], 3, this.automata!),
                new Voice(1, this.scales[0], 4, this.automata!),
                new Voice(0, this.scales[0], 5, this.automata!)
            ]);

            return new CellularAutomata1DPlayer(
                music
            );
        }
    }
}

class Music {
    private durationTransformation = new DurationTransformation();
    private pitchTransformation = new PitchTransformation();;
    readonly voices: Voice[];
    private beatDuration: number = 64;
    private currentBeat: number = 64;

    constructor(voices: Voice[]) {
        this.voices = voices;
    }

    async play() {
        this.voices.forEach((voice, index) => {
            console.log(index + ": " + voice.currentNote.duration);
        })
        if (this.beatDuration == this.currentBeat) {
            this.currentBeat = 0;
            this.durationTransformation.restore();
            this.pitchTransformation.restore();
            this.voices.forEach(voice => {
                voice.stop();
                this.durationTransformation.mutate(voice);
                this.pitchTransformation.mutate(voice);
            });
        }
        this.voices.forEach(voice => {
            voice.play();
        });
        this.currentBeat++;
    }

    release(): void {
        MIDI.stopAll();
    }
}

class Voice {
    private scale: number[];
    readonly octave: number;
    toneOffset: number = 0;
    notesDuration: number = 0;
    readonly automata: CellularAutomata1D;
    currentNote: Note = new Note(0, 0)
    private instrument;

    constructor(instrument: number, scale: number[], octave: number, automata: CellularAutomata1D) {
        this.instrument = instrument;
        this.scale = scale;
        this.octave = octave;
        this.automata = automata;
    }

    async play() {
        if (this.currentNote.isFinished()) {
            let midiNote = this.scale[(this.leeDistance() + this.toneOffset) % this.scale.length] + this.octave * 12;
            if (this.currentNote.value != midiNote) {
                MIDI.noteOff(this.instrument, this.currentNote.value);
                this.currentNote = new Note(midiNote, this.notesDuration);
                if (this.currentNote.value != -1) {
                    MIDI.noteOn(this.instrument, this.currentNote.value);
                }
            } else {
                this.currentNote = new Note(midiNote, this.notesDuration);
            }

        }
        this.currentNote.tick();
    }

    async stop() {
        this.currentNote = new Note(0, 0);
    }

    private leeDistance() {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = Math.min(euclideanDistance, this.automata.states - euclideanDistance)
            return acc + leeDistance;
        }, 0);
    }
}

interface Transformation {
    mutate(voice: Voice): void;
    restore(): void;
}

class DurationTransformation implements Transformation {
    private staticDurations: number[] = shuffle([4, 8, 16, 32]);
    private durations: number[] = [...this.staticDurations];
    mutate(voice: Voice): void {
        let index = this.leeDistance(voice) % this.durations.length;
        voice.notesDuration = this.durations[index];
        this.durations.splice(index, 1);
    }

    restore(): void {
        this.durations = [...this.staticDurations];
    }

    private leeDistance(voice: Voice): number {
        return voice.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(voice.automata.state[index] - voice.automata.previousState[index])
            let leeDistance = Math.min(euclideanDistance, voice.automata.states - euclideanDistance)
            return acc + leeDistance;
        }, 0);
    }
}

class PitchTransformation implements Transformation {
    private staticOffsets: number[] = shuffle([0, +2, +4]);
    private offsets: number[] = [...this.staticOffsets];
    mutate(voice: Voice): void {
        let index = this.leeDistance(voice) % this.offsets.length;
        voice.toneOffset = this.offsets[index];
        this.offsets.splice(index, 1);
    }

    restore(): void {
        this.offsets = [...this.staticOffsets];
    }

    private leeDistance(voice: Voice): number {
        return voice.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(voice.automata.state[index] - voice.automata.previousState[index])
            let leeDistance = Math.min(euclideanDistance, voice.automata.states - euclideanDistance)
            return acc + leeDistance;
        }, 0);
    }
}

function shuffle(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

class Note {
    readonly value!: number
    duration!: number

    constructor(value: number, duration: number) {
        this.value = value;
        this.duration = duration;
    }

    tick(): void {
        this.duration--;
    }

    isFinished(): boolean {
        return this.duration <= 0;
    }
}