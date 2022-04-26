export enum Operations {
    NEXT,
    PLUS,
    MINUS,
    MULTIPLY,
    DIVIDE,
    REFLECTION,
    INVERSE,
    REPEAT
}
export const patterns: number[][] = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]
export const operations: Operations[] = [Operations.NEXT, Operations.PLUS, Operations.MINUS, Operations.MULTIPLY, Operations.DIVIDE, Operations.INVERSE, Operations.REPEAT]