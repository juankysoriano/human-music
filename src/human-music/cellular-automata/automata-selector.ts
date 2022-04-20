import { CellularAutomata, Dimensions, Type } from "./index";

export class AutomataSelector {
   randomSelection() {
      const automata = this.findautomata();
      automata.reset();
      return automata;
   }

   private findautomata() {
      const differentStates = new Set<number>()
      let configuration = null
      while (differentStates.size < 5) {
         differentStates.clear()
         configuration = this.randomConfiguration()

         for (let i = 0; i < 200; i++) {
            configuration.automata.evolve()
            if (i >= 100) {
               differentStates.add(configuration.automata.leeDistance())
            }
         }
      }

      return configuration!.automata
   }

   private randomConfiguration() {
      const states = 2 + Math.floor(Math.random() * 3)
      const type = Math.random() < 0.5 ? Type.ELEMENTARY : Type.TOTALISTIC
      const maxRule = Type.ELEMENTARY ? states ** (states ** 2) - 1 : states ** (states * 2) - 1
      const rule = Math.floor(Math.random() * maxRule)
      const automata = new CellularAutomata.Builder()
         .withStates(states)
         .withType(type)
         .withRandomInitialConfiguration()
         .withDimensions(Dimensions.UNIDIMENSIONAL)
         .withRule(rule)
         .build()
      const parameters = { states, type, rule }
      return { automata, parameters }
   }
}
