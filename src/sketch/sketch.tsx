import { P5Instance, ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import SketchProvider from './SketchProvider';
import { CellularAutomata1D, DefaultAutomata } from '../cellular-automata';
import { CellularAutomata1DPainter } from "../performers/cellularAutomataDrawer";
import { CellularAutomata1DPlayer } from "../performers/cellularAutomataPlayer";
import $ from 'jquery';

let automata: CellularAutomata1D;
let automataPainter: CellularAutomata1DPainter;
let automataPlayer: CellularAutomata1DPlayer;

async function configureSketch(p5: P5Instance, initialAutomata: CellularAutomata1D) {
  automata = null as any;
  automataPainter = null as any;
  automataPlayer = null as any;

  let painter = new CellularAutomata1DPainter.Builder()
    .withSketch(p5)
    .withAutomata(initialAutomata)
    .build();

  let player = await new CellularAutomata1DPlayer.Builder()
    .withAutomata(initialAutomata)
    .build();

    automata = initialAutomata;
    automataPainter = painter;
    automataPlayer = player;
}

const sketch: Sketch = p5 => {
  p5.setup = () => {
    p5.createCanvas(sketchWidth(), sketchHeight());
    p5.frameRate(5);
  };

  p5.updateWithProps = props => {
    if (props.automata) {
      p5.resizeCanvas(sketchWidth(), sketchHeight());
      p5.clear();
      configureSketch(p5, props.automata);
    }

    p5.draw = () => {
      automataPainter?.draw();
      automataPlayer?.play();
      automata?.evolve();
    }
  }
}

const sketchWidth = function () {
  let windowWidth = Math.round((window.innerWidth) * 0.75);
  let offset = windowWidth % 30;
  return (windowWidth - offset);
}

const sketchHeight = function () {
  return $('#sketch').height()!
}

export default function CellularAutomataSketch() {
  return (<SketchProvider.Consumer>
    {automata => (
      <div className="CellularAutomataSketch" id="sketch" style={{ width: sketchWidth() }}>
        <ReactP5Wrapper customClass="canvas" sketch={sketch} automata={automata} />
      </div>
    )}
  </SketchProvider.Consumer>);
}

