import * as Tone from 'tone'
import { SamplerOptions } from 'tone';
import { Instrument } from "tone/build/esm/instrument/Instrument";
import { CellularAutomata1D } from "../cellular-automata";

export class CellularAutomata1DPlayer {
    private notes = ["R", "R"];
    private lastNotes = ["R", "R"];
    private allNotes = [
        ["R", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6"],
        ["R", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"]
    ];
    private instruments: Instrument<SamplerOptions>[];
    private automata: CellularAutomata1D;
    private step = 0;

    constructor(instruments: Instrument<SamplerOptions>[], automata: CellularAutomata1D) {
        this.instruments = instruments;
        this.automata = automata;
    }

    updateAutomata(automata: CellularAutomata1D) {
        this.automata = automata;
        this.instruments.forEach((instrument, index) => instrument.triggerRelease(this.lastNotes[index]));
        this.notes = ["R", "R"];
        this.lastNotes = ["R", "R"];
    }

    play() {
        this.instruments.forEach((instrument, index) => {
            if ((index == 1 && this.step % 4 != 0) || (index == 0 && this.step % 2 != 0)) {
                return;
            }
            let livingCells = this.automata.state.filter(state => state === index + 1).length;
            this.notes[index] = this.allNotes[index][livingCells % this.allNotes[index].length];
            console.log(this.notes[index])
            if (this.notes[index] !== this.lastNotes[index]) {
                instrument.triggerRelease(this.lastNotes[index], Tone.now());
                if (this.notes[index] !== "R") {
                    instrument.triggerAttack(this.notes[index], Tone.now());
                }
            }
            this.lastNotes[index] = this.notes[index];
        })
        this.step++;
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
            const instruments = [
                new Tone.Sampler({
                    urls: {
                        "C4": "C4.mp3",
                        "D#4": "Ds4.mp3",
                        "F#4": "Fs4.mp3",
                        "A4": "A4.mp3",
                    },
                    release: 1,
                    baseUrl: "https://tonejs.github.io/audio/salamander/",
                }).toDestination(),
                new Tone.Sampler({
                    urls: {
                        "C4": "C4.mp3",
                        "D#4": "Ds4.mp3",
                        "F#4": "Fs4.mp3",
                        "A4": "A4.mp3",
                    },
                    release: 1,
                    baseUrl: "https://tonejs.github.io/audio/salamander/",
                }).toDestination()
            ]

            await Tone.loaded();

            return new CellularAutomata1DPlayer(instruments, this.automata!);
        }
    }
}