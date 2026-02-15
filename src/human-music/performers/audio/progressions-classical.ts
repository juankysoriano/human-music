import { TreeNode } from "../../utils/data-structures/tree-node"
import "../../utils/extensions"
import { Chord } from "./music-models"

// ===== PROGRESIONES CLÁSICAS Y OCCIDENTALES CURADAS =====
// Selección de alta calidad para música clásica, barroca, romántica y popular occidental

// ===== CLÁSICA / BARROCA =====
export const classical_progressions: string[] = [
   // Cadenas de quintas clásicas (Bach, Vivaldi)
   "I V6/4 V I",
   "I IV V I",
   "I V6/5 I V I",
   "I V4/3 I6 V I",
   "I vi ii6 V I",
   
   // Progresiones con inversión (movimiento de bajo suave)
   "I I6 IV V6/5 I",
   "I6 ii6 V I",
   "I V6/5/vi vi V6/5/ii ii V6/5 V I",
   
   // Secuencias barrocas
   "I V4/3 I6 IV V I",
   "vi IV6 I6 V",
   "I vi6 ii6 V",
   
   // Círculo de quintas completo
   "I IV vii° iii vi ii V I",
   "I V vi iii IV I ii V",
]

// ===== ROMÁNTICA (Beethoven, Chopin, Schubert) =====
export const romantic_progressions: string[] = [
   // Modulaciones tierce de Beethoven
   "I bIII I",
   "I bVI bII I",
   "I vi bVI V",
   
   // Progresiones emotivas con subV
   "I vi ii°7/V V",
   "I vi IV V",
   "I V6/vi vi ii6 V",
   
   // Color cromático romántico
   "I bVII bVI V",
   "I bIII IV V",
   "Imaj7 vi7 ii7 V7",
   
   // Chopin-style
   "I V4/2 vi6 ii6 V I",
   "I bII7 I",
   "I vi bVI V",
]

// ===== POPULAR OCCIDENTAL (Folk, Pop, Rock clásico) =====
export const pop_rock_classic: string[] = [
   // Pop clásico - I V vi IV
   "I V vi IV",
   "I V vi iii IV I ii V",
   
   // Axis progression
   "vi IV I V",
   "vi V IV V",
   
   // Pop romántico
   "I V6 vi IV",
   "Imaj7 vi7 ii7 V7",
   "I V vi ii IV V",
   
   // Rock clásico
   "I IV V",
   "I V IV",
   "I bVII IV I",
   
   // Folk americano
   "I V vi iii IV I ii V",
   "I IV vi V",
   "I V vi IV I V I",
]

// ===== JAZZ Y STANDARDS =====
export const jazz_standards: string[] = [
   // II-V-I (fundamental del jazz)
   "ii7 V7 Imaj7",
   "ii7 V7 I6",
   "ii7b5 V7b9 Im7",
   "Imaj7 ii7 V7 I6",
   
   // Rhythm changes
   "I vi ii V",
   "I I7 IV iv",
   "I V/vi vi V/ii ii V I",
   
   // Coltrane changes
   "I V7/ii ii V7/iii iii VI7 ii V7 I",
   
   // Jazz standards populares
   "Imaj7 vi7 ii7 V7",
   "Imaj7 IV7 iii7 vi7 ii7 V7 I",
]

// ===== FILM SCORE / CINEMÁTICO =====
export const cinematic_progressions: string[] = [
   // Épico/orquestal
   "I V vi IV",
   "i VI III VII",
   "i iv VI VII",
   
   // Suspenso/misterio
   "i iv v",
   "i bVI bIII",
   "i bII",
   
   // Emocional/piano
   "I V6/vi vi V/IV IV V I",
   "Imaj7 vi7 ii7 V7sus4 V7",
]

// ===== SELECCIÓN PREMIUM (Lo mejor de todo) =====
export const premium_progressions: string[] = [
   // Canon in D style
   "I V vi iii IV I IV V",
   
   // Pachelbel variations
   "I V vi iii IV I ii V",
   
   // Beethoven Sonata style
   "I vi IV V",
   "I V vi iii IV I ii V",
   
   // Chopin Nocturne
   "I V6/5 I6 IV V I",
   
   // Mozart simplicity
   "I V I",
   "I IV V I",
   
   // Bach chorale
   "I V6 I6 IV I6/4 V I",
   
   // Debussy impressionist
   "Imaj7 II7 Imaj7 V7sus4",
   
   // Modern cinematic
   "I V6/4 vi ii6 V I",
   
   // Jazz standard beautiful
   "Imaj7 vi7 ii7 V7 I6",
   
   // Pop perfection
   "I V vi IV",
   "vi IV I V",
]

// ===== FUNCIONES DE ACCESO =====

export function getClassicalProgressions(): string[] {
   return [
      ...classical_progressions,
      ...romantic_progressions,
   ]
}

export function getWesternPopularProgressions(): string[] {
   return [
      ...pop_rock_classic,
      ...jazz_standards,
   ]
}

export function getPremiumProgressions(): string[] {
   return premium_progressions
}

export function getAllCuratedProgressions(): string[] {
   return [
      ...premium_progressions,
      ...classical_progressions,
      ...romantic_progressions,
      ...pop_rock_classic,
      ...jazz_standards,
      ...cinematic_progressions,
   ].removeDuplicates()
}

// Filtrar por nivel de complejidad
export function getProgressionsByComplexity(level: "simple" | "medium" | "complex"): string[] {
   switch (level) {
      case "simple":
         // Progresiones de 2-3 acordes
         return getAllCuratedProgressions().filter(p => p.split(" ").length <= 3)
      case "medium":
         // Progresiones de 4 acordes
         return getAllCuratedProgressions().filter(p => p.split(" ").length === 4)
      case "complex":
         // Progresiones de 5+ acordes o con inversión
         return getAllCuratedProgressions().filter(p => 
            p.split(" ").length >= 5 || p.includes("/")
         )
   }
}

// Función original mantenida para compatibilidad
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