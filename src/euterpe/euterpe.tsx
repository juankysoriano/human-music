import { useState } from "react";
import { CellularAutomata1D } from "../cellular-automata/1d/cellularAutomata1D";
import { ElementaryCellularAutomata1D } from "../cellular-automata/1d/elementaryCellularAutomata1D";
import SketchProvider from "../sketch/SketchProvider";
import CellularAutomataSketch from "../sketch/sketch";
import './EuterpeStyle.css'
import DefaultAutomata from "../cellular-automata/1d/default1DCellularAutomata";
import * as Tone from 'tone'

export default function Euterpe() {
    let ruleChanged = false;
    const [rule, setRule] = useState(90);
    const [automata, setAutomata] = useState(DefaultAutomata);

    const changeRule = () => {
        if (!ruleChanged) {
            Tone.start();
            ruleChanged = true;
        }
        setAutomata(
            new ElementaryCellularAutomata1D.Builder()
                .withStates(2)
                .withSize(100)
                .withRule(rule)
                .build() as CellularAutomata1D
        );
    }

    return <SketchProvider.Provider value={automata}>
        <div className="Euterpe">
            <h1 className="ruleHeader">Playing rule: {rule}</h1>
            <CellularAutomataSketch />
            <button className="ruleButton" onClick={() => { setRule(Math.round(Math.random() * 255)); changeRule() }}>
                Randomise Rule
            </button>
        </div>
    </SketchProvider.Provider>
}