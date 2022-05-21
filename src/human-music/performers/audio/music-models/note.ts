export class Note {
   readonly value!: number;
   readonly duration: number = 0;
   private currentDuration: number;


   constructor({ value = 0, duration = 0 }) {
      this.value = value;
      this.duration = duration;
      this.currentDuration = duration;
   }

   copy({ value = this.value, duration = this.duration }): Note {
      return new Note({ value, duration });
   }

   tick = () => this.currentDuration--;

   isFinished = () => this.currentDuration <= 0;
}
