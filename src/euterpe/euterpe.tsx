import { useState } from "react";
import SketchProvider from "../sketch/SketchProvider";
import CellularAutomataSketch from "../sketch/sketch";
import './styles/EuterpeStyle.css'
import * as Tone from 'tone'
import earth from '../resources/images/earth.png'

const rules = [18, 22, 20, 28, 30, 41, 45, 50, 54, 57, 60, 62, 70, 73, 75, 78, 82, 86, 89, 90, 92, 94, 99, 101, 102, 105, 109, 110, 114, 118, 122, 124, 126, 129, 131, 133, 135, 137, 141, 145, 146, 149, 150, 151, 153, 154, 157, 158, 161, 165, 167, 169, 177, 181, 182, 183, 190, 193, 195, 198, 210, 214, 225, 246, 250]
export default function Euterpe() {
    const [started, setStarted] = useState(false);
    const [rule, setRule] = useState(0);

    async function start() {
        await Tone.start();
        setStarted(true);
        randomiseRule();
    }

    async function randomiseRule() {
        const rule = Math.round(Math.random() * rules.length);
        setRule(rules[rule]);
    }

    return <SketchProvider.Provider value={rule}>
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