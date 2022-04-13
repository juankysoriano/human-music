import { Chord as TonalChord, Note, Progression } from '@tonaljs/tonal';
import { Chord } from '../performers/audio/music-models';
import { TreeNode } from './data-structures/TreeNote';

declare global {
    interface Array<T> {
        shuffle(): Array<T>
        removeDuplicates(): Array<T>
    }

    interface String {
        node({ isLeaf }: { isLeaf: boolean }): TreeNode<Chord>
    }
}

// eslint-disable-next-line no-extend-native
Array.prototype.removeDuplicates = function <T>(this: T[]) {
    return this.filter((value, index, self) => self.indexOf(value) === index);
}

// eslint-disable-next-line no-extend-native
Array.prototype.shuffle = function <T>(this: T[]) {
    return this.sort(() => Math.random() - 0.5)
}

// eslint-disable-next-line no-extend-native
String.prototype.node = function (this: string, { isLeaf }: { isLeaf: boolean }) {
    const node = new TreeNode<Chord>(
        new Chord({
            notes: Progression.fromRomanNumerals("C", [this.toString()])
                .map(note => TonalChord.get(note).notes)[0]
                .map(note => Note.get(`${note}0`).midi as number - 6)
                .sort((a, b) => a - b),
            label: this.toString()
        }),
        isLeaf
    )
    if (node.value.notes.length === 0) {
        console.log("Problem with chord: " + node.value.label)
    }
    return node
}
