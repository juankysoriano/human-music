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

    updateAutomata(automata: CellularAutomata1D) {
        this.automata = automata;
        this.instrument.triggerRelease(this.lastNote);
        this.note = "R";
        this.lastNote = "R";
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
                    A1: "A1.mp3",
                    A2: "A2.mp3",
                },
                baseUrl: "https://tonejs.github.io/audio/casio/",
            }).toDestination();

            await Tone.loaded();

            return new CellularAutomata1DPlayer(instrument, this.automata!);
        }
    }
}