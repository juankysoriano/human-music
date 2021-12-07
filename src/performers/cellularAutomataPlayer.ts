import * as Tone from 'tone'
import { CellularAutomata1D } from "../cellular-automata";
import { Chord } from "@tonaljs/tonal";

const NOTE_DURATION = 1;

export class CellularAutomata1DPlayer {
    private note = "";
    private lastNote = "";
    private notes = ["C4", "D4", "C4", "D4", "E4", "C4", "D4", "E4", "F4", "C4", "D4", "E4", "F4", "G4", "C4", "D4", "E4", "F4", "G4", "A4", "B4"]
    private chords = ["C2major", "C2maj7", "D2m", "D2m7", "E2m", "E2m7", "F2maj7", "A2m", "A2m7", "B2m7b5", "C3major", "C3maj7", "D3m", "D3m7", "E3m", "E3m7", "F3maj7", "A3m", "A3m7", "B3m7b5"]//, "F5", "F5maj7", "G5", "G57", "A5m", "A5m7"]//, "B5°", "B5m7b5"];
    private instrument: Tone.Sampler;
    private automata: CellularAutomata1D;
    private offset = 0;
    private beats = 8;
    private step = 0;

    constructor(instrument: Tone.Sampler, automata: CellularAutomata1D) {
        this.instrument = instrument;
        this.automata = automata;
    }

    play() {
        this.playNote();
        this.playChord();
        
        this.step++;
    }

    private playNote() {
        let targetIndex = this. leeDistance() % (this.notes.length * 2);
        let actualIndex = targetIndex >= this.notes.length ? this.notes.length - (targetIndex % this.notes.length) - 1 : targetIndex;
        this.note = this.notes[actualIndex % this.notes.length];
        
        if (this.note != this.lastNote) {
            this.instrument.triggerAttackRelease(this.note, NOTE_DURATION, undefined, 0.15);
        }

        this.lastNote = this.note;
    }

    private playChord() {
        let targetIndex = this.leeDistance() % (this.chords.length * 2);
        let actualIndex = targetIndex >= this.chords.length ? this.chords.length - (targetIndex % this.chords.length) - 1 : targetIndex;
        let chord = this.chords[actualIndex % this.chords.length];
        if (this.step % this.beats == 0) {
            this.instrument.triggerAttackRelease(Chord.get(chord).notes, NOTE_DURATION * this.beats, undefined, 0.1);    
        }
    }

    private leeDistance() {
        return this.automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(this.automata.state[index] - this.automata.previousState[index])
            let leeDistance = Math.min(euclideanDistance, this.automata.states - euclideanDistance)
            return this.automata.state[index] == 0 ? acc : acc + leeDistance;
        }, this.offset);
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

            return new CellularAutomata1DPlayer(instrument, this.automata!);
        }
    }
}