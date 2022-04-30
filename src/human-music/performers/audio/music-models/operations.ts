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
                if (Math.random() > 0.9) {
                    console.log("TRIPLET")
                    target.push(automata.leeDistance(), NaN, NaN, NaN)
                    automata.evolve()
                    target.push(automata.leeDistance(), NaN, NaN, NaN)
                    automata.evolve()
                    target.push(automata.leeDistance(), NaN, NaN, NaN)
                } else if (Math.random() > 0.9) {
                    console.log("HALF")
                    target.push(automata.leeDistance(), NaN, NaN, NaN, NaN, NaN)
                    automata.evolve()
                    target.push(automata.leeDistance(), NaN, NaN, NaN, NaN, NaN)
                } else if (Math.random() > 0.9) {
                    console.log("HALF 2")
                    target.push(automata.leeDistance(), NaN, NaN)
                    automata.evolve()
                    target.push(automata.leeDistance(), NaN, NaN)
                    automata.evolve()
                    target.push(automata.leeDistance(), NaN, NaN, NaN, NaN, NaN)
                } else if (Math.random() > 0.9) {
                    console.log("HALF 3")
                    target.push(automata.leeDistance(), NaN, NaN, NaN, NaN, NaN)
                    automata.evolve()
                    target.push(automata.leeDistance(), NaN, NaN)
                    automata.evolve()
                    target.push(automata.leeDistance(), NaN, NaN)
                } else if (Math.random() > 0.9) {
                    console.log("HALF 5")
                    target.push(automata.leeDistance(), NaN, NaN)
                    automata.evolve()
                    target.push(automata.leeDistance(), NaN, NaN)
                    automata.evolve()
                    target.push(automata.leeDistance(), NaN, NaN)
                    automata.evolve()
                    target.push(automata.leeDistance(), NaN, NaN)
                }
                else {
                    console.log("SIMPLE")
                    target.push(automata.leeDistance(), NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN)
                }
                result = target
                break
            case Operations.PLUS:
                console.log("PLUS")
                result = target.concat(target.map((value) => value + 1))
                break
            case Operations.MINUS:
                console.log("MINUS")
                result = target.concat(target.map((value) => value - 1))
                break
            case Operations.MULTIPLY:
                console.log("MULTIPLY")
                result = target.concat(target.map((value) => value * 2))
                break
            case Operations.DIVIDE:
                console.log("DIVIDE")
                result = target.concat(target.map((value) => Math.floor(value / 2)))
                break
            case Operations.REFLECTION:
                console.log("REFLECTION")
                result = target.concat(target.reverse())
                break
            case Operations.REPEAT:
                console.log("REPEAT")
                result = target.concat(target)
                break
            case Operations.INVERSE:
                console.log("INVERSE")
                result = target.concat(target.map((value) => notes.length - value - 1))
                break
        }
        return result.map((value) => value < 0 ? notes.length + value : value)
            .map((value) => value % notes.length)
    }
}

export const operations: Operations[] = [Operations.NEXT, Operations.NEXT, Operations.NEXT, Operations.NEXT, Operations.NEXT, Operations.PLUS, Operations.MINUS, Operations.MULTIPLY, Operations.DIVIDE, Operations.INVERSE, Operations.REPEAT]

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
