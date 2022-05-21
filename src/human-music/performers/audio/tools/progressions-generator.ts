import { Chord as TonalChord, Note as TonalNote } from '@tonaljs/tonal';
import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
import '../../../utils/extensions';
import { Chord } from '../music-models/chord';
import { convertToTree, progressions_list } from '../music-models/progressions';

const progressions = convertToTree(progressions_list)

export class ProgressionGenerator {
    constructor(private automata: CellularAutomata1D) { }

    generateChordsProgression(): { chords: Chord[], scale: string } {
        const chords = []
        let chord = progressions.shuffle()
        while (!chord.isLeaf) {
            const candidates = chord.children
            const candidate = candidates[this.automata.leeDistance() % candidates.length]
            this.automata.evolve()
            chords.push(candidate.value)
            chord = candidate
        }
        const scales = chords.map(chord => {
            const notes = chord.notes.map(note => TonalNote.fromMidi(note))
            const chordName = TonalChord.detect(notes)[0]
            return TonalChord.chordScales(chordName);
        })

        const scale = this.intersectMany(scales.flat()).shuffle()[0]
        chords.forEach(chord => chord.notes.sort((a, b) => a - b))
        return { chords, scale }
    }

    private intersection = <T>(arr1: T[], arr2: T[]) => {
        const res = [];
        for (let i = 0; i < arr1.length; i++) {
            if (!arr2.includes(arr1[i])) {
                continue;
            };
            res.push(arr1[i]);
        };
        return res;
    };
    private intersectMany = <T>(...arrs: T[][]) => {
        let res = arrs[0].slice();
        for (let i = 1; i < arrs.length; i++) {
            res = this.intersection(res, arrs[i]);
        };
        return res;
    };


}