export interface CellularAutomata1D {
    readonly radius: any;
    readonly size: number;
    readonly rule: number;
    get state(): ReadonlyArray<number>;
    evolve(): void;
}