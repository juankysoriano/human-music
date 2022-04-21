import { CellularAutomata1D, leeDistance } from "./cellularAutomata1D"

export class TotalisticCellularAutomata1D implements CellularAutomata1D {
   readonly states: number
   readonly size: number
   readonly radius: number
   readonly rule: number
   private _state: number[]
   private originalState: number[]
   private tempState: number[]
   private neighbourhoodCode: number[]
   private lookupTable: number[]

   constructor(states: number, size: number, radius: number, rule: number, initialState: number[], lookupTable: number[]) {
      this.states = states
      this.size = size
      this.radius = radius
      this.rule = rule
      this._state = [...initialState]
      this.originalState = [...initialState]
      this.lookupTable = lookupTable
      this.tempState = Array.from({ length: size })
      this.neighbourhoodCode = Array.from({ length: size })
   }

   get state(): ReadonlyArray<number> {
      return this._state
   }

   get previousState(): readonly number[] {
      return this.tempState
   }

   evolve() {
      this.state.forEach((_, index) => {
         this.evolveCellAt(index)
      })
      const stateSave = this.tempState
      this.tempState = this._state
      this._state = stateSave
   }

   private evolveCellAt(index: number) {
      const code = this.lookupTable.length - this.computeCodeFor(index) - 1
      this.tempState[index] = code >= 0 ? this.lookupTable[code] : 0
   }

   private computeCodeFor(index: number) {
      let lookUpIndex: number
      const numberOfInvolvedCells = 2 * this.radius + 1 - this.radius
      let code = 0
      if (index === 0) {
         for (let i = -this.radius; i < numberOfInvolvedCells; i++) {
            lookUpIndex = this.wrappedIndex(i)
            code += this._state[lookUpIndex]
         }
      } else {
         lookUpIndex = this.wrappedIndex(index - this.radius - 1)
         const offsetA = this._state[lookUpIndex]
         lookUpIndex = this.wrappedIndex(index + this.radius)
         const offsetB = this._state[lookUpIndex]
         code = this.neighbourhoodCode[index - 1] - offsetA + offsetB
      }
      this.neighbourhoodCode[index] = code
      return code
   }

   private wrappedIndex(index: number) {
      return index < 0 ? index + this.size : index >= this.size ? index - this.size : index
   }

   reset() {
      this._state = [...this.originalState]
   }

   mutate() {
      for (let i = 0; i < this.size; i++) {
         this._state[i] = Math.round(Math.random() * this.states)
      }
   }

   leeDistance(): number {
      return leeDistance(this)
   }
}
