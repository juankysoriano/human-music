import { convertToTree, progressions_list } from './progressions';

export class Chord {
   readonly notes: number[]
   readonly label: string

   constructor({ notes, label }: { notes: number[]; label: string }) {
      this.notes = notes
      this.label = label
   }

   get isTriad(): boolean {
      return this.notes.length === 3
   }
}

export namespace Chord {
   export function inversion({ chord, previousChord, defaultInversion }: { chord: Chord; previousChord: Chord | undefined; defaultInversion: number }): Chord {
      let inversions = []
      for (let inversion = 0; inversion < chord.notes.length; inversion++) {
         inversions.push(chord.notes.map((note, index) => (index < inversion ? note + 12 : note))
            .map((note, _, notes) => notes.every(n => n >= 12) ? note - 12 : note)
            .sort((a, b) => a - b))
      }

      if (previousChord) {
         inversions = inversions
            .sort((first, second) => first.distance(previousChord.notes) - second.distance(previousChord.notes))
            .filter(inversion => inversion.distance(previousChord.notes) !== 0)
         return new Chord({
            notes: (inversions[0].hasDuplicates() ? inversions[1] : inversions[0]).sort((a, b) => a - b),
            label: chord.label
         })
      } else {
         return new Chord({
            notes: inversions[defaultInversion].sort((a, b) => a - b),
            label: chord.label
         })
      }
   }
}

export const progressions = convertToTree(progressions_list)

