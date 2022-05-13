import { ElementaryCellularAutomata1D } from "./1d/elementaryCellularAutomata1D"
import { TotalisticCellularAutomata1D } from "./1d/totalisticCellularAutomata1D"

export enum Dimensions {
   UNIDIMENSIONAL,
   BIDIMENSIONAL,
}

export enum Type {
   TOTALISTIC,
   ELEMENTARY,
}

export class CellularAutomata {
   static Builder = class {
      private dimensions: Dimensions = Dimensions.UNIDIMENSIONAL
      private type: Type = Type.ELEMENTARY
      private states: number = 2
      private size: number = 15
      private rule: number = 0
      private randomInitialConfiguration: boolean = false

      withDimensions(dimensions: Dimensions) {
         if (dimensions === Dimensions.BIDIMENSIONAL) {
            throw new Error("Bi-dimensional automata not implemented yet")
         }
         this.dimensions = dimensions
         return this
      }

      withType(type: Type) {
         this.type = type
         return this
      }

      withStates(states: number) {
         if (states < 1) {
            throw new Error("Number of states must be greater than 1")
         }
         this.states = states
         return this
      }

      withRule(rule: number) {
         this.rule = rule
         if (rule < 0) {
            throw new Error("Rule must be a positive number")
         }
         return this
      }

      withRandomInitialConfiguration() {
         this.randomInitialConfiguration = true
         return this
      }

      build() {
         return this.type === Type.TOTALISTIC ? this.buildTotallistic1D() : this.buildElementary1D()
      }

      private buildTotallistic1D() {
         const radius = 1
         const ruleCharacters = Array.from(BigInt(this.rule).toString(this.states))
         const lookupTable: number[] = Array.from({ length: ruleCharacters.length })
         for (let i = 0; i < ruleCharacters.length; i++) {
            lookupTable[i] = +ruleCharacters[i] - +"0"
         }
         const initialState = this.randomInitialConfiguration
            ? Array.from({ length: this.size }, () => Math.floor(Math.random() * this.states))
            : Array.from({ length: this.size }, (_, index) => (index === Math.floor(this.size / 2) ? 1 : 0))

         return new TotalisticCellularAutomata1D(this.states, this.size, radius, this.rule, initialState, lookupTable)
      }

      private buildElementary1D() {
         const radius = 1
         const ruleCharacters = Array.from(BigInt(this.rule).toString(this.states))
         const lookupTable: number[] = Array.from({ length: ruleCharacters.length })

         for (let i = 0; i < ruleCharacters.length; i++) {
            const character = ruleCharacters[i]
            lookupTable[i] = character >= "0" && character <= "9" ? +ruleCharacters[i] - +"0" : +ruleCharacters[i] - +"W"
         }
         const initialState = this.randomInitialConfiguration
            ? Array.from({ length: this.size }, () => Math.floor(Math.random() * this.states))
            : Array.from({ length: this.size }, (_, index) => (index === Math.floor(this.size / 2) ? 1 : 0))

         return new ElementaryCellularAutomata1D(this.states, this.size, radius, this.rule, initialState, lookupTable)
      }
   }
}

export * from "./1d/elementaryCellularAutomata1D"
export * from "./1d/totalisticCellularAutomata1D"

