import { ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import SketchProvider from './SketchProvider';
import './styles/SketchStyle.css'
import { DefaultAutomata } from '../cellular-automata';
import { CellularAutomata1DPainter } from "../performers/cellularAutomataDrawer";
import { CellularAutomata1DPlayer } from "../performers/cellularAutomataPlayer";

const sketch: Sketch = p5 => {

  const width = 1000;
  const height = 600;

  p5.width = width;
  p5.height = height;
  let automata = DefaultAutomata;
  let automataPainter = new CellularAutomata1DPainter.Builder()
    .withSketch(p5)
    .withAutomata(automata)
    .build();
  let automataPlayer = new CellularAutomata1DPlayer.Builder()
    .withAutomata(automata)
    .build()

  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.frameRate(5);
  };

  p5.updateWithProps = props => {
    if (props.automata) {
      p5.clear();
      automata = props.automata;
      automataPainter.updateAutomata(automata);
      automataPlayer.updateAutomata(automata);
    }

    p5.draw = () => {
      automataPainter.draw();
      automataPlayer.play();
      automata.evolve();
    }
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