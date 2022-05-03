import { CellularAutomata1D } from "../../../cellular-automata/1d/cellularAutomata1D";
import { ChordsGenerator } from "../notes-generator";
import { ChordVoice } from "./chord-voice";
import { Note } from "./note";
import { rythmFor } from './rythm';
import { PitchTransformation, RythmTransformation } from './transformations';
import { Voice } from "./voice";


export class Music {
   private rythmTransformation: RythmTransformation;
   private pitchTransformation: PitchTransformation;
   private chordsGenerator: ChordsGenerator;
   private pulseDuration: number = 1;
   private pulsesInBeat: number = 48;
   private beatDuration: number = this.pulseDuration * this.pulsesInBeat;
   private currentBeat: number = 0;
   private automata: CellularAutomata1D;
   private rythms: Note[][];

   readonly voices: Voice[];
   readonly chordVoice: ChordVoice;

   constructor(automata: CellularAutomata1D, voices: Voice[], chordVoice: ChordVoice) {
      this.voices = voices;
      this.chordVoice = chordVoice;
      this.automata = automata;
      this.rythms = rythmFor(this.automata!, 48)
      this.rythmTransformation = new RythmTransformation(automata, this.rythms);
      this.pitchTransformation = new PitchTransformation(automata);
      this.chordsGenerator = new ChordsGenerator(automata, this.beatDuration);
   }

   play() {
      this.chordsGenerator.tick();

      if (this.beatFinished) {
         if (this.chordsGenerator.progressionFinished || this.currentBeat === 0) {
            this.automata.mutate();
            this.rythmTransformation.restore();
            this.pitchTransformation.restore();

            this.voices.forEach((voice) => {
               voice.stop()
               this.rythmTransformation.transform(voice);
               this.pitchTransformation.transform(voice);
            });
         }
         this.rythmTransformation.mutate()

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
