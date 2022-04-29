export class Note {
   readonly value!: number;
   duration!: number;

   constructor(value: number, duration: number) {
      this.value = value;
      this.duration = duration;
   }

   tick = () => this.duration--;

   isFinished = () => this.duration <= 0;
}
