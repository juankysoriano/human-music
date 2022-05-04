import { } from '../../../utils/extensions';
import { Note } from "./note";

const allNotes: Note[] = [
    48, // whole
    36, // half dot
    24, // half
    18, // quarter dot
    12, // quarter
    9, // eighth dot
    6, // eighth
    3, // sixteenth
].map(duration => new Note({ value: 0, duration, allowRepeat: false }))

export function rythms(beatDuration: number): Note[][] {
    function findRythm(rythm: Note[], max: number, min: number) {
        const space = allNotes.filter(note => note.duration >= min && note.duration <= max);
        const result = [];
        for (const note of rythm) {
            const candidates = findNotesFilling(note, space);
            result.push(...candidates);
        }
        return result
    }

    function findNotesFilling(note: Note, space: Note[]): Note[] {
        let notes: Note[] = [];
        while (duration(notes) !== note.duration) {
            const remaining = note.duration - duration(notes);
            const availableNotes = space.filter(spaceNote => spaceNote.duration <= remaining)
            if (availableNotes.length === 0) {
                console.log("CLEARING", remaining)
                notes = []
            } else {
                const candidate = space[Math.floor(Math.random() * space.length)];
                if (duration(notes) + candidate.duration <= note.duration) {
                    notes.push(candidate);
                }
            }
        }
        return notes;
    }
    const slow = findRythm([new Note({ duration: beatDuration })], 48, 24)
    const mid = findRythm(slow, 36, 12)
    const fast = findRythm(mid, 12, 3)

    console.log("SLOW: " + slow.map(note => note.duration).join(", "))
    console.log("MID: " + mid.map(note => note.duration).join(", "))
    console.log("FAST: " + fast.map(note => note.duration).join(", "))
    return [slow, mid, fast].shuffle();
}

function duration(notes: Note[]): number {
    return notes.length === 0 ? 0 : notes.flat().reduce((acc, note) => acc + note.duration, 0);
}