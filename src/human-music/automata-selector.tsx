import { CellularAutomata, Dimensions, Size, Type } from "../cellular-automata";

export class AutomataSelector {
    randomAutomata() {
        return new CellularAutomata.Builder()
            .withSize(Size.MEDIUM)
            .withStates(2)
            .withType(Type.ELEMENTARY)
            .withDimensions(Dimensions.UNIDIMENSIONAL)
            .withRule(90)
            .build();
    }
}
