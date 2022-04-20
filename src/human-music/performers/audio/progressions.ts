import { TreeNode } from "../../utils/data-structures/TreeNote"
import "../../utils/extensions"
import { Chord } from "./music-models"

export const progressions_list: string[] = [
   //### MAJOR ###
   //#"bIIIM IIm bIIM I",
   //#"IM7 V7 VI9 IVM7",
   "I bIIIM bVIIM IV",
   "I bIIIM bVIM bVIIM",
   //#"I bIIM bIIIM bIIM",
   //#"I bIIM I IIIm",
   //#"I bVIIM bVIM bIIM",
   "I bVIIM IV I",
   //#"I bVIM I bIIM",
   "IIm7 V9 IM7 IM7",
   //#"IIm bIIM I bVIIM",
   //#"IIm bVIIM7 I",
   "I IIIm IV VIm",
   "I IIIm VIm Isus4",
   "I IIIm VIm IV",
   //#"I IIM IIIm V6",
   "I I IV IIIm",
   "IIIm VIm IV I",
   "IIm IV V V",
   "IIm7 V7 IIIm7 VIm7 IIm7 V7",
   //#"I IV bIIIM bVIM",
   "I IV bVIIM IV",
   "IIm V I I",
   "IIm V I IV",
   "I IV IIm V",
   //#"I IV Isus2 IV",
   //#"I IV V bVIIM",
   "I IV VIm V",
   "I IV V V",
   //#"I V bVIIM IV",
   "IV I IIIm IV",
   "I VIm IIm IV",
   "IV I IIm VIm",
   "I VIm IIm V",
   "I VIm I IV",
   "I VIm IV IIIm",
   "I V I IV",
   "I VIm IV V",
   "IV IV I V",
   "I V IV VIm",
   "IV I V VIm",
   "IV VIm IIIm I",
   "I V VIm IIIm IV I IV V",
   "I V VIm IIIm IV",
   "I V VIm IIm",
   "I V VIm IV",
   "I V VIm V",
   //#"VIm bVIM bVIIM I",
   "VIm IV I V",
   //#"VIm VIIo V VIm #IVo V",
   "V I VIm V",
   "VIm V IV V IIm V I I",
   "VIm V IV V",
   "V IV VIm I",
   "V VIm IV I",
   //### Minor ###
   "Im7 bVI bIIIM7 bVII6 Im Im7 bIIIM7 IVm7",
   "Im bVIIM bVIM bVIIM",
   "Im bVIIM bVI bIIIM",
   "IIm7b5 V9 Im7",
   "Im bIII IVm bVI",
   "Im bIII bVII bVI",
   //#"Im IIo Vm Im",
   "Im IVm bIII bVI",
   //#"IIo bVI Im IVm",
   //#"IIo Vm Im Im",
   //#"IIo Vm Im IVm",
   "Im IVm bVII Im",
   "Im IVm bVII Vm",
   "Im IVm Vm IVm",
   "Im IVm bVI Vm",
   "Im IVm Vm Vm",
   "Im bVI bIm Vm",
   "Im bVI bIII Vm",
   "Im bVI bIII bVII Im bVI6/9 bIIIM7 bVII",
   "Im bVI bIII bVII",
   "IVm bIII bVII Im",
   "Im bVII Im Vm bIII bVII Im Vm Im",
   "Im bVII Im Vm",
   //#"IVm bIII Vsus4 bVI IVm Im bIII bVI",
   "Im bVII bVI bIII IVm bVI bVII Im",
   "Im bVII bVI bIII",
   "Im bVI IVm bIII",
   //#"Im bVI IVm IIo",
   "Im bVII bVI bVII",
   "Im bVI IVm Vm",
   "Im bVI bVII bVII",
   "Im bVI bVII Vm",
   "Im Vm IVm bVII",
   "IVm Im Vm bVI",
   "IVm bVI bVII Im",
   "IVm Vm bVI bVII",
   "bVI bVI Im bVII",
   "bVII IVm bVII Im",
   "bVII IVm Vm Im",
   "bVI Im Vm bIII",
   "bVI IVm Im Vm",
   "Vm Im IVm bVII",
   "bVI Im Vm Vm",
   "bVI bVII Im bIII",
   "Vm IVm Im Im",
   "bVI bVII Vm bIII",
   "bVI bVI Im bVII",
   "bVI VIm Im bVII",
   "Vm bVI bIII Im",
   "Vm bVI Vm Im",
]

export function convertToTree(progressions: string[]): TreeNode<Chord> {
   const root: TreeNode<Chord> = TreeNode.root()
   progressions.removeDuplicates().forEach((progression) => {
      let currentNode = root
      progression
         .split(" ")
         .map((chord, index, array) => chord.node({ isLeaf: index === array.length - 1 }))
         .forEach((chord) => {
            const next = currentNode.children.find((child) => child.value.label === chord.value.label && !child.isLeaf)
            if (next && !chord.isLeaf) {
               currentNode = next
            } else {
               currentNode.children.push(chord)
               currentNode = chord
            }
         })
   })
   return root
}
