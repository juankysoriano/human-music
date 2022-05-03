import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
import { } from '../../../utils/extensions';
import { Note } from "./note";

export const rythms: Note[][] = [
    [new Note({ duration: 48, allowExtension: false })],
    [new Note({ duration: 24, allowExtension: false }), new Note({ duration: 24, allowExtension: false })],
    [new Note({ duration: 36, allowExtension: false }), new Note({ duration: 12, allowExtension: false })],
    [new Note({ duration: 12, allowExtension: false }), new Note({ duration: 36, allowExtension: false })],
    [new Note({ duration: 12, allowExtension: false }), new Note({ duration: 24, allowExtension: false }), new Note({ duration: 12, allowExtension: false })],
    [new Note({ duration: 24, allowExtension: false }), new Note({ duration: 12, allowExtension: false }), new Note({ duration: 12, allowExtension: false })],
    [new Note({ duration: 12, allowExtension: false }), new Note({ duration: 12, allowExtension: false }), new Note({ duration: 24, allowExtension: false })],
    [new Note({ duration: 16, allowExtension: false }), new Note({ duration: 16, allowExtension: false }), new Note({ duration: 16, allowExtension: false })],
    [new Note({ duration: 12, allowExtension: false }), new Note({ duration: 12, allowExtension: false }), new Note({ duration: 12, allowExtension: false }), new Note({ duration: 12, allowExtension: false })],
    //[new Note({ duration: 24, allowExtension: false }), new Note({ duration: 8, allowExtension: false }), new Note({ duration: 8, allowExtension: false }), new Note({ duration: 8, allowExtension: false })],
    //[new Note({ duration: 8, allowExtension: false }), new Note({ duration: 8, allowExtension: false }), new Note({ duration: 8, allowExtension: false }), new Note({ duration: 24, allowExtension: false })],
    //[new Note({ duration: 12, allowExtension: false }), new Note({ duration: 8, allowExtension: false }), new Note({ duration: 8, allowExtension: false }), new Note({ duration: 8, allowExtension: false }), new Note({ duration: 12, allowExtension: false })],
    //[new Note({ duration: 12, allowExtension: false }), new Note({ duration: 12, allowExtension: false }), new Note({ duration: 8, allowExtension: false }), new Note({ duration: 8, allowExtension: false }), new Note({ duration: 8, allowExtension: false })],
    //[new Note({ duration: 8, allowExtension: false }), new Note({ duration: 8, allowExtension: false }), new Note({ duration: 8, allowExtension: false }), new Note({ duration: 12, allowExtension: false }), new Note({ duration: 12, allowExtension: false })],
].shuffle()

export function rythmFor(automata: CellularAutomata1D, beatDuration: number): Note[][] {
    function findRythm(factor: number) {
        const calculatedRythm = [];
        while (duration(calculatedRythm) < beatDuration) {
            automata.evolve()
            const index = automata.leeDistance() % rythms.length;
            const selected = rythms[index].map(note => note.copy({ duration: note.duration / factor }));
            calculatedRythm.push(...selected);
            automata.evolve()
        }
        return calculatedRythm
    }
    automata.reset()
    return [findRythm(1), findRythm(2), findRythm(4)].shuffle();
}

function duration(notes: Note[]): number {
    return notes.length === 0 ? 0 : notes.reduce((acc, note) => acc + note.duration, 0);
}