import { useState } from "react";
import SketchProvider from "../sketch/SketchProvider";
import CellularAutomataSketch from "../sketch/sketch";
import './styles/HumanMusicStyle.css'
import * as Tone from 'tone'
import earth from '../resources/images/earth.png'
import github from '../resources/images/github.png'
import { AutomataSelector } from "./automata-selector";
import { CellularAutomata1D } from "../cellular-automata";

export default function HumanMusic() {
    const [started, setStarted] = useState(false);
    const [automata, setAutomata] = useState(null as unknown as CellularAutomata1D);

    let ruleSelector = new AutomataSelector();

    async function start() {
        await Tone.start();
        setStarted(true);
        randomiseAutomata();
    }

    async function randomiseAutomata() {
        const automata = ruleSelector.randomAutomata();
        setAutomata(automata);
    }

    return <SketchProvider.Provider value={automata}>
        <body className="HumanMusic">
            <CellularAutomataSketch />
            <div className="Panel">
                <div className="Headers">
                    <img src={earth} className="EarthRadioLogo" alt="Earth" />
                    <h1 className="Title">Human Music</h1>
                    <h2 className="Subtitle">by Earth Radio</h2>
                </div>
                <div className="Controllers">
                    <p className="PlayingRule">{started ? "Playing rule: " + automata?.rule : "--"}</p>
                    {started
                        ? <button className="ruleButton" onClick={randomiseAutomata}>Randomise</button>
                        : <button className="startButton" onClick={start}>Start</button>
                    }
                </div>
                <div className="Misc">
                    <a className="GitHubLink" href="https://github.com/juankysoriano/human-music">
                        <img className="GitHubLogo" alt="GitHub" src={github}></img>
                    </a>
                    <p className="Dad">A mi padre ♥</p>
                </div>
            </div>
        </body>
    </SketchProvider.Provider>
}