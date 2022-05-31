export class Note {
   readonly midiNote!: number;
   readonly duration: number = 0;
   private currentDuration: number;

   constructor({ value, duration } = { value: 0, duration: 0 }) {
      this.midiNote = value;
      this.duration = duration;
      this.currentDuration = duration;
   }

   copy = ({ value = this.midiNote, duration = this.duration } = { value: this.midiNote, duration: this.duration }) => new Note({ value, duration })
   tick = () => this.currentDuration--
   isFinished = () => this.currentDuration <= 0
}
