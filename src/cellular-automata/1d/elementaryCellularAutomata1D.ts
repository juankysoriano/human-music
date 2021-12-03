import { CellularAutomata1D } from './cellularAutomata1D';

export class ElementaryCellularAutomata1D implements CellularAutomata1D {
    readonly states: number;
    readonly size: number;
    readonly radius: number;
    readonly rule: number;
    private _state: number[];
    private tempState: number[];
    private neighbourhoodCode: number[];
    private lookupTable: number[];

    constructor(states: number, size: number, radius: number, rule: number, initialState: number[], lookupTable: number[]) {
        this.states = states;
        this.size = size;
        this.radius = radius;
        this.rule = rule;
        this._state = initialState;
        this.lookupTable = lookupTable;
        this.tempState = Array.from({ length: size });
        this.neighbourhoodCode = Array.from({ length: size });
    }

    get state(): readonly number[] {
        return this._state;
    }

    get previousState(): readonly number[] {
        return this.tempState;
    }

    evolve() {
        this.state.forEach((_, index) => { this.evolveCellAt(index); });
        const stateSave = this.tempState;
        this.tempState = this._state;
        this._state = stateSave;
    }

    private evolveCellAt(index: number) {
        const code = this.lookupTable.length - this.computeCodeFor(index) - 1;
        this.tempState[index] = code >= 0 ? this.lookupTable[code] : 0;
    }

    private computeCodeFor(index: number) {
        let exponential = Math.pow(this.states, 2 * this.radius)
        let lookUpIndex: number;
        let code = 0;
        if (index === 0) {
            for (let i = -this.radius; i <= this.radius; i++) {
                lookUpIndex = this.wrappedIndex(i);
                code += exponential * this._state[lookUpIndex];
                exponential /= this.states;
            }
        } else {
            lookUpIndex = this.wrappedIndex(index - this.radius - 1);
            let offsetA = exponential * this._state[lookUpIndex];
            lookUpIndex = this.wrappedIndex(index + this.radius);
            let offsetB = this._state[lookUpIndex];
            code = (this.neighbourhoodCode[index - 1] - offsetA) * this.states + offsetB;
        }
        this.neighbourhoodCode[index] = code;
        return code;
    }

    private wrappedIndex(index: number) {
        return index < 0 ? index + this.size : index >= this.size ? index - this.size : index;
    }


    static Builder = class {
        private states: number = 2;
        private size: number = 100;
        private rule: number = 0;
        private randomInitialConfiguration: boolean = false;

        withStates(states: number) {
            if (states < 1) {
                throw new Error("Number of states must be greater than 1");
            }
            this.states = states;
            return this;
        }

        withSize(size: number) {
            this.size = size;
            if (size <= 10) {
                throw new Error("Size of cellular automata must be greater than 10");
            }
            return this;
        }

        withRule(rule: number) {
            this.rule = rule;
            if (rule < 0) {
                throw new Error("Rule must be a positive number");
            }
            return this;
        }

        withRandomInitialConfiguration() {
            this.randomInitialConfiguration = true;
            return this;
        }

        build() {
            const radius = 1;
            const ruleCharacters = Array.from(BigInt(this.rule).toString(this.states));
            const lookupTable: number[] = Array.from({ length: ruleCharacters.length });
            for (let i = 0; i < ruleCharacters.length; i++) {
                let character = ruleCharacters[i];
                if (character >= '0' && character <= '9') {
                    lookupTable[i] = +ruleCharacters[i] - +'0';
                } else {
                    lookupTable[i] = +ruleCharacters[i] - +'W'
                }
            }
            const initialState = this.randomInitialConfiguration
                ? Array.from({ length: this.size }, () => Math.round(Math.random()))
                : Array.from({ length: this.size }, (_, index) => index === Math.floor(this.size / 2) ? 1 : 0);

            return new ElementaryCellularAutomata1D(
                this.states,
                this.size,
                radius,
                this.rule,  
                initialState,
                lookupTable
            );
        }
    }
}