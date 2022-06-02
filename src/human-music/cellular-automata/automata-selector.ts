import { CellularAutomata, Dimensions, Type } from "./index";

export class AutomataSelector {
   randomSelection() {
      const automata = this.findautomata();
      automata.reset();
      return automata;
   }

   private findautomata() {
      let different = 0;
      let previousState = 0;
      let configuration = null
      while (different < 7) {
         configuration = this.randomConfiguration()

         for (let i = 0; i < 200; i++) {
            if (i >= 100) {
               different = previousState !== configuration.automata.leeDistance() ? different + 1 : different
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
         .withDimensions(Dimensions.ONE)
         .withRule(rule)
         .build()
      const parameters = { states, type, rule }
      return { automata, parameters }
   }
}
