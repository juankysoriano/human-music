import * as Tone from 'tone'
import { SamplerOptions } from 'tone';
import { Instrument } from "tone/build/esm/instrument/Instrument";
import { CellularAutomata1D } from "../cellular-automata";

export class CellularAutomata1DPlayer {
    private note = "R";
    private lastNote = "R";
    private notes = ["R", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"];
    private instrument: Instrument<SamplerOptions>;
    private automata: CellularAutomata1D;

    constructor(instrument: Instrument<SamplerOptions>, automata: CellularAutomata1D) {
        this.instrument = instrument;
        this.automata = automata;
    }

    play() {
        let livingCells = this.automata.state.filter(state => state !== 0).length;
        this.note = this.notes[livingCells % this.notes.length];
        if (this.note !== this.lastNote) {
            this.instrument.triggerRelease(this.lastNote, Tone.now());
            if (this.note !== "R") {
                this.instrument.triggerAttack(this.note, Tone.now());
            }
        }
        this.lastNote = this.note;
    }

    stop() {
        this.instrument.triggerRelease(this.lastNote);
        this.note = "R";
        this.lastNote = "R";
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
                    "C4": "C4.mp3",
                    "D#4": "Ds4.mp3",
                    "F#4": "Fs4.mp3",
                    "A4": "A4.mp3",
                },
                baseUrl: "https://tonejs.github.io/audio/salamander/",
            }).toDestination();

            await Tone.loaded();

            return new CellularAutomata1DPlayer(instrument, this.automata!);
        }
    }
}