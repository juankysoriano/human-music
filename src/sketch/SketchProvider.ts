import React from "react";
import { CellularAutomata, CellularAutomata1D, Dimensions, Size, Type } from "../cellular-automata";

const SketchProvider = React.createContext(null as unknown as CellularAutomata1D);

export default SketchProvider;