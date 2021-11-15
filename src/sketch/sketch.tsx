import { P5Instance, ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import SketchProvider from './SketchProvider';
import './styles/SketchStyle.css'
import { CellularAutomata1D, DefaultAutomata } from '../cellular-automata';
import { CellularAutomata1DPainter } from "../performers/cellularAutomataDrawer";
import { CellularAutomata1DPlayer } from "../performers/cellularAutomataPlayer";

let automata: CellularAutomata1D;
let automataPainter: CellularAutomata1DPainter;
let automataPlayer: CellularAutomata1DPlayer;

async function initPerformers(p5: P5Instance) {
  let initialAutomata = DefaultAutomata;

  let painter = new CellularAutomata1DPainter.Builder()
    .withSketch(p5)
    .withAutomata(initialAutomata)
    .build();

  let player = await new CellularAutomata1DPlayer.Builder()
    .withAutomata(initialAutomata)
    .build();

  return { initialAutomata, painter, player };
}

const sketch: Sketch = p5 => {
  let isSetup = false;
  let sketchElement = document.getElementById('sketch');
  let width = sketchElement ? sketchElement.clientWidth : 0;
  let height = sketchElement ? sketchElement.clientHeight : 0;

  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.frameRate(5);
    initPerformers(p5).then(({ initialAutomata, painter, player }): void => {
      automata = initialAutomata;
      automataPainter = painter;
      automataPlayer = player;
      isSetup = true;
    });
  };

  p5.updateWithProps = props => {
    if (props.automata && isSetup) {
      automata = props.automata;
      automataPainter?.updateAutomata(automata);
      automataPlayer?.updateAutomata(automata);
      p5.clear();
    }

    p5.draw = () => {
      automataPainter?.draw();
      automataPlayer?.play();
      automata?.evolve();
    }
  }
}

export default function CellularAutomataSketch() {
  return (<SketchProvider.Consumer>
    {automata => (
      <div className="CellularAutomataSketch" id="sketch">
        <ReactP5Wrapper customClass="canvas" sketch={sketch} automata={automata} />
      </div>
    )}
  </SketchProvider.Consumer>);
}

