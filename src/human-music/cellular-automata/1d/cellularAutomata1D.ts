export interface CellularAutomata1D {
   readonly states: number
   readonly radius: number
   readonly size: number
   readonly rule: number
   get state(): ReadonlyArray<number>
   get previousState(): ReadonlyArray<number>
   evolve(): void
   leeDistance(): number
   reset(): void
}

export const leeDistance = (automata: CellularAutomata1D): number =>
   automata.state.reduce((acc, _, index) => {
      const euclideanDistance = Math.abs(automata.state[index] - automata.previousState[index])
      const leeDistance = automata.state[index] > 0 && euclideanDistance > 0 ? Math.min(euclideanDistance, automata.states - euclideanDistance) : 0
      return acc + leeDistance
   }, 0)
