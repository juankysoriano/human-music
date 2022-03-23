import { CellularAutomata, Dimensions, Size, Type } from "../cellular-automata";
import { CellularAutomata1D } from "../cellular-automata/1d/cellularAutomata1D";

export class AutomataSelector {
    randomAutomata() {
        let radius = 1;
        let type = Math.random() < 0.5 ? Type.ELEMENTARY : Type.TOTALISTIC;
        let states = 3;
        let maxRule = 0;
        switch (type) {
            case Type.ELEMENTARY:
                var combinations = Math.pow(states, (2 * radius + 1));
                maxRule = Math.pow(states, combinations) - 1;
                break;
            case Type.TOTALISTIC:
                var combinations = (states - 1) * (2 * radius + 1) + 1;
                maxRule = Math.pow(states, combinations) - 1;
                break;
        }

        while (true) {
            let rule = Math.round(Math.random() * maxRule);
            let automata = new CellularAutomata.Builder()
                .withSize(Size.MEDIUM)
                .withStates(states)
                .withType(type)
                .withRandomInitialConfiguration()
                .withDimensions(Dimensions.UNIDIMENSIONAL)
                .withRule(rule)
                .build();

            let leeValues = new Set();

            for (let step = 0; step < 100; step++) {
                leeValues.add(this.leeDistance(automata));
                automata.evolve();
            }

            if (leeValues.size >= 20 && leeValues.size <= 50) {
                let result = new CellularAutomata.Builder()
                    .withSize(Size.MEDIUM)
                    .withStates(states)
                    .withType(type)
                    .withRandomInitialConfiguration()
                    .withDimensions(Dimensions.UNIDIMENSIONAL)
                    .withRule(rule)
                    .build();

                return result;
            }
        }
    }

    private leeDistance(automata: CellularAutomata1D) {
        return automata.state.reduce((acc, _, index) => {
            let euclideanDistance = Math.abs(automata.state[index] - automata.previousState[index])
            let leeDistance = Math.min(euclideanDistance, automata.states - euclideanDistance)
            return automata.state[index] == 0 ? acc : acc + leeDistance;
        }, 0);
    }
}