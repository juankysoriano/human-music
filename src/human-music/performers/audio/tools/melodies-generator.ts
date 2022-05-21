import { cloneDeep } from 'lodash';
import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
import { Note } from '../music-models/note';

export class MelodiesGenerator {
    private melodyPatterns: Map<number, number[][]> = [
        //[0],
        [+1],
        [-1],
        [-1, -1],
        //[-1, 0],
        [-1, +1],
        //[0, -1],
        //[0, 0],
        //[0, +1],
        [+1, -1],
        //[+1, 0],
        [+1, +1],
        [-1, -1, -1],
        //[-1, -1, 0],
        [-1, -1, +1],
        //[-1, 0, -1],
        //[-1, 0, 0],
        //[-1, 0, +1],
        [-1, +1, -1],
        //[-1, +1, 0],
        [-1, +1, +1],
        //[0, -1, -1],
        //[0, -1, 0],
        //[0, -1, +1],
        //[0, 0, -1],
        //[0, 0, 0],
        //[0, 0, +1],
        //[0, +1, -1],
        //[0, +1, 0],
        //[0, +1, +1],
        [+1, -1, -1],
        //[+1, -1, 0],
        [+1, -1, +1],
        //[+1, 0, -1],
        //[+1, 0, 0],
        //[+1, 0, +1],
        [+1, +1, -1],
        //[+1, +1, 0],
        [+1, +1, +1],
        [-1, -1, -1, -1],
        //[-1, -1, -1, 0],
        [-1, -1, -1, +1],
        //[-1, -1, 0, -1],
        //[-1, -1, 0, 0],
        //[-1, -1, 0, +1],
        [-1, -1, +1, -1],
        //[-1, -1, +1, 0],
        [-1, -1, +1, +1],
        //[-1, 0, -1, -1],
        //[-1, 0, -1, 0],
        //[-1, 0, -1, +1],
        //[-1, 0, 0, -1],
        //[-1, 0, 0, 0],
        //[-1, 0, 0, +1],
        //[-1, 0, +1, -1],
        //[-1, 0, +1, 0],
        //[-1, 0, +1, +1],
        //[-1, +1, -1, -1],
        //[-1, +1, -1, 0],
        [-1, +1, -1, +1],
        //[-1, +1, 0, -1],
        //[-1, +1, 0, 0],
        //[-1, +1, 0, +1],
        [-1, +1, +1, -1],
        //[-1, +1, +1, 0],
        [-1, +1, +1, +1],
        //[0, -1, -1, -1],
        //[0, -1, -1, 0],
        //[0, -1, -1, +1],
        //[0, -1, 0, -1],
        //[0, -1, 0, 0],
        //[0, -1, 0, +1],
        //[0, -1, +1, -1],
        //[0, -1, +1, 0],
        //[0, -1, +1, +1],
        //[0, 0, -1, -1],
        //[0, 0, -1, 0],
        //[0, 0, -1, +1],
        //[0, 0, 0, -1],
        //[0, 0, 0, 0],
        //[0, 0, 0, +1],
        //[0, 0, +1, -1],
        //[0, 0, +1, 0],
        //[0, 0, +1, +1],
        //[0, +1, -1, -1],
        //[0, +1, -1, 0],
        //[0, +1, -1, +1],
        //[0, +1, 0, -1],
        //[0, +1, 0, 0],
        //[0, +1, 0, +1],
        //[0, +1, +1, -1],
        //[0, +1, +1, 0],
        //[0, +1, +1, +1],
        [+1, -1, -1, -1],
        //[+1, -1, -1, 0],
        [+1, -1, -1, +1],
        //[+1, -1, 0, -1],
        //[+1, -1, 0, 0],
        //[+1, -1, 0, +1],
        [+1, -1, +1, -1],
        //[+1, -1, +1, 0],
        [+1, -1, +1, +1],
        //[+1, 0, -1, -1],
        //[+1, 0, -1, 0],
        //[+1, 0, -1, +1],
        //[+1, 0, 0, -1],
        //[+1, 0, 0, 0],
        //[+1, 0, 0, +1],
        //[+1, 0, +1, -1],
        //[+1, 0, +1, 0],
        //[+1, 0, +1, +1],
        [+1, +1, -1, -1],
        //[+1, +1, -1, 0],
        [+1, +1, -1, +1],
        //[+1, +1, 0, -1],
        //[+1, +1, 0, 0],
        //[+1, +1, 0, +1],
        [+1, +1, +1, -1],
        //[+1, +1, +1, 0],
        [+1, +1, +1, +1],
    ].shuffle().groupBy(pattern => pattern.length);

    private rythmPatterns: Map<number, Note[][]> = [
        [48], // whole
        [36, 12],
        [12, 36],
        [36, 6, 6],
        [6, 6, 36],
        [6, 36, 6],
        [24, 24],
        [24, 12, 12],
        [12, 24, 12],
        [12, 12, 24],
        [12, 12, 12, 12],
        [18, 18, 12],
        [12, 18, 18],
        [18, 12, 18],

        [36], // half dot
        [24, 12],
        [12, 24],
        [24, 6, 6],
        [6, 6, 24],
        [6, 24, 6],
        [12, 12, 12],
        [12, 12, 6, 6],
        [6, 6, 12, 12],
        [6, 12, 12, 6],
        [12, 6, 6, 12],
        [12, 6, 12, 6],
        [6, 12, 6, 12],

        [24], // half
        [18, 6],
        [6, 18],
        [18, 3, 3],
        [3, 3, 18],
        [3, 18, 3],
        [12, 12],
        [12, 6, 6],
        [6, 12, 6],
        [6, 6, 12],
        [6, 6, 6, 6],
        [9, 9, 6],
        [6, 9, 9],
        [9, 6, 9],

        [18], // quarter dot
        [12, 6],
        [6, 12],
        [12, 3, 3],
        [3, 3, 12],
        [3, 12, 3],
        [6, 6, 6],
        [6, 6, 3, 3],
        [3, 3, 6, 6],
        [3, 6, 6, 3],
        [6, 3, 3, 6],
        [6, 3, 6, 3],
        [3, 6, 3, 6],

        [12], // quarter
        [9, 3],
        [3, 9],
        [6, 6],
        [6, 3, 3],
        [3, 6, 3],
        [3, 3, 6],
        [3, 3, 3, 3],

        [9], // eighth dot
        [6, 3],
        [3, 6],
        [3, 3, 3],

        [6], // eighth
        [3, 3],

        [3], // sixteenth
    ].map(group => group.map(duration => new Note({ value: 0, duration })))
        .shuffle()
        .groupBy((notes) => duration(notes))

    private automata: CellularAutomata1D
    private beatDuration: number
    private notesFinder: NotesFinder
    private rythmMutator: Mutator

    constructor(automata: CellularAutomata1D, beatDuration: number) {
        this.automata = automata
        this.beatDuration = beatDuration
        this.notesFinder = new NotesFinder(this.automata)
        this.rythmMutator = new Mutator(this.automata, this.notesFinder, this.melodyPatterns, this.rythmPatterns)
    }

    generateMelodies(): Note[][][] {
        let slow: Note[][] = [[]]
        let mid: Note[][] = [[]]
        let fast: Note[][] = [[]]

        while (slow.flat().length === 0 || mid.flat().length === 0 || fast.flat().length === 0) {
            slow = this.findRythm([[new Note({ duration: this.beatDuration })]], this.beatDuration, this.beatDuration)
                .filter(group => group.length > 0)
            mid = this.findRythm(slow, this.beatDuration, 24)
                .filter(group => group.length > 0)
            fast = this.findRythm(mid, 24, 12)
                .filter(group => group.length > 0)
                .map(notes => {
                    const melody = this.melodyPatterns.get(notes.length)![Math.floor(Math.random() * this.melodyPatterns.get(notes.length)!.length)]
                    this.automata.evolve()
                    return notes.map((note, index) => note.copy({ value: melody[index] }))
                })
        }

        const baseRythm = { fast, mid, slow }
        const pattern1 = this.patternFrom(baseRythm, 0)
        const pattern2 = this.patternFrom(baseRythm, 2)
        const pattern3 = this.patternFrom(baseRythm, 2)
        const pattern4 = this.patternFrom(baseRythm, 2)

        return [pattern1, pattern2, pattern3, pattern4]
    }

    private findRythm(rythm: Note[][], max: number, min: number) {
        const searchSpace = this.rythmPatterns.filterByKey(key => key >= min && key <= max)
        const result = [];

        for (const note of rythm) {
            const candidates = this.notesFinder.findNotes({ targetDuration: duration(note), searchSpace });
            if (candidates.length !== 0) {
                result.push(...candidates);
            } else {
                return []
            }
        }
        return result
    }

    private patternFrom(rythm: { fast: Note[][], mid: Note[][], slow: Note[][] }, numberOfmutations: number) {
        const fast = this.rythmMutator.mutate(rythm.fast, numberOfmutations)
        const { mid, slow } = rythm
        return [fast, mid, slow].map(pattern => pattern.flat())
    }
}

class NotesFinder {
    private automata: CellularAutomata1D

    constructor(automata: CellularAutomata1D) {
        this.automata = automata
    }

    findNotes({ targetDuration, searchSpace }: { targetDuration: number; searchSpace: Map<number, Note[][]>; }): Note[][] {
        let notes: Note[][] = [[]]
        while (duration(notes.flat()) !== targetDuration) {
            const remaining = targetDuration - duration(notes.flat())
            const availableNotes = searchSpace.filterByKey(value => value <= remaining)
            if (availableNotes.size === 0) {
                notes = []
                this.automata.mutate()
            } else {
                const candidates = Array.from(availableNotes.values()).flat()
                const candidate = candidates[Math.floor(Math.random() * candidates.length) % candidates.length]
                this.automata.evolve()
                if (duration(notes.flat()) + duration(candidate) <= targetDuration) {
                    notes.push(candidate);
                }
            }
        }
        return notes
    }
}

class Mutator {
    private operations = {
        nothing: 0,
        reverse: 1,
        inversion: 2,
        rythm_mutation: 3,
        melody_mutation: 4
    }
    private automata: CellularAutomata1D
    private notesFinder: NotesFinder
    private melodyPatterns: Map<number, number[][]>
    private rythmPatterns: Map<number, Note[][]>

    constructor(
        automata: CellularAutomata1D,
        notesFinder: NotesFinder,
        melodyPatterns: Map<number, number[][]>,
        rythmPatterns: Map<number, Note[][]>
    ) {
        this.automata = automata
        this.notesFinder = notesFinder
        this.melodyPatterns = melodyPatterns
        this.rythmPatterns = rythmPatterns
    }

    mutate(group: Note[][], numberOfMutations: number): Note[][] {
        let mutation = group
        for (let i = 0; i < numberOfMutations; i++) {
            const copy = cloneDeep(group)
            const operation = this.automata.leeDistance() % 5
            this.automata.evolve()
            switch (operation) {
                case this.operations.reverse: mutation = this.reverse(copy); break;
                case this.operations.inversion: mutation = this.invert(copy); break;
                case this.operations.rythm_mutation: mutation = this.mutateRythm(copy); break;
                case this.operations.melody_mutation: mutation = this.mutateMelody(copy); break;
                case this.operations.nothing: mutation = copy; break;
                default: return mutation = copy;
            }
        }
        return mutation
    }

    private reverse(group: Note[][]) {
        return group.map(notes => notes.reverse());
    }

    private invert(group: Note[][]) {
        return group.map(notes => notes.map(note => {
            switch (note.value) {
                case 1: return note.copy({ value: -1 })
                case -1: return note.copy({ value: 1 })
                default: return note
            }
        }))
    }

    private mutateRythm(group: Note[][]) {
        return group.flatMap(notes =>
            [this.notesFinder.findNotes(
                { targetDuration: duration(notes), searchSpace: this.rythmPatterns }
            ).filter(group => group.length > 0)
                .flatMap(notes => {
                    const avaliableMelodies = this.melodyPatterns.get(notes.length)!
                    const melody = avaliableMelodies[this.automata.leeDistance() % avaliableMelodies.length]
                    this.automata.evolve()
                    return notes.map((note, index) => note.copy({ value: melody[index] }))
                }).flat()
            ]);
    }

    private mutateMelody(group: Note[][]) {
        return group.map(notes => {
            const avaliableMelodies = this.melodyPatterns.get(notes.length)!
            const melody = avaliableMelodies[this.automata.leeDistance() % avaliableMelodies.length]
            this.automata.evolve()
            return notes.map((note, index) => note.copy({ value: melody[index] }))
        });
    }
}

function duration(notes: Note[]) {
    return notes.length === 0 ? 0 : notes.flat().reduce((acc, note) => acc + note.duration, 0)
}
