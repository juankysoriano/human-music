import { Chord as TonalChord, Note, Progression } from "@tonaljs/tonal";
import { Chord } from "../../performers/audio/music-models";

declare global {
    interface Array<T> {
        shuffle(): Array<T>
    }

    interface String {
        node(): TreeNode<Chord>
    }
}

// eslint-disable-next-line no-extend-native
Array.prototype.shuffle = function <T>(this: T[]) {
    return this.sort(() => Math.random() - 0.5)
}

// eslint-disable-next-line no-extend-native
String.prototype.node = function (this: string) {
    const chord = new Chord(Progression.fromRomanNumerals("C", [this.toString()])
        .map(note => TonalChord.get(note).notes)[0]
        .map(note => Note.midi(`${note}0`) as number - 12)
        .map((note, index, array) => {
            array[index] = index > 0 && array[index - 1] >= note ? note + 12 : note
            return array[index]
        }).shuffle(), this.toString())
    return new TreeNode<Chord>(chord)
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

    add(node: TreeNode<T>): TreeNode<T> {
        this.children.push(node)
        return this;
    }

    count(predicate: (child: TreeNode<T>) => boolean): number {
        return this._children.reduce((count, child) => count + child.count(predicate), predicate(this) ? 1 : 0)
    }

    filter(predicate: (value: T) => boolean): TreeNode<T> {
        this._children.map((child, _, array) => {
            this._children = array.filter(element => predicate(element.value))
            return child.filter(predicate)
        })
        return this;
    }

    shuffle(): TreeNode<T> {
        this._children.map((child, _, array) => {
            this._children = array.shuffle()
            return child.shuffle()
        })
        return this;
    }
}

