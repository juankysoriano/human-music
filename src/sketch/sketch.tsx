import { CellularAutomata1DPainter } from '../cellular-automata/1d/cellularAutomata1DPainter';
import { ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import SketchProvider from './SketchProvider';
import './SketchStyle.css'
import DefaultAutomata from '../cellular-automata/1d/default1DCellularAutomata';
import * as Tone from 'tone'

const sketch: Sketch = p5 => {
  let note = "B3";
  let newNote = "B3";
  let notes = ["R", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]
  const width = 1000;
  const height = 600;
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();

  p5.width = width;
  p5.height = height;
  let automata = DefaultAutomata;
  let automataPainter = new CellularAutomata1DPainter.Builder()
    .withSketch(p5)
    .withAutomata(automata)
    .build();

  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.frameRate(3);
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
    let livingCells = automata.state.filter(state => state !== 0).length;
    newNote = notes[livingCells % notes.length];
    if (note !== newNote) {
      if (note !== "R") {
        synth.triggerRelease(note, Tone.now()); 
      }
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