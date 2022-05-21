import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D";
import { } from '../../utils/extensions';
import { ChordVoice } from "./music-models/chord-voice";
import { Music } from "./music-models/music";
import { Voice } from "./music-models/voice";

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
      withAutomata(automata: CellularAutomata1D) {
         this.automata = automata
         return this
      }

      build() {
         if (this.automata === null) {
            throw new Error("Must pass a cellular automata upon building")
         }
         return new Player(new Music(this.automata!, [new Voice(0, 4, 36), new Voice(1, 5, 48)], new ChordVoice(2, 4, 12)))
      }
   }
}
