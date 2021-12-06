import { P5Instance, ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import SketchProvider from './SketchProvider';
import { CellularAutomata, CellularAutomata1D, Dimensions, Size, Type } from '../cellular-automata';
import { CellularAutomata1DPainter } from "../performers/cellularAutomataPainter";
import { CellularAutomata1DPlayer } from "../performers/cellularAutomataPlayer";
import $ from 'jquery';
import React, { useState } from "react";
import { debounce } from "ts-debounce";

let automata: CellularAutomata1D;
let automataPainter: CellularAutomata1DPainter;
let automataPlayer: CellularAutomata1DPlayer;

const sketch: Sketch = p5 => {
  p5.setup = () => {
    p5.createCanvas(0, 0);
    p5.frameRate(2.5);
  };

  p5.updateWithProps = props => {
    if (props.rule) {
      p5.resizeCanvas(props.width, $('#sketch').height()!);
      p5.clear();

      updateSketch(p5, props.rule);
    }
  }

  p5.draw = () => {
    automataPainter?.draw();
    automata?.evolve();
    automataPlayer?.play();
  }
}

async function updateSketch(p5: P5Instance, rule: number) {
  automataPlayer?.stop();

  automata = null as any;
  automataPainter = null as any;
  automataPlayer = null as any;

  automata = new CellularAutomata.Builder()
    .withDimensions(Dimensions.UNIDIMENSIONAL)
    .withRule(rule)
    .withSize(Size.LARGE)
    .withStates(2)
    //.withRandomInitialConfiguration()
    .withType(Type.ELEMENTARY)
    .build();

  automataPainter = new CellularAutomata1DPainter.Builder()
    .withSketch(p5)
    .withAutomata(automata)
    .build();

  automataPlayer = await new CellularAutomata1DPlayer.Builder()
    .withAutomata(automata)
    .build();
}

export default function CellularAutomataSketch() {
  const sketchWidth = function () {
    let windowWidth = Math.round((window.innerWidth) * 0.75);
    let offset = windowWidth % 30;
    return (windowWidth - offset);
  }

  const [width, setWidth] = useState(sketchWidth());

  React.useEffect(() => {
    const debounced = debounce(() => { setWidth(sketchWidth()); }, 200);
    const handleResize = function () { debounced(); }
    window.addEventListener('resize', handleResize);

    return (() => window.removeEventListener('resize', handleResize))
  }, [])

  return (<SketchProvider.Consumer>
    {rule => (
      <div className="CellularAutomataSketch" id="sketch" style={{ width: width }}>
        <ReactP5Wrapper customClass="canvas"
          sketch={sketch}
          rule={rule}
          width={width} />
      </div>
    )}
  </SketchProvider.Consumer>);
}

