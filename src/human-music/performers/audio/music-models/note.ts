export class Note {
   readonly value!: number;
   readonly duration: number = 0;
   readonly allowExtension!: boolean;
   private currentDuration: number;


   constructor({ value = 0, duration = 0, allowExtension = true }) {
      this.value = value;
      this.duration = duration;
      this.allowExtension = allowExtension;
      this.currentDuration = duration;
   }

   copy({ value = this.value, duration = this.duration, allowExtension = this.allowExtension }): Note {
      return new Note({ value, duration, allowExtension });
   }

   tick = () => this.currentDuration--;

   isFinished = () => this.currentDuration <= 0;
}
