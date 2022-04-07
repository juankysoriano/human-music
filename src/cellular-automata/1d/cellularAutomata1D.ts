export interface CellularAutomata1D {
    readonly states: number
    readonly radius: number
    readonly size: number
    readonly rule: number
    get state(): ReadonlyArray<number>
    get previousState(): ReadonlyArray<number>
    evolve(): void
}