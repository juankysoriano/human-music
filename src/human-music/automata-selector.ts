import { CellularAutomata, Dimensions, Size, Type } from "./cellular-automata/index"

export class AutomataSelector {
   randomAutomata() {
      const radius = 1

      let found = false
      let rule = 0
      let type = Type.ELEMENTARY
      const states = 3
      while (!found) {
         type = Math.random() < 0.0 ? Type.ELEMENTARY : Type.TOTALISTIC
         let maxRule = 0
         switch (type) {
            case Type.ELEMENTARY:
               maxRule = states ** (states ** (2 * radius + 1)) - 1
               break
            case Type.TOTALISTIC:
               maxRule = states ** (states * (2 * radius + 1)) - 1
               break
         }
         rule = Math.floor(Math.random() * maxRule);
         const automata = new CellularAutomata.Builder()
            .withSize(Size.MEDIUM)
            .withStates(states)
            .withType(type)
            .withDimensions(Dimensions.UNIDIMENSIONAL)
            .withRule(rule)
            .build()
         const distances = new Set<number>()
         for (let i = 0; i < 100; i++) {
            automata.evolve()
         }
         for (let i = 0; i < 100; i++) {
            distances.add(automata.leeDistance())
            automata.evolve()
         }
         found = distances.size >= 5 && distances.size <= 20
      }

      return (
         new CellularAutomata.Builder()
            .withSize(Size.MEDIUM)
            .withStates(states)
            .withType(type)
            .withDimensions(Dimensions.UNIDIMENSIONAL)
            .withRule(rule)
            .build()
      )
   }
}
