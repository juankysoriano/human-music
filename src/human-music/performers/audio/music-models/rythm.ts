import { cloneDeep } from 'lodash';
import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
import { } from '../../../utils/extensions';
import { Note } from "./note";

const allNotes: Map<number, Note[][]> = [
    [48], // whole
    [36], // half dot
    [24], // half
    [18], // quarter dot
    [12], // quarter
    [9], // eighth dot
    [6], // eighth
    [3], // sixteenth
    [12, 24, 12],
    [12, 6, 6, 12],
    [6, 12, 12, 6],
    [12, 6, 12],
    [6, 12, 6],
    [6, 3, 3, 6],
    [3, 6, 6, 3],
    [6, 3, 6],
    [24, 24],
    [24, 18],
    [24, 12],
    [24, 9],
    [18, 24],
    [18, 18],
    [18, 18, 18],
    [18, 12],
    [18, 12, 18],
    [18, 9],
    [18, 9, 18],
    [18, 6],
    [18, 6, 18],
    [18, 3],
    [18, 3, 18],
    [12, 3],
    [12, 3, 12],
    [12, 6],
    [12, 6, 12],
    [12, 9],
    [12, 9, 12],
    [12, 12],
    [12, 12, 12],
    [12, 18],
    [12, 18, 12],
    [12, 24],
    [12, 24, 12],
    [6, 3],
    [6, 3, 6],
    [6, 6],
    [6, 6, 6],
    [6, 9],
    [6, 9, 6],
    [6, 12],
    [6, 12, 6],
    [6, 18],
    [6, 18, 6],
    [6, 24],
    [6, 24, 6],
    [3, 6, 3],
    [3, 3],
    [3, 6],
    [3, 9],
    [3, 9, 3],
    [3, 12],
    [3, 12, 3],
    [3, 18],
    [3, 18, 3],
    //[8, 8, 8, 8, 8, 8],
    [6, 6, 6, 6, 6, 6],
    //[4, 4, 4, 4, 4, 4],
    [3, 3, 3, 3, 3, 3],
    [16, 16, 16],
    [12, 12, 12],
    //[8, 8, 8],
    [6, 6, 6],
    //[4, 4, 4],
    [3, 3, 3],
    [18, 18],
    [9, 9],
].map(group => group.map(duration => new Note({ value: 0, duration, allowRepeat: true })))
    .groupBy((durations) => duration(durations))

export function rythms(automata: CellularAutomata1D, beatDuration: number): Note[][][] {
    function findRythm(rythm: Note[][], max: number, min: number) {
        const space = allNotes.filterByKey(key => key >= min && key <= max)
        const result = [];

        for (const note of rythm) {
            const candidates = findNotesFilling(note, space);
            if (candidates.length !== 0) {
                result.push(...candidates);
            } else {
                return []
            }
        }
        return result
    }

    function findNotesFilling(note: Note[], space: Map<number, Note[][]>): Note[][] {
        let notes: Note[][] = [[]]
        let attemps = 0

        while (groupDuration(notes) !== duration(note)) {
            const remaining = duration(note) - groupDuration(notes)
            const availableNotes = space.filterByKey(value => value <= remaining)
            if (availableNotes.size === 0) {
                notes = []
                attemps++
                if (attemps > 10) {
                    return []
                }
            } else {
                const candidate = Array.from(availableNotes.values()).flat()[Math.floor(Math.random() * availableNotes.size)]
                if (groupDuration(notes) + duration(candidate) <= duration(note)) {
                    notes.push(candidate);
                }
            }
        }
        return notes
    }

    function indexReduce(slower: Note[], faster: Note[]) {
        slower.reduce((acc, note, currentIndex) => {
            let index = 0
            while (duration(faster.slice(0, index)) < acc) {
                index++
            }
            slower[currentIndex] = note.copy({ value: faster[index].value })
            return (acc + note.duration)
        }, 0)
        return slower
    }

    function mutation(automata: CellularAutomata1D, group: Note[][]): Note[][] {
        const copy = cloneDeep(group)
        const mutation = automata.leeDistance() % 8
        automata.evolve()
        switch (mutation) {
            case 0: return copy.map(notes => notes.reverse());
            case 1: return copy.map(notes => notes.map(note => note.copy({ value: note.value + 1 })));
            case 2: return copy.map(notes => notes.map(note => note.copy({ value: note.value - 1 })));
            case 3: return copy.map(notes => {
                automata.evolve()
                return findNotesFilling(notes, allNotes.filterByKey(key => key >= duration(notes) && key <= duration(notes)))
                    .flatMap((notes, index) => notes.map(note => {
                        const melodyNote = note.copy({ value: automata.leeDistance() + (index + 1) })
                        automata.evolve()
                        return melodyNote
                    })).flat()
            });
            case 4: return copy.map(notes => {
                automata.evolve()
                return notes.map((note, index) => {
                    const melodyNote = note.copy({ value: automata.leeDistance() + (index + 1) })
                    automata.evolve()
                    return melodyNote
                })
            });
            default: return copy
        }
    }

    let slow: Note[][] | Note[] = [[]]
    let slow2: Note[] = []
    let slow3: Note[] = []
    let slow4: Note[] = []

    let mid: Note[][] | Note[] = [[]]
    let mid2: Note[] = []
    let mid3: Note[] = []
    let mid4: Note[] = []

    let fast: Note[][] | Note[] = [[]]
    let fast2: Note[] = []
    let fast3: Note[] = []
    let fast4: Note[] = []



    while (slow.flat().length === 0 || mid.flat().length === 0 || fast.flat().length === 0) {
        slow = findRythm([[new Note({ duration: beatDuration })]], beatDuration, 24).shuffle()
        mid = findRythm(slow, 36, 12)
        fast = findRythm(mid, 24, 3)
    }

    fast = fast.flatMap((notes, index) => [notes.map(note => {
        const melodyNote = note.copy({ value: automata.leeDistance() + (index + 1) })
        automata.evolve()
        return melodyNote
    })])

    fast2 = mutation(automata, fast).flat()
    fast3 = mutation(automata, fast).flat()
    fast4 = mutation(automata, fast).flat()
    fast = fast.flat()
    mid = indexReduce(mid.flat(), fast)
    mid2 = indexReduce(mid, fast2)
    mid3 = indexReduce(mid, fast3)
    mid4 = indexReduce(mid, fast4)
    slow = indexReduce(slow.flat(), mid)
    slow2 = indexReduce(slow, mid2)
    slow3 = indexReduce(slow, mid3)
    slow4 = indexReduce(slow, mid4)

    return [Math.random() > 0.5 ? [slow, mid, fast] : [slow.reverse(), mid.reverse(), fast.reverse()]
        , Math.random() > 0.5 ? [slow2, mid2, fast2] : [slow2.reverse(), mid2.reverse(), fast2.reverse()]
        , Math.random() > 0.5 ? [slow3, mid3, fast3] : [slow3.reverse(), mid3.reverse(), fast3.reverse()]
        , Math.random() > 0.5 ? [slow4, mid4, fast4] : [slow4.reverse(), mid4.reverse(), fast4.reverse()]]
}

function duration(notes: Note[]): number {
    return notes.length === 0 ? 0 : notes.flat().reduce((acc, note) => acc + note.duration, 0)
}

function groupDuration(notes: Note[][]): number {
    return duration(notes.flat())
}
