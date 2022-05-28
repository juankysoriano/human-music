import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
import { Chord } from '../music-models/chord';
import { Note } from '../music-models/note';

export class MelodiesGenerator {
    private rythmPatterns: Map<number, number[][]> = [
        [1],
        //[3 / 4, 1 / 4],
        [1 / 2, 1 / 2],
        //[2 / 4, 1 / 4, 1 / 4],
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
        switch (random) {
            case 0:
                console.log("a,a,b,a")
                console.log([a, a, b, a])
                return [a, a, b, a].flat()
            case 1:
                console.log("a,b,a,a")
                console.log([a, b, a, a])
                return [a, b, a, a].flat()
            case 2:
                console.log("a,b,a,c")
                console.log([a, b, a, c])
                return [a, b, a, c].flat()
            case 3:
                console.log("a,b")
                console.log([a, b].flat())
                return [a, b].flat()
            case 4:
                console.log("a,b,b,a")
                console.log([a, b, b, a])
                return [a, b, b, a].flat()
            case 5:
                console.log("a,b,c,a")
                console.log([a, b, c, a])
                return [a, b, c, a].flat()
            case 6:
                console.log("a,b,c,b")
                console.log([a, b, c, b])
                return [a, b, a, b, c, b].flat()
            default:
                console.log("a,b,c,d")
                console.log([a, b, c, d].flat())
                return [a, b, c, d].flat()
        }
    }

    private melodyStep(): Note[] {
        let notes: { note: Note, chord: Chord }[] = []
        this.chords.forEach(chord => {
            notes.push({ note: new Note({ value: chord.midiNotes[this.automata.leeDistance() % chord.midiNotes.length], duration: this.beatDuration }), chord })
        })

        //divisions
        notes = notes.flatMap((current) => {
            if (this.automata.leeDistance() % 2 === 0) {
                const durations = this.rythmPatterns.get(2)!
                const durationsFactor = durations[this.automata.leeDistance() % durations.length].shuffle()
                const newNote1 = current.note.copy({ duration: durationsFactor[0] * current.note.duration })
                const newNote2 = current.note.copy({ value: current.chord.midiNotes[this.automata.leeDistance() % current.chord.midiNotes.length], duration: durationsFactor[1] * current.note.duration })
                if (newNote1.midiNote !== newNote2.midiNote) {
                    return [{ note: newNote1, chord: current.chord }, { note: newNote2, chord: current.chord }]
                } else {
                    return [current]
                }
            } else {
                return [current]
            }
        })
        this.automata.mutate()

        notes = notes.flatMap((current) => {
            if (this.automata.leeDistance() % 3 === 0) {
                const durations = this.rythmPatterns.get(2)!
                const durationsFactor = durations[this.automata.leeDistance() % durations.length].shuffle()
                const newNote1 = current.note.copy({ duration: durationsFactor[0] * current.note.duration })
                const newNote2 = current.note.copy({ value: current.chord.midiNotes[this.automata.leeDistance() % current.chord.midiNotes.length], duration: durationsFactor[1] * current.note.duration })
                if (newNote1.midiNote !== newNote2.midiNote) {
                    return [{ note: newNote1, chord: current.chord }, { note: newNote2, chord: current.chord }]
                } else {
                    return [current]
                }
            } else {
                return [current]
            }
        })

        // notes = notes.flatMap((current) => {
        //     if (Math.random() > 0.2) {
        //         const durations = this.rythmPatterns.get(2)!
        //         const durationsFactor = durations[Math.floor(Math.random() * durations.length)].shuffle()
        //         const newNote1 = current.note.copy({ duration: durationsFactor[0] * current.note.duration })
        //         const newNote2 = current.note.copy({ value: current.chord.notes[Math.floor(Math.random() * current.chord.notes.length)], duration: durationsFactor[1] * current.note.duration })
        //         if (newNote1.value !== newNote2.value) {
        //             return [{ note: newNote1, chord: current.chord }, { note: newNote2, chord: current.chord }]
        //         } else {
        //             return [current]
        //         }
        //     } else {
        //         return [current]
        //     }
        // })
        // notes = notes.flatMap((current) => {
        //     if (Math.random() > 0.4) {
        //         const durations = this.rythmPatterns.get(2)!
        //         const durationsFactor = durations[Math.floor(Math.random() * durations.length)].shuffle()
        //         const newNote1 = current.note.copy({ duration: durationsFactor[0] * current.note.duration })
        //         const newNote2 = current.note.copy({ value: current.chord.notes[Math.floor(Math.random() * current.chord.notes.length)], duration: durationsFactor[1] * current.note.duration })
        //         if (newNote1.value !== newNote2.value) {
        //             return [{ note: newNote1, chord: current.chord }, { note: newNote2, chord: current.chord }]
        //         } else {
        //             return [current]
        //         }
        //     } else {
        //         return [current]
        //     }
        // })
        this.automata.mutate()
        const floritures: Note[] = []
        notes.forEach(current => {
            if (this.automata.leeDistance() % 2 === 0) {
                const value = current.note.midiNote
                const nextValue = this.automata.leeDistance() % 2 === 0
                    ? this.scale.indexOf(value) > 0
                        ? this.scale[this.scale.indexOf(value) - 1]
                        : this.scale[this.scale.indexOf(value) + 1]
                    : this.scale.indexOf(value) < this.scale.length - 1
                        ? this.scale[this.scale.indexOf(value) + 1]
                        : this.scale[this.scale.indexOf(value) - 1]
                const durations = this.rythmPatterns.get(3)!
                const durationsFactor = durations[this.automata.leeDistance() % durations.length].shuffle()
                const resultingGroup = [value, nextValue, value].map((value, index) => new Note({ value, duration: current.note.duration * durationsFactor[index] }))
                floritures.push(...resultingGroup)
            } else {
                floritures.push(current.note)
            }
        })
        this.automata.mutate()
        // passing tones
        const result: Note[] = []
        floritures.forEach((current, index, array) => {
            if (this.automata.leeDistance() % 2 === 0) {
                const first = current
                const second = array[(index + 1) % array.length]
                const scale = [...this.scale]
                if (first.midiNote === second.midiNote) {
                    result.push(first)
                } else if (first.midiNote < second.midiNote) {

                    const notesInBetween = scale.splice(scale.indexOf(first.midiNote), scale.indexOf(second.midiNote) - scale.indexOf(first.midiNote))

                    if (notesInBetween.length > 4 || notesInBetween.length === 0) {
                        result.push(first)
                    } else {
                        const durations = this.rythmPatterns.get(notesInBetween.length)!
                        const durationsFactor = durations[this.automata.leeDistance() % durations.length].shuffle()
                        const availableDuration = first.duration
                        const resultingGroup = notesInBetween.map((value, index) => new Note({ value, duration: availableDuration * durationsFactor[index] }))
                        result.push(...resultingGroup)
                    }

                } else {
                    scale.reverse()
                    const notesInBetween = scale.splice(scale.indexOf(first.midiNote), scale.indexOf(second.midiNote) - scale.indexOf(first.midiNote))

                    if (notesInBetween.length > 4 || notesInBetween.length === 0) {
                        result.push(first)
                    } else {
                        const durations = this.rythmPatterns.get(notesInBetween.length)!
                        const durationsFactor = durations[this.automata.leeDistance() % durations.length].shuffle()
                        const availableDuration = first.duration
                        const resultingGroup = notesInBetween.map((value, index) => new Note({ value, duration: availableDuration * durationsFactor[index] }))
                        result.push(...resultingGroup)
                    }
                }
            } else {
                result.push(current)
            }
        })
        this.automata.mutate()

        console.log(result)

        return result
    }
}