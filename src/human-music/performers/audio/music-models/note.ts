export class Note {
   readonly value!: number;
   readonly duration: number = 0;
   readonly allowRepeat!: boolean;
   private currentDuration: number;


   constructor({ value = 0, duration = 0, allowRepeat = false }) {
      this.value = value;
      this.duration = duration;
      this.allowRepeat = allowRepeat;
      this.currentDuration = duration;
   }

   copy({ value = this.value, duration = this.duration, allowRepeat = this.allowRepeat }): Note {
      return new Note({ value, duration, allowRepeat });
   }

   tick = () => this.currentDuration--;

   isFinished = () => this.currentDuration <= 0;
}
