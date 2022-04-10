import { Chord as TonalChord, Note, Progression } from "@tonaljs/tonal";
import { Chord } from "../../performers/audio/music-models";

declare global {
    interface Array<T> {
        shuffle(): Array<T>
    }

    interface String {
        toNode(): TreeNode<Chord>
        toChord(): Chord
    }
}

// eslint-disable-next-line no-extend-native
Array.prototype.shuffle = function <T>(this: T[]) {
    return this.sort(() => Math.random() - 0.5)
}

// eslint-disable-next-line no-extend-native
String.prototype.toNode = function (this: string) {
    return new TreeNode<Chord>(this.toChord())
}

// eslint-disable-next-line no-extend-native
String.prototype.toChord = function (this: String) {
    return new Chord(Progression.fromRomanNumerals("C", [this.toString()])
        .map(note => TonalChord.get(note).notes)[0]
        .map(note => Note.midi(`${note}0`) as number - 12)
        .map((note, index, array) => {
            array[index] = index > 0 && array[index - 1] >= note ? note + 12 : note
            return array[index]
        }), this.toString())

}

export class TreeNode<T> {
    readonly value: T
    private _children: TreeNode<T>[] = []

    constructor(value: T) {
        this.value = value
    }

    public get children(): TreeNode<T>[] {
        return this._children
    }

    public get isLeaf(): boolean {
        return this.children.length === 0
    }

    node(node: TreeNode<T>): TreeNode<T> {
        this.children.push(node)
        return this;
    }

    filter(predicate: (value: T) => boolean): TreeNode<T> {
        this._children = this._children.filter(child => predicate(child.value))
        this._children = this._children.map(child => child.filter(predicate))
        return this;
    }

    shuffle(): TreeNode<T> {
        this._children = this._children.shuffle()
        this._children = this._children.map(child => child.shuffle())
        return this;
    }
}

