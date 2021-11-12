import { useState } from "react";
import { CellularAutomata1D } from "../cellular-automata/1d/cellularAutomata1D";
import { ElementaryCellularAutomata1D } from "../cellular-automata/1d/elementaryCellularAutomata1D";
import SketchProvider from "../sketch/SketchProvider";
import CellularAutomataSketch from "../sketch/sketch";
import './EuterpeStyle.css'
import DefaultAutomata from "../cellular-automata/1d/default1DCellularAutomata";
import * as Tone from 'tone'

export default function Euterpe() {
    const [started, setStarted] = useState(false);
    const [rule, setRule] = useState(0);
    const [automata, setAutomata] = useState(DefaultAutomata);


    async function start() {
        await Tone.start();
        setStarted(true);
        setRule(2)
        setAutomata(
            new ElementaryCellularAutomata1D.Builder()
                .withStates(2)
                .withSize(100)
                .withRule(2)
                .build() as CellularAutomata1D
        );
    }

    const changeRule = (rule: number) => {
        setRule(rule);
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
            {started
                ? <button className="ruleButton" onClick={() => { changeRule(Math.round(Math.random() * 255)) }}>Randomise Rule</button>
                : <button className="startButton" onClick={() => start()}>Start</button>
            }
        </div>
    </SketchProvider.Provider>
}