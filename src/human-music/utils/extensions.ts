import { Chord as TonalChord, Note as TonalNote, Progression } from "@tonaljs/tonal";
import { Chord } from "../performers/audio/music-models/chord";
import { TreeNode } from "./data-structures/tree-node";

declare global {
   interface Object {
      apply<T>(effect: (object: T) => void): T
   }
   interface Map<K, V> {
      filterByKey(criteria: (key: K) => boolean): Map<K, V>
   }

   interface Array<T> {
      groupBy<K>(grouper: (group: T) => K): Map<K, T[]>
      shuffle(): Array<T>
      removeDuplicates(): Array<T>
      hasDuplicates(): boolean
      distance(other: Array<T>): number
      intersection(other: Array<T>): Array<T>
      mapPush(mapFunction: (value: T) => T): Array<T>
   }
   interface String {
      node({ isLeaf }: { isLeaf: boolean }): TreeNode<Chord>
   }
}

// eslint-disable-next-line no-extend-native
Object.prototype.apply = function <T>(this: T, effect: (object: T) => void) {
   effect(this)
   return this
}

// eslint-disable-next-line no-extend-native
Map.prototype.filterByKey = function <K, V>(this: Map<K, V>, criteria: (key: K) => boolean) {
   const map = new Map<K, V>()
   this.forEach((value, key) => {
      if (criteria(key)) {
         map.set(key, value)
      }
   })
   return map
}

// eslint-disable-next-line no-extend-native
Array.prototype.groupBy = function <K, T>(this: T[], grouper: (group: T) => K) {
   const map = new Map<K, T[]>()
   this.forEach((element) => {
      const key = grouper(element)
      if (!map.has(key)) {
         map.set(key, [...[element]])
      } else {
         map.set(key, [...map.get(key) as T[], element])
      }
   })
   return map
}

// eslint-disable-next-line no-extend-native
Array.prototype.intersection = function <T>(this: T[], other: T[]) {
   const intersection = [] as T[]
   this.forEach((element) => {
      if (other.includes(element)) {
         intersection.push(element)
      }
   })
   return intersection
}

// eslint-disable-next-line no-extend-native
Array.prototype.removeDuplicates = function <T>(this: T[]) {
   return this.filter((value, index, self) => self.indexOf(value) === index)
}

// eslint-disable-next-line no-extend-native
Array.prototype.hasDuplicates = function <T>(this: T[]) {
   return this.length !== this.removeDuplicates().length
}

// eslint-disable-next-line no-extend-native
Array.prototype.shuffle = function <T>(this: T[]) {
   return this.sort(() => Math.random() - 0.5)
}

// eslint-disable-next-line no-extend-native
Array.prototype.distance = function <T>(this: T[], other: T[]) {
   const thisArray = this as unknown as number[]
   const otherArray = other as unknown as number[]
   return this.reduce((acc, _, index) => acc + Math.abs(thisArray[index] - otherArray[index]), 0)
}

// eslint-disable-next-line no-extend-native
Array.prototype.mapPush = function <T, U>(this: T[], mapFunction: (value: T) => U) {
   return [...this, this.map(value => mapFunction(value))]
}

// eslint-disable-next-line no-extend-native
String.prototype.node = function (this: string, { isLeaf }: { isLeaf: boolean }) {
   return new TreeNode<Chord>(new Chord({
      notes: Progression.fromRomanNumerals("C", [this.toString()])
         .map(chordName => TonalChord.get(chordName).notes)[0]
         .map(noteName => (TonalNote.get(`${noteName}0`).midi as number) - 12)
         /* TODO 
         * What we are trying here is to make sure the chord is properly ordered. F, A, C === 5, 9, 12 !== 5, 9, 0
         * We need to find an easier way of solving this.
         */
         .map((note, index, array) => index > 0 && note <= array[index - 1] ? note + 12 : note)
         .map((note, index, array) => index > 0 && note <= array[index - 1] ? note + 12 : note)
         .map((note, index, array) => index > 0 && note <= array[index - 1] ? note + 12 : note)
         .map((note, index, array) => index > 0 && note <= array[index - 1] ? note + 12 : note)
         .map((note, index, array) => index > 0 && note <= array[index - 1] ? note + 12 : note),
      label: this.toString(),
      duration: 0,
   }), isLeaf)
}

export function intersection<T>(...arrays: T[][]): T[] {
   const intersection = arrays[0] as T[]
   arrays.forEach((array) => intersection.push(...intersection.intersection(array)))
   return intersection
}
