import { CellularAutomata1D } from "../../../cellular-automata/1d/cellularAutomata1D";
import { MelodiesGenerator } from "../tools/melodies-generator";
import { VoiceTransformation } from '../tools/music-transformation';
import { ChordsGenerator } from "../tools/notes-generator";
import { ChordVoice } from "./chord-voice";
import { Voice } from "./voice";

export class Music {
   private voiceTransformation: VoiceTransformation;
   private chordsGenerator: ChordsGenerator;
   private pulseDuration: number = 1;
   private pulsesInBeat: number = 48;
   private beatDuration: number = this.pulseDuration * this.pulsesInBeat;
   private currentBeat: number = 0;
   private automata: CellularAutomata1D;

   readonly voices: Voice[];
   readonly chordVoice: ChordVoice;

   constructor(automata: CellularAutomata1D, voices: Voice[], chordVoice: ChordVoice) {
      this.voices = voices;
      this.chordVoice = chordVoice;
      this.automata = automata;
      this.voiceTransformation = new VoiceTransformation(
         automata,
         new MelodiesGenerator(this.automata, this.beatDuration).generateMelodies()
      );
      this.chordsGenerator = new ChordsGenerator(this.automata, this.beatDuration);
   }

   play() {
      this.chordsGenerator.tick();

      if (this.beatFinished) {
         if (this.chordsGenerator.progressionFinished) {
            this.voiceTransformation.transform(this.voices)
         }
         this.voiceTransformation.mutate(this.voices)
         this.chordVoice.play(this.chordsGenerator.chordFor(this.chordVoice), this.chordVoice.attack)
      }

      this.voices.filter(voice => voice.isFinished).forEach(voice => console.log("---"))
      this.voices.filter(voice => voice.isFinished).forEach(voice => voice.play(this.chordsGenerator.noteFor(voice), voice.attack))
      this.voices.forEach(voice => voice.tick())

      this.currentBeat++
   }


   private get beatFinished(): boolean {
      return this.currentBeat % this.beatDuration === 0
   }

   release() {
      this.voices.forEach((voice) => voice.stop())
   }
}
