import { P5CanvasInstance, Sketch, SketchProps } from 'react-p5-wrapper';
import { Looper } from '../utils/ Looper';

export function createAutomataSketch(
    {
        frameRate = 12,
        onSetup = (p5: P5CanvasInstance) => { },
        onDraw = (p5: P5CanvasInstance) => { },
        onAutomataStep = (p5: P5CanvasInstance) => { },
        onUpdateProps = (p5: P5CanvasInstance, props: SketchProps) => { }
    }
): Sketch {
    return (p5: P5CanvasInstance) => {
        p5.noLoop()
        const drawLooper = new Looper({
            interval: 1000 / frameRate,
            onTick: (count) => {
                onDraw(p5)
                onAutomataStep(p5)
            },
        })
        p5.setup = () => { onSetup(p5) }
        p5.updateWithProps = (props: SketchProps) => {
            drawLooper.stop()
            onUpdateProps(p5, props)
            drawLooper.start()
        }
    }
}
