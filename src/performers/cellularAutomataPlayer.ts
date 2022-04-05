import { CellularAutomata1D } from "../cellular-automata";
import * as MIDI from './MIDI';
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

            const music = new Music(
                this.automata!,
                [new Voice(2, 5), new Voice(1, 4), new Voice(0, 3)]
            );

            return new CellularAutomata1DPlayer(music);
        }
    }
}

class Music {
    private durationTransformation: DurationTransformation;
    private pitchTransformation: PitchTransformation;
    private noteGenerator: NoteGenerator;
    private beatDuration: number = 256;
    private currentBeat: number = 256;

    readonly voices: Voice[];

    constructor(automata: CellularAutomata1D, voices: Voice[]) {
        this.voices = voices;
        this.durationTransformation = new DurationTransformation(automata);
        this.pitchTransformation = new PitchTransformation(automata);
        this.noteGenerator = new NoteGenerator(automata);
    }

    async play() {
        if (this.beatQuarter()) {
            this.noteGenerator.nextChord();
        }
        if (this.finishedBeat()) {
            this.durationTransformation.restore();
            this.pitchTransformation.restore();
            this.noteGenerator.restore();
            this.voices.forEach(voice => {
                voice.stop();
                this.durationTransformation.mutate(voice);
                this.pitchTransformation.mutate(voice);
            });
        }

        this.voices.forEach(voice => {
            let attack = this.currentBeat == 0 ? 96 : 64;
            voice.play(this.noteGenerator.generateNote(voice), attack);
            voice.tick();
        });

        this.currentBeat++;
    }

    private finishedBeat = () => this.currentBeat % this.beatDuration == 0;

    private beatQuarter = () => this.currentBeat % (this.beatDuration / 4) == 0;

    release(): void {
        MIDI.stopAll();
    }
}

class Voice {
    private currentNote: Note = new Note(0, 0)
    private instrument;

    readonly octave: number;
    notesDuration: number = 0;
    toneOffset: number = 0;

    constructor(instrument: number, octave: number) {
        this.instrument = instrument;
        this.octave = octave;
    }

    async play(baseNote: number, attack: number) {
        if (this.currentNote.isFinished()) {
            let midiNote = baseNote + this.octave * 12;
            if (this.currentNote.value != midiNote) {
                MIDI.noteOff(this.instrument, this.currentNote.value);
                MIDI.noteOn(this.instrument, Math.max(midiNote, 0), attack);
            }
            this.currentNote = new Note(midiNote, this.notesDuration);
        }
    }

    async tick() {
        this.currentNote.tick();
    }

    async stop() {
        this.currentNote = new Note(0, 0);
    }
}

interface Transformation {
    mutate(voice: Voice): void;
    restore(): void;
}

class DurationTransformation implements Transformation {
    private staticDurations: number[] = shuffle([4, 8, 16, 32]);
    private durations: number[] = [...this.staticDurations];
    private automata: CellularAutomata1D;

    constructor(automata: CellularAutomata1D) {
        this.automata = automata;
    }

    mutate(voice: Voice): void {
        let index = this.leeDistance() % this.durations.length;
        voice.notesDuration = this.durations[index];
        this.durations.splice(index, 1);
    }

    restore(): void {
        this.durations = [...this.staticDurations];
    }

    private leeDistance(): number {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = this.automata.state[index] > 0 && euclideanDistance > 0 ? Math.min(euclideanDistance, this.automata.states - euclideanDistance) : 0;
            return acc + leeDistance;
        }, 0);
    }
}

class PitchTransformation implements Transformation {
    private staticOffsets: number[] = shuffle([0, +1, +2]);
    private offsets: number[] = [...this.staticOffsets];
    private automata: CellularAutomata1D;

    constructor(automata: CellularAutomata1D) {
        this.automata = automata;
    }

    mutate(voice: Voice): void {
        let index = this.leeDistance() % this.offsets.length;
        voice.toneOffset = this.offsets[index];
        this.offsets.splice(index, 1);
    }

    restore(): void {
        this.offsets = [...this.staticOffsets];
    }

    private leeDistance(): number {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = this.automata.state[index] > 0 && euclideanDistance > 0 ? Math.min(euclideanDistance, this.automata.states - euclideanDistance) : 0;
            return acc + leeDistance;
        }, 0);
    }
}

class NoteGenerator {
    private track = 0;
    private empty = []
    private firstMinor = [0, 3, 7]
    //private secondMinorDiminished = [2, 5, 8]
    private thirdMajor = [3, 7, 10]
    private fourthMinor = [5, 7, 12]
    private fithMinor = [7, 10, 14]
    //private fifthMajor = [7, 11, 14]
    //private fithMajor7 = [7, 11, 14, 17]
    private sixthMajor = [8, 12, 15]
    private seventhMajor = [10, 14, 17]
    //private seventhMinorDiminished = [11, 14, 17]
    private recorded: number[][] = [];
    private currentChord: number[] = this.empty;
    private progressionsMap = new Map<number[], number[][]>(
        [
            [this.empty, [this.firstMinor]],
            [this.firstMinor, shuffle([this.thirdMajor, this.fourthMinor, this.fithMinor, this.sixthMajor, this.seventhMajor])],
            [this.thirdMajor, shuffle([this.fourthMinor, this.sixthMajor, this.seventhMajor])],
            [this.fourthMinor, shuffle([this.firstMinor, this.thirdMajor, this.fithMinor, this.sixthMajor])],
            [this.fithMinor, [this.firstMinor]],
            [this.sixthMajor, shuffle([this.thirdMajor, this.fithMinor, this.seventhMajor])],
            [this.seventhMajor, shuffle([this.firstMinor, this.sixthMajor])]
        ]
    );

    private automata: CellularAutomata1D;

    constructor(automata: CellularAutomata1D) {
        this.automata = automata;
    }

    nextChord() {
        if (this.recorded.length < 4) {
            let candidates = this.progressionsMap.get(this.currentChord) as number[][];
            let index = this.leeDistance() % candidates.length;
            this.currentChord = candidates[index];
            this.recorded.push(this.currentChord);
        } else {
            this.currentChord = this.recorded[this.track % this.recorded.length]
            this.track++;
        }

        console.log("Selected: " + this.currentChord);
    }

    generateNote = (voice: Voice) => this.currentChord[(this.leeDistance() + voice.toneOffset) % this.currentChord.length] + 6;

    restore() {
        //this.currentChord = Array.from(this.progressionsMap.keys())[1];
    }

    private leeDistance(): number {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = this.automata.state[index] > 0 && euclideanDistance > 0 ? Math.min(euclideanDistance, this.automata.states - euclideanDistance) : 0;
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

    isFinished = () => this.duration <= 0;
}