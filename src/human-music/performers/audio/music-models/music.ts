import { CellularAutomata1D } from "../../../cellular-automata/1d/cellularAutomata1D";
import { ChordsGenerator } from "../notes-generator";
import { ChordVoice } from "./chord-voice";
import { DurationTransformation, PitchTransformation } from './transformations';
import { Voice } from "./voice";


export class Music {
   private durationTransformation: DurationTransformation;
   private pitchTransformation: PitchTransformation;
   private chordsGenerator: ChordsGenerator;
   private pulseDuration: number = 12;
   private pulsesInBeat: number = 6;
   private beatDuration: number = this.pulseDuration * this.pulsesInBeat;
   private currentBeat: number = 0;
   private automata: CellularAutomata1D;

   readonly voices: Voice[];
   readonly chordVoice: ChordVoice;

   constructor(automata: CellularAutomata1D, voices: Voice[], chordVoice: ChordVoice) {
      this.voices = voices;
      this.chordVoice = chordVoice;
      this.automata = automata;
      this.durationTransformation = new DurationTransformation(automata);
      this.pitchTransformation = new PitchTransformation(automata);
      this.chordsGenerator = new ChordsGenerator(automata, this.beatDuration);
   }

   play() {
      this.chordsGenerator.tick();

      if (this.beatFinished) {
         if (this.chordsGenerator.progressionFinished || this.currentBeat === 0) {
            this.automata.mutate();
            this.durationTransformation.restore();
            this.pitchTransformation.restore();

            this.voices.forEach((voice) => {
               this.durationTransformation.mutate(voice);
               this.pitchTransformation.mutate(voice);
            });
         }
         this.chordVoice.play(this.chordsGenerator.chordFor(this.chordVoice), this.chordVoice.attack);
      }

      this.voices.forEach((voice) => {
         voice.play(this.chordsGenerator.noteFor(voice), voice.attack);
         voice.tick();
      });

      this.currentBeat++;
   }


   private get beatFinished(): boolean {
      return this.currentBeat % this.beatDuration === 0;
   }

   release() {
      this.voices.forEach((voice) => voice.stop());
   }
}
