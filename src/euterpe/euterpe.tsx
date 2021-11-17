import { useState } from "react";
import SketchProvider from "../sketch/SketchProvider";
import CellularAutomataSketch from "../sketch/sketch";
import './styles/EuterpeStyle.css'
import { CellularAutomata, CellularAutomata1D, DefaultAutomata, Dimensions, Type, Size } from "../cellular-automata";
import * as Tone from 'tone'
import earth from '../resources/images/earth.png'




export default function Euterpe() {
    const [started, setStarted] = useState(false);
    const [rule, setRule] = useState(0);
    const [automata, setAutomata] = useState(DefaultAutomata());

    async function start() {
        await Tone.start();
        setStarted(true);
        randomiseRule();
    }

    async function randomiseRule() {
        const rule = Math.round(Math.random() * 5000);
        setRule(rule);
        setAutomata(
            new CellularAutomata.Builder()
                .withDimensions(Dimensions.UNIDIMENSIONAL)
                .withType(Type.TOTALISTIC)
                .withStates(3)
                .withSize(Size.MEDIUM)
                .withRule(rule)
                .build() as CellularAutomata1D
        );
    }

    return <SketchProvider.Provider value={automata}>
        <div className="Euterpe">
            <CellularAutomataSketch />
            <div className="Panel">
                <div className="Headers">
                    <img src={earth} className="EarthRadioLogo" alt="Earth" />
                    <h1 className="Title">Human Music</h1>
                    <h2 className="Subtitle">by Earth Radio</h2>
                </div>
                <div className="Controllers">
                    <p className="PlayingRule">{started ? "Playing rule: " + rule : "--"}</p>
                    {started
                        ? <button className="ruleButton" onClick={randomiseRule}>Randomise Rule</button>
                        : <button className="startButton" onClick={start}>Start</button>
                    }
                </div>
            </div>
        </div>
    </SketchProvider.Provider>
}