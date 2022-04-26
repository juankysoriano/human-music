import { P5CanvasInstance, Sketch, SketchProps } from 'react-p5-wrapper';
import { Looper } from '../utils/looper';

export function createAutomataSketch(
    {
        frameRate = 12,
        onSetup = (p5: P5CanvasInstance) => { },
        onStep = (p5: P5CanvasInstance) => { },
        onUpdateProps = (p5: P5CanvasInstance, props: SketchProps) => { }
    }
): Sketch {
    return (p5: P5CanvasInstance) => {
        const drawLooper = new Looper({
            interval: 1000 / frameRate,
            onTick: () => onStep(p5),
        })
        p5.noLoop()
        p5.setup = () => { onSetup(p5) }
        p5.updateWithProps = (props: SketchProps) => {
            drawLooper.stop()
            onUpdateProps(p5, props)
            drawLooper.start()
        }
    }
}
