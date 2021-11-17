import { useRef, useState } from "react";
import SketchProvider from "../sketch/SketchProvider";
import CellularAutomataSketch from "../sketch/sketch";
import './styles/EuterpeStyle.css'
import { CellularAutomata, CellularAutomata1D, DefaultAutomata, Dimensions, Type, Size } from "../cellular-automata";
import * as Tone from 'tone'
import earth from '../resources/images/earth.png'
import React from "react";
import { debounce } from "ts-debounce";


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
        const rule = Math.round(Math.random() * 255);
        setRule(rule);
        updateAutomata(rule);
    }

    async function updateAutomata(rule: number) {
        setAutomata(
            new CellularAutomata.Builder()
                .withDimensions(Dimensions.UNIDIMENSIONAL)
                .withType(Type.ELEMENTARY)
                .withStates(2)
                .withSize(Size.EXTRA_SMALL)
                .withRule(rule)
                .build() as CellularAutomata1D
        );
    }

    React.useEffect(() => {
        const debounced = debounce(() => {
            updateAutomata(rule);
            window.removeEventListener('resize', handleResize)
        }, 250);
        const handleResize = function () { debounced(); }
        window.addEventListener('resize', handleResize);
    });

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