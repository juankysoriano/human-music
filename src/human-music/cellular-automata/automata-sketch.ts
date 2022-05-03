import { P5CanvasInstance, Sketch, SketchProps } from 'react-p5-wrapper';
import { Looper } from '../utils/looper';

let drawLooper: Looper
export function createAutomataSketch(
    {
        bpm = 60,
        onSetup = (p5: P5CanvasInstance) => { },
        onStep = (p5: P5CanvasInstance) => { },
        onUpdateProps = (p5: P5CanvasInstance, props: SketchProps) => { }
    }
): Sketch {
    drawLooper?.stop()
    return (p5: P5CanvasInstance) => {
        bpm = Math.max(20, bpm)
        drawLooper = new Looper({
            interval: 1000 / Math.round(12 * (bpm / 60)),
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
