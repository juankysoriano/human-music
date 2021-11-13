import { CellularAutomata1D } from "./cellularAutomata1D";
import { ElementaryCellularAutomata1D } from "./elementaryCellularAutomata1D";

const DefaultAutomata = new ElementaryCellularAutomata1D.Builder()
    .withSize(100)
    .withRule(0)
    .withStates(2)
    .build() as CellularAutomata1D;

export default DefaultAutomata;