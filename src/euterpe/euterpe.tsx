import { useState } from "react";
import SketchProvider from "../sketch/SketchProvider";
import CellularAutomataSketch from "../sketch/sketch";
import './styles/EuterpeStyle.css'
import { CellularAutomata, CellularAutomata1D, DefaultAutomata, Dimensions, Type } from "../cellular-automata";
import * as Tone from 'tone'

export default function Euterpe() {
    const [started, setStarted] = useState(false);
    const [rule, setRule] = useState(0);
    const [automata, setAutomata] = useState(DefaultAutomata);


    async function start() {
        await Tone.start();
        setStarted(true);
        randomiseRule();
    }

    async function randomiseRule() {
        const rule = Math.round(Math.random() * 255);
        setRule(rule);
        setAutomata(
            new CellularAutomata.Builder()
                .withDimensions(Dimensions.UNIDIMENSIONAL)
                .withType(Type.ELEMENTARY)
                .withStates(2)
                .withSize(100)
                .withRule(rule)
                .build() as CellularAutomata1D
        );
    }

    return <SketchProvider.Provider value={automata}>
        <div className="Euterpe">
            <h1 className="ruleHeader">{started ? "Playing rule:" + rule : "Euterpe"}</h1>
            <CellularAutomataSketch />
            {started
                ? <button className="ruleButton" onClick={randomiseRule}>Randomise Rule</button>
                : <button className="startButton" onClick={start}>Start</button>
            }
        </div>
    </SketchProvider.Provider>
}