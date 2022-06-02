export class Chord {
   readonly label: string
   readonly midiNotes: number[]
   readonly duration: number
   private currentDuration: number;

   constructor({ notes, duration, label } = { notes: [] as number[], duration: 0, label: "" }) {
      this.midiNotes = notes
      this.duration = duration
      this.label = label
      this.currentDuration = duration
   }

   copy = ({ notes = this.midiNotes, duration = this.duration, label = this.label } = { notes: this.midiNotes, duration: this.duration, label: this.label }) => new Chord({ notes, duration, label })
   tick = () => this.currentDuration--
   isFinished = () => this.currentDuration <= 0
}

export namespace Chord {
   export function inversion({ chord, previousChord, defaultInversion }: { chord: Chord; previousChord: Chord | undefined; defaultInversion: number }): Chord {
      let inversions = []
      for (let inversion = 0; inversion < chord.midiNotes.length; inversion++) {
         inversions.push(chord.midiNotes.map((note, index) => (index < inversion ? note + 12 : note))
            .map((note, _, notes) => notes.every(n => n >= 12) ? note - 12 : note)
            .sort((a, b) => a - b))
      }

      if (previousChord) {
         inversions = inversions
            .sort((first, second) => first.distance(previousChord.midiNotes) - second.distance(previousChord.midiNotes))
            .filter(inversion => inversion.distance(previousChord.midiNotes) !== 0)

         const notes: number[] = (inversions[0].hasDuplicates() ? inversions[1] : inversions[0])
            .sort((a, b) => a - b)
         //.apply(notes => notes.push(notes[0] + 12))

         return chord.copy({ notes: notes.sort((a, b) => a - b) })
      }

      const notes: number[] = inversions[defaultInversion]
         .sort((a, b) => a - b)
      //.apply(notes => notes.push(notes[0] + 12))

      return chord.copy({ notes: notes.sort((a, b) => a - b) })
   }
}
