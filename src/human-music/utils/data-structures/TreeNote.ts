import { Chord as TonalChord, Note, Progression } from "@tonaljs/tonal";
import { Chord } from "../../performers/audio/music-models";

declare global {
    interface Array<T> {
        shuffle(): Array<T>
    }

    interface String {
        node(isLeaf: boolean): TreeNode<Chord>
    }
}

// eslint-disable-next-line no-extend-native
Array.prototype.shuffle = function <T>(this: T[]) {
    return this.sort(() => Math.random() - 0.5)
}

// eslint-disable-next-line no-extend-native
String.prototype.node = function (this: string, isLeaf: boolean = false) {
    const node = new TreeNode<Chord>(new Chord(
        Progression.fromRomanNumerals("C", [this.toString()])
            .map(note => TonalChord.get(note).notes)[0]
            .map(note => Note.get(`${note}0`).midi as number - 6)
            .sort((a, b) => a - b),
        this.toString()
    ),
        isLeaf
    )
    if (node.value.notes.length === 0) {
        console.log("Problem with chord: " + node.value.label)
    }
    return node
}

export class TreeNode<T> {
    readonly isLeaf: boolean
    readonly value: T
    private _children: TreeNode<T>[] = []

    constructor(value: T, isLeaf: boolean = false) {
        this.value = value
        this.isLeaf = isLeaf
    }

    public get children(): TreeNode<T>[] {
        return this._children
    }

    add(node: TreeNode<T>): TreeNode<T> {
        this.children.push(node)
        return this;
    }

    hasDirectChild(value: T): boolean {
        return this.children.map(child => child.value).includes(value)
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

