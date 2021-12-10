import { P5Instance, ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import SketchProvider from './SketchProvider';
import { CellularAutomata, CellularAutomata1D, Dimensions, Size, Type } from '../cellular-automata';
import { CellularAutomata1DPainter } from "../performers/cellularAutomataPainter";
import { CellularAutomata1DPlayer } from "../performers/cellularAutomataPlayer";
import $ from 'jquery';
import React, { useState } from "react";
import { debounce } from "ts-debounce";
import { off } from "process";

let automata: CellularAutomata1D;
let automataPainter: CellularAutomata1DPainter;
let automataPlayer: CellularAutomata1DPlayer;

const sketch: Sketch = p5 => {
  p5.setup = () => {
    p5.createCanvas(0, 0);
    p5.background(0, 0, 0);
    p5.frameRate(2.5);
  };

  p5.updateWithProps = props => {
    if (props.rule) {
      p5.resizeCanvas(props.width, props.height);
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
  p5.noLoop();
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

  p5.loop();
}

export default function CellularAutomataSketch() {
  const sketchWidth = function () {
    let border = 10;
    let windowWidth = window.innerWidth < window.innerHeight ? window.innerWidth : Math.round((window.innerWidth * 0.75) - 10);
    let offset = windowWidth % 30;
    let offsetBorder = window.innerWidth < window.innerHeight ? border : 0; 
    return windowWidth - offset - offsetBorder;
  }

  const sketchHeight = function () {
    let windowHeight = window.innerWidth < window.innerHeight ? window.innerHeight * 0.80 : window.innerHeight;
    return windowHeight - 10;
  }

  const [width, setWidth] = useState(sketchWidth());
  const [height, setHeight] = useState(sketchHeight());


  React.useEffect(() => {
    const debounced = debounce(() => { setWidth(sketchWidth()); setHeight(sketchHeight()) }, 200);
    const handleResize = function () { debounced(); }
    window.addEventListener('resize', handleResize);

    return (() => window.removeEventListener('resize', handleResize))
  }, [])

  return (<SketchProvider.Consumer>
    {rule => (
      <div className="CellularAutomataSketch" id="sketch" style={{ width: width, height: height}}>
        <ReactP5Wrapper customClass="canvas"
          sketch={sketch}
          rule={rule}
          width={width}
          height={height} />
      </div>
    )}
  </SketchProvider.Consumer>);
}

