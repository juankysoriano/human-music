import * as Tone from 'tone'
import { CellularAutomata1D } from "../cellular-automata";
import { Chord } from "@tonaljs/tonal";
import { sign } from 'crypto';

const NOTE_DURATION = 5;
export class CellularAutomata1DPlayer {
    private instrument!: Tone.Sampler
    private music!: Music
    private lastValue: number = 0
    constructor(instrument: Tone.Sampler, music: Music
    ) {
        this.instrument = instrument;
        this.music = music;
    }

    async play() {
        this.music.notes().forEach((notes, index) => {
            if (notes != null) {
                var midiNotes = notes.map(note => Tone.Frequency(note.value, "midi").toFrequency())
                var attack = 0.025 * (index * 2 + 1)
                if (index == 1) {
                    if (this.lastValue != midiNotes[0]) {
                        this.instrument.triggerAttackRelease(midiNotes, 5, undefined, attack);
                        this.lastValue = midiNotes[0]
                    }
                } else {
                    this.instrument.triggerAttackRelease(midiNotes, 5, undefined, attack);
                }
            }
        })
    }

    stop() {
        this.instrument.releaseAll();
        this.instrument.dispose();
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

            var beatDuration = 4 * (2 + Math.floor(Math.random() * 3))
            var progressions = (2 + Math.floor(Math.random() * 3))
            var availableDurationsLong = [4, 8, 16].filter(duration => duration <= beatDuration)
            var availableDurationsShort = [1, 2, 4]
            var durationsLong: number[] = []
            for (let i = 0; i < progressions; i++) {
                var sum = 0;
                while (sum != beatDuration) {
                    var nextDuration = availableDurationsLong[Math.floor(Math.random() * availableDurationsLong.length)]
                    if (sum + nextDuration <= beatDuration) {
                        durationsLong.push(nextDuration)
                        sum += nextDuration
                    }
                }
            }
            var durationsShort: number[] = []
            for (let i = 0; i < progressions; i++) {
                var sum = 0;
                while (sum != beatDuration) {
                    var nextDuration = availableDurationsShort[Math.floor(Math.random() * availableDurationsShort.length)]
                    if (sum + nextDuration <= beatDuration) {
                        durationsShort.push(nextDuration)
                        sum += nextDuration
                    }
                }
            }

            var chord = Math.floor(Math.random() * this.chords.length)

            var music = new Music(
                new ChordsGeneratorVoice(durationsLong, this.automata!, 4, this.chords[0]),
                new ChordsFollowerVoice(durationsShort, this.automata!, 5, this.chords[0]),
                new FreeVoice(6, 1, this.automata!)
            );

            return new CellularAutomata1DPlayer(
                instrument,
                music
            );
        }
    }
}

class Music {
    private longDurationVoice!: Voice;
    private shortDurationVoice!: Voice;
    private freeVoice!: Voice;

    constructor(longDurationVoice: Voice, shortDurationVoice: Voice, freeVoice: Voice) {
        this.longDurationVoice = longDurationVoice;
        this.shortDurationVoice = shortDurationVoice;
        this.freeVoice = freeVoice;
    }

    notes(): (Note[] | null)[] {
        var largeDurationNotes = this.longDurationVoice.newNote();
        var currentChord = this.longDurationVoice.currentChord;
        this.shortDurationVoice.updateCurrentChord(currentChord);
        this.freeVoice.updateCurrentChord(currentChord)
        var shortDurationNotes = this.shortDurationVoice.newNote();
        var freeNotes = this.freeVoice.newNote();

        this.longDurationVoice.tick();
        this.shortDurationVoice.tick();
        this.freeVoice.tick();

        return [largeDurationNotes, shortDurationNotes]//, freeNotes];
    }
}

abstract class Voice {
    public currentChord: number[] = [];
    protected chords!: number[][];
    protected currentNote: Note[] = [];
    protected automata!: CellularAutomata1D;
    protected octave!: number;
    protected remainingDuration: number = 0;

    tick(): void {
        this.remainingDuration--;
    }

    timeToNote(): boolean {
        return this.remainingDuration == 0;
    }

    updateCurrentChord(chord: number[]) {
        this.currentChord = chord;
    }

    abstract newNote(): Note[] | null
}

class ChordsGeneratorVoice extends Voice {
    private durations!: number[];
    private recordingLimit: number
    private record: Note[][] = [];

    constructor(durations: number[], automata: CellularAutomata1D, octave: number, chords: number[][]) {
        super()
        this.durations = durations;
        this.recordingLimit = durations.length;
        this.automata = automata;
        this.octave = octave;
        this.chords = chords;
    }

    private hasRecord(): boolean {
        return this.record.length > 0;
    }
    private finishedRecording(): boolean {
        return this.hasRecord() && this.record.length == this.recordingLimit;
    }

    newNote(): Note[] | null {
        if (this.timeToNote()) {
            if (this.finishedRecording()) {
                this.currentNote = this.record.shift() as Note[];
                this.currentChord = this.currentNote.map(note => note.value - this.octave * 12);
                this.remainingDuration = this.currentNote[0].duration;
                this.record.push(this.currentNote);
                return this.currentNote;
            } else {
                this.currentChord = this.chords[this.leeDistance(0) % this.chords.length];
                this.currentNote = this.currentChord.map(value => new Note(this.octave * 12 + value, this.durations[this.record.length]));
                this.remainingDuration = this.currentNote[0].duration;
                this.record.push(this.currentNote);
                return this.currentNote
            }
        } else {
            return null;
        }
    }

    private leeDistance(state: number) {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = Math.min(euclideanDistance, this.automata.states - euclideanDistance)
            return this.automata.state[index] != state ? acc : acc + leeDistance;
        }, 0);
    }
}

class ChordsFollowerVoice extends Voice {
    private durations!: number[];
    private recordingLimit: number
    private record: Note[][] = [];

    constructor(durations: number[], automata: CellularAutomata1D, octave: number, chords: number[][]) {
        super()
        this.durations = durations;
        this.recordingLimit = durations.length;
        this.automata = automata;
        this.octave = octave;
        this.chords = chords;
    }


    private hasRecord(): boolean {
        return this.record.length > 0;
    }
    private finishedRecording(): boolean {
        return this.hasRecord() && this.record.length == this.recordingLimit;
    }

    newNote(): Note[] | null {
        if (this.timeToNote()) {
            if (this.finishedRecording()) {
                this.currentNote = this.record.shift() as Note[];
                this.remainingDuration = this.currentNote[0].duration;
                this.record.push(this.currentNote);
                return this.currentNote;
            } else {
                var value = this.octave * 12 + this.currentChord[this.leeDistance(1) % this.currentChord.length];
                this.currentNote = [new Note(value, this.durations[this.record.length])];
                this.remainingDuration = this.currentNote[0].duration;
                this.record.push(this.currentNote);
                return this.currentNote
            }
        } else {
            return null;
        }
    }

    private leeDistance(state: number) {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = Math.min(euclideanDistance, this.automata.states - euclideanDistance)
            return this.automata.state[index] != state ? acc : acc + leeDistance;
        }, 0);
    }
}

class FreeVoice extends Voice {
    private minDuration!: number;
    constructor(octave: number, minDuration: number, automata: CellularAutomata1D) {
        super()
        this.octave = octave;
        this.minDuration = minDuration;
        this.automata = automata;
    }
    newNote(): Note[] | null {
        if (this.timeToNote()) {
            var value = this.octave * 12 + this.currentChord[this.leeDistance(2) % this.currentChord.length];
            var newNote = [new Note(value, this.minDuration)]
            this.remainingDuration = this.minDuration;
            if (this.currentNote[0] != null && value == this.currentNote[0].value) {
                return null
            } else {
                this.currentNote = newNote;
                return this.currentNote
            }
        } else {
            return null;
        }
    }

    private leeDistance(state: number) {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = Math.min(euclideanDistance, this.automata.states - euclideanDistance)
            return this.automata.state[index] != state ? acc : acc + leeDistance;
        }, 0);
    }
}

class Note {
    readonly value!: number
    duration!: number

    constructor(value: number, duration: number) {
        this.value = value;
        this.duration = duration;
    }
}

function delay(arg0: number) {
    throw new Error('Function not implemented.');
}
