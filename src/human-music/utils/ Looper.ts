export class Looper {
    private id = 0
    private timer: Worker
    private onTick: (count: number) => void
    private count = 0;

    constructor({ interval = 1000, onTick = (count: number) => { } }) {
        this.timer = new Worker(
            URL.createObjectURL(
                new Blob(
                    [
                        `onmessage = (event) => {
                     if (event.data.message === "start") {
                        const id = setInterval(() => postMessage({ message: "tick" }), ${interval})
                        postMessage({ message: "started", identifier: id })
                     }
                     if (event.data.message === "stop") {
                        clearInterval(event.data.identifier)
                     }
                  }`,
                    ],
                    {
                        type: "application/javascript",
                    }
                )
            )
        )
        this.onTick = onTick
    }

    public start() {
        this.count = 0
        this.timer.onmessage = (event) => {
            if (event.data.message === "started") {
                this.id = event.data.identifier
            }

            if (event.data.message === "tick") {
                this.onTick(this.count)
                this.count++
            }
        }

        this.timer.postMessage({ message: "start" })
    }

    public stop() {
        this.count = 0
        this.timer.postMessage({ message: "stop", identifier: this.id })
    }
}