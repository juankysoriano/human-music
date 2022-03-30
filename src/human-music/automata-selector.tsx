import { CellularAutomata, Dimensions, Size, Type } from "../cellular-automata";
import { CellularAutomata1D } from "../cellular-automata/1d/cellularAutomata1D";

export class AutomataSelector {
    randomAutomata() {
        return new CellularAutomata.Builder()
            .withSize(Size.MEDIUM)
            .withStates(2)
            .withType(Type.ELEMENTARY)
            .withDimensions(Dimensions.UNIDIMENSIONAL)
            .withRule(169)
            .build();
    }

    private leeDistance(automata: CellularAutomata1D) {
        return automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(automata.state[index] - automata.previousState[index])
            let leeDistance = Math.min(euclideanDistance, automata.states - euclideanDistance)
            return automata.state[index] == 0 ? acc : acc + leeDistance;
        }, 0);
    }
}