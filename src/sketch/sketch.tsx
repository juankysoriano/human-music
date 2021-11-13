import { CellularAutomata1DPainter } from '../cellular-automata/1d/cellularAutomata1DPainter';
import { ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import SketchProvider from './SketchProvider';
import './SketchStyle.css'
import DefaultAutomata from '../cellular-automata/1d/default1DCellularAutomata';
import * as Tone from 'tone'

const sketch: Sketch = p5 => {
  let note = "R";
  let newNote = "R";
  let notes = ["R", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"];
  const width = 1000;
  const height = 600;
  let loaded = false;
  const synth = new Tone.Sampler({
    // urls: {
    //   "C4": "Giuseppe-C.mp3",
    //   "D4": "Giuseppe-D.mp3",
    //   "E4": "Giuseppe-E.mp3"
    // },
    // baseUrl: process.env.PUBLIC_URL + "/sounds/"
    urls: {
      A1: "A1.mp3",
      A2: "A2.mp3",
    },
    baseUrl: "https://tonejs.github.io/audio/casio/",
  }).toDestination();
  Tone.loaded().then(() => { loaded = true });
  p5.width = width;
  p5.height = height;
  let automata = DefaultAutomata;
  let automataPainter = new CellularAutomata1DPainter.Builder()
    .withSketch(p5)
    .withAutomata(automata)
    .build();

  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.frameRate(5);
    automataPainter.setup();
  };

  p5.updateWithProps = props => {
    if (props.automata) {
      p5.clear();
      automata = props.automata;
      automataPainter = new CellularAutomata1DPainter.Builder()
        .withSketch(p5)
        .withAutomata(automata)
        .build();
    }
  }

  p5.draw = () => {
    if (!loaded) {
      return;
    }
    let livingCells = automata.state.filter(state => state !== 0).length;
    newNote = notes[livingCells % notes.length];
    if (note !== newNote) {
      synth.triggerRelease(note, Tone.now());
      if (newNote !== "R") {
        synth.triggerAttack(newNote, Tone.now());
      }
    }
    note = newNote;
    automataPainter.draw();
    automata.evolve();
  }
}

export default function CellularAutomataSketch() {
  return (<SketchProvider.Consumer>
    {automata => (
      <div className="CellularAutomataSketch">
        <ReactP5Wrapper customClass="canvas" sketch={sketch} automata={automata} />
      </div>
    )}
  </SketchProvider.Consumer>);
}