import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D";
import { ChordVoice, Music, Voice } from './music-models';
export class Player {
   private music: Music
   constructor(music: Music) {
      this.music = music
   }

   play() {
      this.music.play()
   }

   stop() {
      this.music.release()
   }

   static Builder = class {
      private automata?: CellularAutomata1D

      private chords = [
         [
            [0, 4, 7],
            [2, 5, 9],
            [4, 7, 11],
            [5, 9, 12],
            [7, 11, 14],
            [9, 12, 16],
            [0, 4, 7, 11],
            [2, 5, 9, 12],
            [4, 7, 11, 14],
            [5, 9, 12, 16],
            [7, 11, 14, 17],
            [9, 12, 16, 19],
         ], //mayor
         [
            [0, 3, 7],
            [2, 5, 8],
            [3, 7, 10],
            [5, 8, 12],
            [7, 10, 14],
            [8, 12, 15],
            [0, 3, 7, 10],
            [2, 5, 8, 12],
            [3, 7, 10, 14],
            [5, 8, 12, 15],
            [7, 10, 14, 17],
            [8, 12, 15, 19],
         ], //minor
         [
            [0, 3, 7],
            [2, 5, 9],
            [3, 7, 10],
            [5, 9, 12],
            [7, 10, 14],
            [9, 12, 15],
            [0, 3, 7, 10],
            [2, 5, 9, 12],
            [3, 7, 10, 14],
            [5, 9, 12, 15],
            [7, 10, 14, 17],
            [9, 12, 15, 19],
         ], //doryan
         [
            [0, 3, 7],
            [1, 5, 8],
            [3, 7, 10],
            [5, 8, 12],
            [7, 10, 13],
            [8, 12, 15],
            [0, 3, 7, 10],
            [1, 5, 8, 12],
            [3, 7, 10, 13],
            [5, 8, 12, 15],
            [7, 10, 13, 17],
            [8, 12, 15, 19],
         ], //phygrian
         [
            [0, 4, 7],
            [2, 6, 9],
            [4, 7, 11],
            [6, 9, 12],
            [7, 11, 14],
            [9, 12, 16],
            [0, 4, 7, 11],
            [2, 6, 9, 12],
            [4, 7, 11, 14],
            [6, 9, 12, 16],
            [7, 11, 14, 18],
            [9, 12, 16, 19],
         ], //lydian
         [
            [0, 4, 7],
            [2, 5, 9],
            [4, 7, 10],
            [5, 9, 12],
            [7, 10, 14],
            [9, 12, 16],
            [0, 4, 7, 10],
            [2, 5, 9, 12],
            [4, 7, 10, 14],
            [5, 9, 12, 16],
            [7, 10, 14, 17],
            [9, 12, 16, 19],
         ], //mixolydian
         [
            [0, 3, 6],
            [1, 5, 8],
            [3, 6, 10],
            [5, 8, 12],
            [6, 10, 13],
            [8, 12, 15],
            [0, 3, 6, 10],
            [1, 5, 8, 12],
            [3, 6, 10, 13],
            [5, 8, 12, 15],
            [6, 10, 13, 17],
            [8, 12, 15, 18],
         ], //locrian
         [
            [0, 4, 9],
            [2, 7, 12],
            [4, 9, 14],
            [7, 12, 16],
            [9, 14, 19],
            [0, 4, 9, 14],
            [2, 7, 12, 16],
            [4, 9, 14, 19],
            [7, 12, 16, 21],
            [9, 14, 19, 24],
         ], //pentatonic
         [
            [0, 5, 10],
            [3, 7, 12],
            [5, 10, 15],
            [7, 12, 17],
            [10, 15, 19],
            [0, 5, 10, 15],
            [3, 7, 12, 17],
            [5, 10, 15, 19],
            [7, 12, 17, 22],
            [10, 15, 19, 24],
         ], //minor pentatonic
         [
            [0, 5, 7],
            [3, 6, 10],
            [5, 7, 12],
            [6, 10, 15],
            [7, 12, 17],
            [0, 5, 7, 12],
            [3, 6, 10, 15],
            [5, 7, 12, 17],
            [6, 10, 15, 18],
            [7, 12, 17, 19],
         ], //blues
         [
            [0, 4, 8],
            [1, 6, 10],
            [4, 8, 11],
            [6, 10, 12],
            [8, 11, 13],
            [10, 12, 16],
            [0, 4, 8, 11],
            [1, 6, 10, 12],
            [4, 8, 11, 13],
            [6, 10, 12, 16],
            [8, 11, 13, 18],
            [10, 12, 16, 20],
         ], //enigmatic
         [
            [0, 4, 7],
            [1, 5, 8],
            [4, 7, 11],
            [5, 8, 12],
            [7, 11, 13],
            [8, 12, 16],
            [0, 4, 7, 11],
            [1, 5, 8, 12],
            [4, 7, 11, 13],
            [5, 8, 12, 16],
            [7, 11, 13, 17],
            [8, 12, 16, 19],
         ], //flamenco
         [
            [0, 3, 7],
            [2, 6, 8],
            [3, 7, 11],
            [6, 8, 12],
            [7, 11, 14],
            [8, 12, 15],
            [11, 14, 17],
            [12, 15, 19],
            [14, 17, 20],
            [0, 3, 7, 11],
            [2, 6, 8, 12],
            [3, 7, 11, 14],
            [6, 8, 12, 15],
            [7, 11, 14, 17],
            [8, 12, 15, 19],
            [11, 14, 17, 20],
            [12, 15, 19, 23],
            [14, 17, 20, 24],
         ], //algerian
         [
            [0, 6, 11],
            [4, 7, 12],
            [6, 11, 16],
            [7, 12, 18],
            [0, 6, 11, 16],
            [4, 7, 12, 18],
            [6, 11, 16, 19],
            [7, 12, 18, 23],
         ], //hirajoshi
      ]

      withAutomata(automata: CellularAutomata1D) {
         this.automata = automata
         return this
      }

      build() {
         if (this.automata === null) {
            throw new Error("Must pass a cellular automata upon building")
         }
         return new Player(new Music(this.automata!, [new Voice(0, 3, 24), new Voice(1, 5, 64)], new ChordVoice(2, 4, 32)))
      }
   }
}
