import { TreeNode } from "../../utils/data-structures/tree-node"
import "../../utils/extensions"
import { Chord } from "./music-models"

// Progresiones originales (mantenidas para compatibilidad)
export const progressions_list: string[] = [
   //### MAJOR ###
   "I bIIIM bVIIM IV",
   "I bIIIM bVIM bVIIM",
   "I bVIIM IV I",
   "IIm7 V9 IM7 IM7",
   "I IIIm IV VIm",
   "I IIIm VIm Isus4",
   "I IIIm VIm IV",
   "I I IV IIIm",
   "IIIm VIm IV I",
   "IIm IV V V",
   "IIm7 V7 IIIm7 VIm7 IIm7 V7",
   "I IV bVIIM IV",
   "IIm V I I",
   "IIm V I IV",
   "I IV IIm V",
   "I IIIm IV V IV",
   "I IIIm IV V",
   "I IV VIm V",
   "I IV V V",
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
   "VIm V IV I V",
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
   "Im IVm bIII bVI",
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
   "Im bVII bVI bIII IVm bVI bVII Im",
   "Im bVII bVI bIII",
   "Im bVI IVm bIII",
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

// ===== MODOS GRIEGOS =====
// Cada modo tiene su propio carácter armónico

export const dorian_progressions: string[] = [
   // Dórico: menor con VI mayor (cálido, jazzístico)
   "Im IIm bIIImaj7 IV7 VIm7 bVIImaj7",
   "Im7 IV7 VIm7 bVII7",
   "Im IV VIm bVII",
   "Im IIm7 bVIImaj7 Im7",
   "VIm7 bVIImaj7 Im7 IV7",
]

export const phrygian_progressions: string[] = [
   // Frigio: menor con bII (español/exótico)
   "Im bIImaj7 bIII7 IVm7 Vm7b5 bVImaj7",
   "Im bII7 bIIImaj7 IVm7",
   "Im bII Im bII",
   "Vm7b5 bII7 Im bII7",
]

export const lydian_progressions: string[] = [
   // Lidio: mayor con #IV (brillante/flotante)
   "I II7 #IVm7b5 Vmaj7",
   "Imaj7 II7 Vmaj7 #IVm7",
   "I #IVm7b5 II7 Vmaj7",
]

export const mixolydian_progressions: string[] = [
   // Mixolidio: mayor con bVII (rock/folk)
   "I VIm7 bVII I",
   "I bVII VIm7 I",
   "Imaj7 V7 bVII VIm7",
   "VIm7 bVII I bVII",
]

// ===== DOMINANTES SECUNDARIAS =====
// V/V, V/ii, V/vi - crean tensión direccional

export const secondary_dominants: string[] = [
   // V/V → V
   "I V7/V V I",
   "IIm7 V7/V V7 Imaj7",
   // V/ii → ii
   "I V7/IIm IIm7 V7",
   // V/vi → vi
   "I V7/VIm VIm7 IIm7",
   // Cadencia completa con dominantes secundarias
   "I V7/VIm VIm7 V7/IIm IIm7 V7/V V7 I",
]

// ===== SUSTITUTOS DE TRITONO =====
// bII7 por V7 (misma función, diferente color)

export const tritone_substitutions: string[] = [
   "IIm7 bII7 Imaj7",
   "Imaj7 bII7 IIm7",
   "VIm7 bII7 Imaj7",
   "IIm7 bII7 bVI7 Imaj7",
]

// ===== CADENAS DE QUINTAS =====
// Movimiento descendente por quintas: vi → ii → V → I

export const fifth_chains: string[] = [
   "VIm7 IIm7 V7 Imaj7",
   "IIIm7 VIm7 IIm7 V7",
   "VIm7 IIIm7 IIm7 V7 Imaj7",
   "IIm7 V7 VIm7 IIm7 V7 I",
]

// ===== MOVIMIENTO CONTRARIO =====
// Bajos descendentes, acordes ascendentes (o viceversa)

export const contrary_motion: string[] = [
   "I VIm/5 IIm/5 V/5",
   "Imaj7 VIm7b5/5 IIm7 V7",
]

// Función para obtener todas las progresiones expandidas
export function getAllProgressions(): string[] {
   return [
      ...progressions_list,
      ...dorian_progressions,
      ...phrygian_progressions,
      ...lydian_progressions,
      ...mixolydian_progressions,
      ...secondary_dominants,
      ...tritone_substitutions,
      ...fifth_chains,
      ...contrary_motion,
   ].removeDuplicates()
}

// Función para progresiones por modo
export function getProgressionsByMode(mode: "major" | "minor" | "dorian" | "phrygian" | "lydian" | "mixolydian"): string[] {
   switch (mode) {
      case "major":
         return progressions_list.filter(p => !p.includes("m"))
      case "minor":
         return progressions_list.filter(p => p.includes("m"))
      case "dorian":
         return dorian_progressions
      case "phrygian":
         return phrygian_progressions
      case "lydian":
         return lydian_progressions
      case "mixolydian":
         return mixolydian_progressions
      default:
         return progressions_list
   }
}

// Función para convertir a árbol (original mantenida)
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