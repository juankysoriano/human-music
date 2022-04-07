import { useState } from "react"
import { CellularAutomata1D } from "../cellular-automata/1d/cellularAutomata1D"
import * as MIDI from '../performers/audio/MIDI'
import earth from '../resources/images/earth.png'
import github from '../resources/images/github.png'
import CellularAutomataSketch from "../sketch/sketch"
import SketchProvider from "../sketch/SketchProvider"
import { AutomataSelector } from "./automata-selector"
import './styles/HumanMusicStyle.css'

export default function HumanMusic() {
    const [started, setStarted] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [automata, setAutomata] = useState(null as unknown as CellularAutomata1D)

    const ruleSelector = new AutomataSelector()

    load()

    async function load() {
        MIDI.loadMidi(() => { setLoaded(true) })
    }
    async function start() {
        MIDI.start()
        setStarted(true)
        randomiseAutomata()
    }

    async function randomiseAutomata() {
        const automata = ruleSelector.randomAutomata()
        setAutomata(automata)
    }

    return <SketchProvider.Provider value={automata}>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, viewport-fit=cover" />
        <div className="HumanMusic">
            <div className="Headers">
                <img src={earth} className="EarthRadioLogo" alt="Earth" />
                <h1 className="Title">Human Music</h1>
                <h2 className="Subtitle">by Earth Radio</h2>
            </div>
            <div className="Automata">
                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            {loaded
                                ? <CellularAutomataSketch />
                                : <div className="Loading">
                                    <p className="LoadingText">{`Loading`}</p>
                                </div>
                            }
                        </div>
                        <div className="flip-card-back">
                            <p className="PlayingRule">{started ? `Playing rule: ${automata?.rule}` : "--"}</p>
                        </div>
                    </div>
                </div>
                <div className="Controllers" style={{ visibility: loaded ? 'visible' : 'hidden' }}>
                    {started
                        ? <button className="ruleButton" onClick={randomiseAutomata} >Randomise</button>
                        : <button className="startButton" onClick={start}>Start</button>
                    }
                </div>
            </div>
            <div className="Misc">
                <a className="GitHubLink" href="https://github.com/juankysoriano/human-music">
                    <img className="GitHubLogo" alt="GitHub" src={github} />
                </a>
                <p className="Dad">A mi padre ♥</p>
            </div>
        </div>
    </SketchProvider.Provider>
}