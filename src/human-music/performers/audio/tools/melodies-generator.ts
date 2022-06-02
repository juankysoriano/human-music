import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
import { Chord } from '../music-models/chord';
import { Note } from '../music-models/note';

export class MelodiesGenerator {
    private rythmPatterns: Map<number, number[][]> = [
        [1],
        [1 / 2, 1 / 2],
        [1 / 3, 1 / 3, 1 / 3],
        [1 / 4, 1 / 4, 1 / 4, 1 / 4],
        [1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5],
        [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
        [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7],
        [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8],
        [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
        [1 / 10, 1 / 10, 1 / 10, 1 / 10, 1 / 10, 1 / 10, 1 / 10, 1 / 10, 1 / 10, 1 / 10],
        [1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11],
        [1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12],
    ].shuffle().groupBy(values => values.length)

    private automata: CellularAutomata1D
    private beatDuration: number
    private chords: Chord[]
    private scale: number[]

    constructor(automata: CellularAutomata1D, beatDuration: number, chords: Chord[], scale: number[]) {
        this.automata = automata
        this.beatDuration = beatDuration
        this.chords = chords
        this.scale = scale
    }

    generateMelody(): Note[] {
        const a = this.melodyStep()
        const b = this.melodyStep()
        const c = this.melodyStep()
        const d = this.melodyStep()
        const random = Math.floor(Math.random() * 8)
        let base
        switch (random) {
            case 0:
                console.log("a,a,b,a")
                console.log([a, a, b, a])
                base = [a, a, b, a].flat()
                break;
            case 1:
                console.log("a,b,a,a")
                console.log([a, b, a, a])
                base = [a, b, a, a].flat()
                break
            case 2:
                console.log("a,b,a,c")
                console.log([a, b, a, c])
                base = [a, b, a, c]
                break
            case 3:
                console.log("a,b")
                console.log([a, b].flat())
                base = [a, b]
                break
            case 4:
                console.log("a,b,b,a")
                console.log([a, b, b, a])
                base = [a, b, b, a]
                break
            case 5:
                console.log("a,b,c,a")
                console.log([a, b, c, a])
                base = [a, b, c, a]
                break
            case 6:
                console.log("a,b,c,b")
                console.log([a, b, c, b])
                base = [a, b, c, b]
                break
            default:
                console.log("a,b,c,d")
                console.log([a, b, c, d].flat())
                base = [a, b, c, d]
                break
        }
        return base.flat()

    }

    private melodyStep(): Note[] {
        const notes: { note: Note, chord: Chord }[] = []
        this.chords.forEach(chord => {
            notes.push({ note: new Note({ value: chord.midiNotes[this.automata.leeDistance() % chord.midiNotes.length], duration: this.beatDuration }), chord })
        })

        const baseMelody = this.divideNotes(notes);
        const withNeightbourdTones: Note[] = this.neightbourdTones(baseMelody.map(value => value.note));
        const withPassingTones: Note[] = this.passingTones(withNeightbourdTones);
        this.automata.mutate()

        console.log(baseMelody)

        return withPassingTones
    }

    private divideNotes(notes: { note: Note; chord: Chord; }[]): { note: Note, chord: Chord }[] {
        notes = notes.flatMap((current, index, array) => {
            if (Math.random() > 0.2) {
                const durations = this.rythmPatterns.get(2)!;
                const durationsFactor = durations[this.automata.leeDistance() % durations.length].shuffle();
                const newNote1 = current.note.copy({ duration: durationsFactor[0] * current.note.duration });
                const lastNote = array[(index + 1) % array.length];
                let newNote2 = current.note.copy({ value: current.chord.midiNotes[this.automata.leeDistance() % current.chord.midiNotes.length], duration: durationsFactor[1] * current.note.duration });
                while (newNote1.midiNote === newNote2.midiNote || newNote2.midiNote === lastNote.note.midiNote) {
                    this.automata.mutate()
                    newNote2 = current.note.copy({ value: current.chord.midiNotes[this.automata.leeDistance() % current.chord.midiNotes.length], duration: durationsFactor[1] * current.note.duration });
                }
                return [{ note: newNote1, chord: current.chord }, { note: newNote2, chord: current.chord }];
            } else {
                return [current];
            }
        });
        notes = notes.flatMap((current, index, array) => {
            if (Math.random() > 0.4) {
                const durations = this.rythmPatterns.get(2)!;
                const durationsFactor = durations[this.automata.leeDistance() % durations.length].shuffle();
                const newNote1 = current.note.copy({ duration: durationsFactor[0] * current.note.duration });
                const lastNote = array[(index + 1) % array.length];
                let newNote2 = current.note.copy({ value: current.chord.midiNotes[this.automata.leeDistance() % current.chord.midiNotes.length], duration: durationsFactor[1] * current.note.duration });
                while (newNote1.midiNote === newNote2.midiNote || newNote2.midiNote === lastNote.note.midiNote) {
                    this.automata.mutate()
                    newNote2 = current.note.copy({ value: current.chord.midiNotes[this.automata.leeDistance() % current.chord.midiNotes.length], duration: durationsFactor[1] * current.note.duration });
                }
                return [{ note: newNote1, chord: current.chord }, { note: newNote2, chord: current.chord }];
            } else {
                return [current];
            }
        });
        notes = notes.flatMap((current, index, array) => {
            if (Math.random() > 0.8) {
                const durations = this.rythmPatterns.get(2)!;
                const durationsFactor = durations[this.automata.leeDistance() % durations.length].shuffle();
                const newNote1 = current.note.copy({ duration: durationsFactor[0] * current.note.duration });
                const lastNote = array[(index + 1) % array.length];
                let newNote2 = current.note.copy({ value: current.chord.midiNotes[this.automata.leeDistance() % current.chord.midiNotes.length], duration: durationsFactor[1] * current.note.duration });
                while (newNote1.midiNote === newNote2.midiNote || newNote2.midiNote === lastNote.note.midiNote) {
                    this.automata.mutate()
                    newNote2 = current.note.copy({ value: current.chord.midiNotes[this.automata.leeDistance() % current.chord.midiNotes.length], duration: durationsFactor[1] * current.note.duration });
                }
                return [{ note: newNote1, chord: current.chord }, { note: newNote2, chord: current.chord }];
            } else {
                return [current];
            }
        });
        return notes;
    }

    private neightbourdTones(notes: Note[]) {
        const neightbourdTones: Note[] = [];
        notes.forEach(current => {
            if (Math.random() >= 0.8) {
                const value = current.midiNote;
                const nextValue = this.automata.leeDistance() % 2 === 0
                    ? this.scale.indexOf(value) > 0
                        ? this.scale[this.scale.indexOf(value) - 1]
                        : this.scale[this.scale.indexOf(value) + 1]
                    : this.scale.indexOf(value) < this.scale.length - 1
                        ? this.scale[this.scale.indexOf(value) + 1]
                        : this.scale[this.scale.indexOf(value) - 1];
                const durations = this.rythmPatterns.get(3)!;
                const durationsFactor = durations[this.automata.leeDistance() % durations.length].shuffle();
                const resultingGroup = [value, nextValue, value].map((value, index) => new Note({ value, duration: current.duration * durationsFactor[index] }));
                neightbourdTones.push(...resultingGroup);
            } else {
                neightbourdTones.push(current);
            }
        });
        return neightbourdTones;
    }

    private passingTones(neightbourdTones: Note[]) {
        const result: Note[] = [];
        for (let i = 0; i < neightbourdTones.length; i++) {
            let current = neightbourdTones[i];
            if (Math.random() >= 0.8) {
                const first = current;
                const second = neightbourdTones[(i + 1) % neightbourdTones.length];
                const scale = [...this.scale];
                if (first.midiNote === second.midiNote) {
                    result.push(first);
                } else if (first.midiNote < second.midiNote) {

                    const notesInBetween = scale.splice(scale.indexOf(first.midiNote), scale.indexOf(second.midiNote) - scale.indexOf(first.midiNote));
                    console.log(first.midiNote, second.midiNote, notesInBetween)
                    if (notesInBetween.length > 2 || notesInBetween.length === 0) {
                        result.push(first);
                    } else {
                        const durations = this.rythmPatterns.get(notesInBetween.length)!;
                        const durationsFactor = durations[this.automata.leeDistance() % durations.length].shuffle();
                        const availableDuration = first.duration
                        const resultingGroup = notesInBetween.map((value, index) => new Note({ value, duration: availableDuration * durationsFactor[index] }));
                        result.push(...resultingGroup);
                    }

                } else {
                    scale.reverse();
                    const notesInBetween = scale.splice(scale.indexOf(first.midiNote), scale.indexOf(second.midiNote) - scale.indexOf(first.midiNote));

                    if (notesInBetween.length > 2 || notesInBetween.length === 0) {
                        result.push(first);
                    } else {
                        const durations = this.rythmPatterns.get(notesInBetween.length)!;
                        const durationsFactor = durations[this.automata.leeDistance() % durations.length].shuffle();
                        const availableDuration = first.duration
                        const resultingGroup = notesInBetween.map((value, index) => new Note({ value, duration: availableDuration * durationsFactor[index] }));
                        result.push(...resultingGroup);
                    }
                }
            } else {
                result.push(current);
            }
        }
        return result;
    }
}