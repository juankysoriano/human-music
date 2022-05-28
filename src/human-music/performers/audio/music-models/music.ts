import { CellularAutomata1D } from "../../../cellular-automata/1d/cellularAutomata1D";
import { MelodiesGenerator } from "../tools/melodies-generator";
import { ProgressionGenerator } from '../tools/progressions-generator';
import { ChordVoice } from "./chord-voice";
import { Voice } from "./voice";

export class Music {
   private pulseDuration: number = 144
   private pulsesInBeat: number = 4
   private beatDuration: number = this.pulseDuration * this.pulsesInBeat;

   readonly voices: Voice[];
   readonly chordVoice: ChordVoice;

   constructor(automata: CellularAutomata1D, voices: Voice[], chordVoice: ChordVoice) {
      this.voices = voices;
      this.chordVoice = chordVoice;

      const progression = new ProgressionGenerator(automata, this.beatDuration).generateProgression()
      const melody = new MelodiesGenerator(automata, this.beatDuration, progression.chords, progression.scale).generateMelody()

      this.chordVoice.changeChords(progression.chords)
      this.voices.forEach(voice => voice.changeMelody(melody))
   }

   play() {
      this.chordVoice.play({ attack: 24 })
      this.voices.forEach(voice => voice.play({ attack: 48 }))
   }

   release() {
      this.chordVoice.stop()
      this.voices.forEach((voice) => voice.stop())
   }
}
