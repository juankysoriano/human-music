import { CellularAutomata, Dimensions, Size, Type } from "./cellular-automata/index"

export class AutomataSelector {
   randomSelection() {
      const parameters = this.findParameters()
      return new CellularAutomata.Builder()
         .withSize(Size.EXTRA_SMALL)
         .withStates(parameters.states)
         .withType(parameters.type)
         .withDimensions(Dimensions.UNIDIMENSIONAL)
         .withRule(parameters.rule)
         .build()
   }

   private findParameters() {
      const differentStates = new Set<number>()
      let configuration = null
      while (differentStates.size < 5 || differentStates.size > 10) {
         differentStates.clear()
         configuration = this.randomConfiguration()

         for (let i = 0; i < 200; i++) {
            configuration.automata.evolve()
            if (i >= 100) {
               differentStates.add(configuration.automata.leeDistance())
            }
         }
      }

      return configuration!.parameters
   }

   private randomConfiguration() {
      const states = 2 + Math.floor(Math.random() * 3)
      const type = Math.random() < 0.0 ? Type.ELEMENTARY : Type.TOTALISTIC
      const maxRule = Type.ELEMENTARY ? states ** (states ** 4) - 1 : states ** (states * 4) - 1
      const rule = Math.floor(Math.random() * maxRule)
      const automata = new CellularAutomata.Builder()
         .withSize(Size.EXTRA_SMALL)
         .withStates(states)
         .withType(type)
         .withDimensions(Dimensions.UNIDIMENSIONAL)
         .withRule(rule)
         .build()
      const parameters = { states, type, rule }
      return { automata, parameters }
   }
}
