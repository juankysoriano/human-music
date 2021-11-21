import { ElementaryCellularAutomata1D } from './1d/elementaryCellularAutomata1D';
import { TotalisticCellularAutomata1D } from './1d/totalisticCellularAutomata1D';

export interface CellularAutomata1D {
    readonly radius: any;
    readonly size: number;
    readonly rule: number;
    get state(): ReadonlyArray<number>;
    evolve(): void;
};

export enum Dimensions {
    UNIDIMENSIONAL,
    BIDIMENSIONAL
}

export enum Type {
    TOTALISTIC,
    ELEMENTARY
}

export enum Size {
    EXTRA_SMALL,
    SMALL,
    MEDIUM,
    LARGE,
    EXTRA_LARGE
}

export class CellularAutomata {
    static Builder = class {
        private dimensions: Dimensions = Dimensions.UNIDIMENSIONAL;
        private type: Type = Type.ELEMENTARY;
        private states: number = 2;
        private size: number = 100;
        private rule: number = 0;
        private randomInitialConfiguration: boolean = false;

        withDimensions(dimensions: Dimensions) {
            if (dimensions === Dimensions.BIDIMENSIONAL) {
                throw new Error("Bi-dimensional automata not implemented yet");
            }
            this.dimensions = dimensions;
            return this;
        }

        withType(type: Type) {
            this.type = type;
            return this;
        }

        withStates(states: number) {
            if (states < 1) {
                throw new Error("Number of states must be greater than 1");
            }
            this.states = states;
            return this;
        }

         withSize(size: Size) {
            const sketch = document.getElementById('sketch');
            const sketchWidth = sketch === null ? 0 : sketch.clientWidth * window.devicePixelRatio;
            
            switch(size) {
                case Size.EXTRA_SMALL: this.size = sketchWidth / 30; break;
                case Size.SMALL: this.size = sketchWidth / 15; break;
                case Size.MEDIUM: this.size = sketchWidth / 5; break;
                case Size.LARGE: this.size = sketchWidth / 2; break;
                case Size.EXTRA_LARGE: this.size = sketchWidth / 1; break;
            };
            this.size = Math.round(this.size);
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
            return this.type === Type.TOTALISTIC ? this.buildTotallistic1D() : this.buildElementary1D();
        }

        private buildTotallistic1D() {
            const radius = 1;
            const ruleCharacters = Array.from(BigInt(this.rule).toString(this.states));
            const lookupTable: number[] = Array.from({ length: ruleCharacters.length });
            for (let i = 0; i < ruleCharacters.length; i++) {
                lookupTable[i] = +ruleCharacters[i] - +'0';
            }
            const initialState = this.randomInitialConfiguration
                ? Array.from({ length: this.size }, () => Math.round(Math.random()))
                : Array.from({ length: this.size }, (_, index) => index === Math.floor(this.size / 2) ? 1 : 0);

            return new TotalisticCellularAutomata1D(
                this.states,
                this.size,
                radius,
                this.rule,
                initialState,
                lookupTable
            );
        }

        private buildElementary1D() {
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

export * from './1d/totalisticCellularAutomata1D';
export * from './1d/elementaryCellularAutomata1D'
