import { CellularAutomata1D } from '../../../cellular-automata/1d/cellularAutomata1D';
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

export namespace Operations {
    export function execute(operation: Operations, target: number[], notes: number[], automata: CellularAutomata1D): number[] {
        let result: number[] = []
        switch (operation) {
            case Operations.NEXT:
                target.push(automata.leeDistance())
                result = target
                break
            case Operations.PLUS:
                result = target.concat(target.map((value) => value + 1))
                break
            case Operations.MINUS:
                result = target.concat(target.map((value) => value - 1))
                break
            case Operations.MULTIPLY:
                result = target.concat(target.map((value) => value * 2))
                break
            case Operations.DIVIDE:
                result = target.concat(target.map((value) => Math.floor(value / 2)))
                break
            case Operations.REFLECTION:
                result = target.concat(target.reverse())
                break
            case Operations.REPEAT:
                result = target.concat(target)
                break
            case Operations.INVERSE:
                result = target.concat(target.map((value) => notes.length - value))
                break
        }
        return result.map((value) => value < 0 ? notes.length + value : value)
            .map((value) => value % notes.length)
    }
}

export const operations: Operations[] = [Operations.NEXT, Operations.PLUS, Operations.MINUS, Operations.MULTIPLY, Operations.DIVIDE, Operations.INVERSE, Operations.REPEAT]

export function execute(operation: Operations, target: number[], automata: CellularAutomata1D): number[] {
    switch (operation) {
        case Operations.NEXT:
            target.push(automata.leeDistance())
            return target
        case Operations.PLUS:
            return target.concat(target.map((value) => value + 1))
        case Operations.MINUS:
            return target.concat(target.map((value) => value - 1))
        case Operations.MULTIPLY:
            return target.concat(target.map((value) => value * 2))
        case Operations.DIVIDE:
            return target.concat(target.map((value) => Math.floor(value / 2)))
        case Operations.REFLECTION:
            return target.concat(target.reverse())
        case Operations.REPEAT:
            return target.concat(target)
        case Operations.INVERSE:
            return target.concat(target.map((value) => 2 - value))
    }
}

export const mutations: number[][] = [
    [0, 1, 2, 1, 0, 1, 2, 1],
    [0, 1, 1, 2, 2, 1, 1, 0],
    [2, 1, 0, 1, 2, 1, 0, 1],
    [1, 2, 1, 0, 0, 1, 2, 1],
    [1, 1, 2, 1, 2, 1, 1, 2],
    [1, 2, 1, 2, 1, 2, 1, 2],
    [2, 1, 2, 1, 2, 1, 2, 1],
    [2, 1, 1, 2, 1, 2, 1, 2],
    [1, 2, 2, 1, 1, 2, 2, 1],
    [1, 2, 1, 2, 2, 1, 2, 1],
    [2, 1, 2, 1, 1, 2, 1, 2],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 1, 1, 2, 2, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0],
    [2, 2, 1, 1, 0, 0, 1, 1],
    [1, 1, 2, 2, 1, 1, 2, 2],
    [0, 0, 1, 1, 1, 1, 2, 2],
    [1, 1, 2, 2, 2, 2, 0, 0],
    [2, 2, 0, 0, 0, 0, 1, 1],
    [2, 2, 1, 1, 2, 2, 1, 1],
    [1, 1, 0, 0, 2, 2, 1, 1],
    [1, 1, 2, 2, 0, 0, 1, 1],
    [0, 0, 1, 1, 2, 2, 2, 2],
    [2, 2, 1, 1, 1, 1, 0, 0],
    [0, 0, 2, 2, 1, 1, 2, 2],
    [2, 2, 0, 0, 2, 2, 0, 0],
    [1, 1, 2, 2, 0, 0, 2, 2],
    [0, 0, 2, 2, 2, 2, 1, 1],
    [0, 2, 0, 2, 1, 2, 1, 2],
    [1, 2, 1, 2, 2, 1, 2, 0],
    [2, 0, 2, 0, 2, 0, 2, 1],
    [2, 1, 2, 1, 2, 1, 2, 2],
    [2, 2, 2, 2, 1, 1, 0, 0],
    [0, 0, 0, 0, 2, 2, 2, 2],
    [1, 1, 1, 1, 0, 0, 0, 0],
    [2, 0, 2, 1, 2, 1, 2, 0],
    [2, 1, 2, 0, 2, 0, 2, 1],
    [2, 2, 0, 1, 2, 1, 2, 2],
    [2, 2, 2, 0, 2, 1, 2, 2],
    [2, 2, 2, 1, 2, 0, 2, 2],
    [2, 2, 2, 2, 2, 1, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 2, 0, 0, 2, 1, 0],
    [0, 2, 0, 1, 1, 0, 2, 0],
    [1, 0, 2, 1, 1, 2, 0, 1],
    [1, 2, 0, 2, 2, 0, 2, 1],
]
