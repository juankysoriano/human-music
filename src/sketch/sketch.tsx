import { P5Instance, ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import SketchProvider from './SketchProvider';
import { CellularAutomata1D } from '../cellular-automata';
import { CellularAutomata1DPainter } from "../performers/cellularAutomataPainter";
import { CellularAutomata1DPlayer } from "../performers/cellularAutomataPlayer";
import $ from 'jquery';

let automata: CellularAutomata1D;
let automataPainter: CellularAutomata1DPainter;
let automataPlayer: CellularAutomata1DPlayer;
let isSetup = false;

const sketch: Sketch = p5 => {
  p5.setup = () => {
    p5.createCanvas(sketchWidth(), sketchHeight());
    p5.frameRate(3);
    isSetup = true;
  };

  p5.updateWithProps = props => {
    if (props.automata && isSetup) {
      p5.resizeCanvas(sketchWidth(), sketchHeight());
      p5.clear();

      updateSketch(p5, props.automata);
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

async function updateSketch(p5: P5Instance, initialAutomata: CellularAutomata1D) {
  automataPlayer?.stop();

  automata = null as any;
  automataPainter = null as any;
  automataPlayer = null as any;

  automata = initialAutomata;
  automataPainter = new CellularAutomata1DPainter.Builder()
    .withSketch(p5)
    .withAutomata(initialAutomata)
    .build();;
  automataPlayer = await new CellularAutomata1DPlayer.Builder()
    .withAutomata(initialAutomata)
    .build();;
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

