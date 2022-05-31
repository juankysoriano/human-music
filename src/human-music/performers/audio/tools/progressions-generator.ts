import { Note as TonalNote, Scale } from '@tonaljs/tonal';
import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
import '../../../utils/extensions';
import { intersection } from '../../../utils/extensions';
import { Chord } from '../music-models/chord';
import { convertToTree, progressions_list } from '../music-models/progressions';

const progressions = convertToTree(progressions_list)

export class ProgressionGenerator {
    private beatDuration: number
    constructor(private automata: CellularAutomata1D, beatDuration: number) {
        this.beatDuration = beatDuration
    }

    generateProgression(): { chords: Chord[], scale: number[] } {
        const chords = this.generateChords();
        const scale = this.generateScale(chords);
        const inversions = this.generateInversions(chords);
        return { chords: inversions, scale }
    }

    private generateChords() {
        const chords = [] as Chord[];
        let chord = progressions.shuffle();
        while (!chord.isLeaf) {
            const candidates = chord.children;
            const candidate = candidates[this.automata.leeDistance() % candidates.length];
            chords.push(candidate.value);
            chord = candidate;
        }

        return chords;
    }

    private generateScale(chords: Chord[]) {
        const scales = ["major", "minor", "harmonic major", "harmonic minor", "melodic major", "melodic minor", "major pentatonic", "minor pentatonic"].shuffle()
        //const scales = chords.map(chord => {
        //const notes = chord.midiNotes.map(note => TonalNote.fromMidi(note))
        //const chordName = TonalChord.detect(notes)
        //const scales: string[] = chordName.flatMap(name => TonalChord.chordScales(name)).flat().filter(scale => scale !== "chromatic")
        //return Scale.names().removeDuplicates().shuffle().filter(scale => scale !== "chromatic")
        //})

        const scale = intersection(scales.flat())
            .removeDuplicates()
            .flatMap(name => {
                const scaleNotes = Scale.get(`C0 ${name}`).notes.map(note => TonalNote.midi(note) as number - 12)
                scaleNotes.push(...scaleNotes.map(note => note + 12))
                scaleNotes.push(...scaleNotes.map(note => note + 12))
                return [{ values: scaleNotes, name }]
            }).filter(notes => chords.flat().every(chord => chord.midiNotes.every(note => notes.values.includes(note))))
            .shuffle()[0]

        console.log(`Selected Scale => ${scale.name}`)
        return scale.values
    }

    private generateInversions(chords: Chord[]) {
        const inversions = chords.map((chord, index, array) => Chord.inversion({
            chord,
            previousChord: index === 0 ? undefined : array[index - 1],
            defaultInversion: this.automata.leeDistance() % chord.midiNotes.length
        })).map(chord => chord.copy({ duration: this.beatDuration }))

        console.log("Chord Progression => " + inversions.map(chord => chord.label + ": {" + chord.midiNotes + "}").join(" "))
        return inversions
    }
}