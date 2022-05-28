import { Chord as TonalChord, Note as TonalNote, Scale } from '@tonaljs/tonal';
import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
import '../../../utils/extensions';
import { Chord } from '../music-models/chord';
import { convertToTree, progressions_list } from '../music-models/progressions';

const progressions = convertToTree(progressions_list)

export class ProgressionGenerator {
    private beatDuration: number
    constructor(private automata: CellularAutomata1D, beatDuration: number) {
        this.beatDuration = beatDuration
    }

    generateProgression(): { chords: Chord[], scale: number[] } {
        const chords = [] as Chord[]
        let chord = progressions.shuffle()

        while (!chord.isLeaf) {
            const candidates = chord.children
            const candidate = candidates[this.automata.leeDistance() % candidates.length]
            chords.push(candidate.value)
            chord = candidate
        }
        const scales = chords.map(chord => {
            const notes = chord.midiNotes.map(note => TonalNote.fromMidi(note))
            const chordName = TonalChord.detect(notes)
            const scales: string[] = chordName.flatMap(name => TonalChord.chordScales(name)).flat().filter(scale => scale !== "chromatic")
            //return Scale.names().removeDuplicates().shuffle().filter(scale => scale !== "chromatic")
            return ["major", "minor", "harmonic major", "harmonic minor", "melodic major", "melodic minor", "major pentatonic", "minor pentatonic"].shuffle()
        })

        chords.map(chord => chord.copy({
            notes: chord.midiNotes.map((note, index, array) => {
                if (index > 0 && note < array[index - 1]) {
                    return note + 12
                }
                return note
            })
        }))
        chords.map(chord => chord.copy({
            notes: chord.midiNotes.map((note, index, array) => {
                if (index > 0 && note < array[index - 1]) {
                    return note + 12
                }
                return note
            })
        }))
        chords.map(chord => chord.copy({
            notes: chord.midiNotes.map((note, index, array) => {
                if (index > 0 && note < array[index - 1]) {
                    return note + 12
                }
                return note
            })
        }))
        const scale = this.intersectMany(scales.flat()).removeDuplicates().flatMap(name => {
            const values = Scale.get(`C0 ${name}`).notes.map(note => TonalNote.midi(note) as number - 12)
            values.push(...values.map(note => note + 12))
            values.push(...values.map(note => note + 12))
            return [{ values, name }]
        }).filter(notes => chords.flat().every(chord => chord.midiNotes.every(note => notes.values.includes(note))))
            .shuffle()[0]

        chords.map(chord => chord.copy({ scale: scale.values }))

        console.log(scale.name)
        const inversions = chords.map((chord, index, array) => {
            const inversion = Chord.inversion({
                chord,
                previousChord: index === 0 ? undefined : array[index - 1],
                defaultInversion: this.automata.leeDistance() % chord.midiNotes.length
            })
            return inversion
        }).map(chord => chord.copy({ duration: this.beatDuration }))
        return { chords: inversions, scale: scale.values }
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