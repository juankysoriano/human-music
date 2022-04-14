import { CellularAutomata, Dimensions, Size, Type } from "./cellular-automata/index"

export class AutomataSelector {
   randomAutomata() {
      const radius = 1
      const type = Math.random() < 0.0 ? Type.ELEMENTARY : Type.TOTALISTIC
      const states = 3
      let maxRule = 0
      switch (type) {
         case Type.ELEMENTARY:
            maxRule = states ** (states ** (2 * radius + 1)) - 1
            break
         case Type.TOTALISTIC:
            maxRule = states ** (states * (2 * radius + 1)) - 1
            break
      }

      return (
         new CellularAutomata.Builder()
            .withSize(Size.MEDIUM)
            .withStates(states)
            .withType(type)
            //.withRandomInitialConfiguration()
            .withDimensions(Dimensions.UNIDIMENSIONAL)
            .withRule(Math.floor(Math.random() * maxRule))
            .build()
      )
   }
}
