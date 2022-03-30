import $ from 'jquery';
import React, { useReducer } from "react";
import { P5Instance, ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import { debounce } from "ts-debounce";
import { CellularAutomata1D } from '../cellular-automata';
import { CellularAutomata1DPainter } from "../performers/cellularAutomataPainter";
import { CellularAutomata1DPlayer } from "../performers/cellularAutomataPlayer";
import SketchProvider from './SketchProvider';

let automata: CellularAutomata1D;
let automataPainter: CellularAutomata1DPainter;
let automataPlayer: CellularAutomata1DPlayer;

const sketch: Sketch = p5 => {
  p5.setup = () => {
    p5.createCanvas($('#sketch').width()!, $('#sketch').height()!);
    p5.background(9, 9, 9);
    p5.frameRate(16);
  };

  p5.updateWithProps = props => {
    p5.resizeCanvas($('#sketch').width()!, $('#sketch').height()!);
    if (props.newAutomata) {
      p5.clear();
      p5.background(9, 9, 9);
      updateSketch(p5, props.newAutomata);
    }
  }

  p5.draw = () => {
    automataPainter?.draw();
    automata?.evolve();
    automataPlayer?.play();
  }
}

async function updateSketch(p5: P5Instance, newAutomata: CellularAutomata1D) {
  p5.noLoop();
  automataPlayer?.stop();
  automata = null as any;
  automataPainter = null as any;
  automataPlayer = null as any;

  automata = newAutomata;

  let offset = Math.floor(Math.random() * 6);

  automataPainter = new CellularAutomata1DPainter.Builder()
    .withSketch(p5)
    .withAutomata(newAutomata)
    .build();

  automataPlayer = await new CellularAutomata1DPlayer.Builder()
    .withAutomata(automata)
    .build();

  p5.loop();
}

export default function CellularAutomataSketch() {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  React.useEffect(() => {
    const debounced = debounce(() => { forceUpdate(); }, 200);
    const handleResize = function () { debounced(); }
    window.addEventListener('resize', handleResize);

    return (() => window.removeEventListener('resize', handleResize))
  }, [])

  return (<SketchProvider.Consumer>
    {newAutomata => (
      <div className="CellularAutomataSketch" id="sketch">
        <ReactP5Wrapper customClass="canvas"
          sketch={sketch}
          newAutomata={newAutomata}
          ignored={ignored} />
      </div>
    )}
  </SketchProvider.Consumer>);
}

