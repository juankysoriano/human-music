// ===== TRANSFORMACIONES GEOMÉTRICAS MUSICALES =====
// Sistema de motivos con operaciones de transformación

import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D"

export interface Motif {
   intervals: number[]      // Intervalos desde la nota raíz (en semitonos)
   durations: number[]      // Duraciones relativas
   velocities: number[]     // Velocidades (0-127)
}

// Motivos básicos para pruebas
export const basicMotifs: { [key: string]: Motif } = {
   // Ascendente simple
   ascending: {
      intervals: [0, 2, 4, 5],
      durations: [1, 1, 1, 2],
      velocities: [100, 90, 95, 110],
   },
   // Descendente simple
   descending: {
      intervals: [7, 5, 4, 0],
      durations: [1, 1, 1, 2],
      velocities: [110, 95, 90, 100],
   },
   // Ondulante
   wave: {
      intervals: [0, 2, 0, -2, 0],
      durations: [1, 1, 1, 1, 2],
      velocities: [100, 80, 100, 80, 100],
   },
   // Salto y retorno
   leap_return: {
      intervals: [0, 7, 4, 2, 0],
      durations: [1, 2, 1, 1, 2],
      velocities: [100, 110, 90, 85, 100],
   },
   // Arpegio mayor
   arpeggio_major: {
      intervals: [0, 4, 7, 12, 7, 4, 0],
      durations: [1, 1, 1, 2, 1, 1, 2],
      velocities: [90, 95, 100, 110, 100, 95, 90],
   },
   // Arpegio menor
   arpeggio_minor: {
      intervals: [0, 3, 7, 12, 7, 3, 0],
      durations: [1, 1, 1, 2, 1, 1, 2],
      velocities: [90, 95, 100, 110, 100, 95, 90],
   },
}

// ===== OPERACIONES DE TRANSFORMACIÓN =====

export class MotifTransformer {
   private automata: CellularAutomata1D

   constructor(automata: CellularAutomata1D) {
      this.automata = automata
   }

   // Inversión: intervalos en dirección opuesta
   invert(motif: Motif, axis: number = 0): Motif {
      return {
         intervals: motif.intervals.map(i => axis * 2 - i),
         durations: [...motif.durations],
         velocities: [...motif.velocities],
      }
   }

   // Retrogradación: al revés
   retrograde(motif: Motif): Motif {
      return {
         intervals: this.calculateRetrogradeIntervals(motif.intervals),
         durations: [...motif.durations].reverse(),
         velocities: [...motif.velocities].reverse(),
      }
   }

   // Cálculo de intervalos para retrogradación
   private calculateRetrogradeIntervals(intervals: number[]): number[] {
      if (intervals.length <= 1) return intervals
      
      const result: number[] = [intervals[intervals.length - 1]]
      for (let i = intervals.length - 2; i >= 0; i--) {
         const diff = intervals[i + 1] - intervals[i]
         result.push(result[result.length - 1] - diff)
      }
      return result
   }

   // Augmentación: duraciones × factor
   augment(motif: Motif, factor: number = 2): Motif {
      return {
         intervals: [...motif.intervals],
         durations: motif.durations.map(d => d * factor),
         velocities: [...motif.velocities],
      }
   }

   // Diminución: duraciones ÷ factor
   diminish(motif: Motif, factor: number = 2): Motif {
      return {
         intervals: [...motif.intervals],
         durations: motif.durations.map(d => Math.max(0.25, d / factor)),
         velocities: [...motif.velocities],
      }
   }

   // Transposición: mover todo el motivo
   transpose(motif: Motif, semitones: number): Motif {
      return {
         intervals: motif.intervals.map(i => i + semitones),
         durations: [...motif.durations],
         velocities: [...motif.velocities],
      }
   }

   // Rotación: mover el patrón circularmente
   rotate(motif: Motif, positions: number): Motif {
      const len = motif.intervals.length
      const normalizedPos = ((positions % len) + len) % len
      
      return {
         intervals: [
            ...motif.intervals.slice(normalizedPos),
            ...motif.intervals.slice(0, normalizedPos),
         ],
         durations: [
            ...motif.durations.slice(normalizedPos),
            ...motif.durations.slice(0, normalizedPos),
         ],
         velocities: [
            ...motif.velocities.slice(normalizedPos),
            ...motif.velocities.slice(0, normalizedPos),
         ],
      }
   }

   // Escalar intervalos (más/menos disonante)
   scaleIntervals(motif: Motif, factor: number): Motif {
      const root = motif.intervals[0]
      return {
         intervals: motif.intervals.map((i, idx) => 
            idx === 0 ? i : root + (i - root) * factor
         ),
         durations: [...motif.durations],
         velocities: [...motif.velocities],
      }
   }

   // Combinación: inversión + retrogradación (cruz invertida)
   inverseRetrograde(motif: Motif, axis: number = 0): Motif {
      return this.retrograde(this.invert(motif, axis))
   }

   // Fragmentación: extraer sub-motivo
   fragment(motif: Motif, start: number, length: number): Motif {
      return {
         intervals: motif.intervals.slice(start, start + length),
         durations: motif.durations.slice(start, start + length),
         velocities: motif.velocities.slice(start, start + length),
      }
   }

   // Varía el motivo usando el autómata celular para decidir transformaciones
   vary(motif: Motif): Motif {
      const leeDist = this.automata.leeDistance()
      const transformations = [
         () => this.invert(motif),
         () => this.retrograde(motif),
         () => this.augment(motif, 1.5),
         () => this.diminish(motif, 1.5),
         () => this.rotate(motif, 1),
         () => this.transpose(motif, leeDist % 12 - 6),
         () => this.inverseRetrograde(motif),
         () => motif, // sin cambio
      ]
      
      const transformIndex = leeDist % transformations.length
      return transformations[transformIndex]()
   }
}

// ===== SISTEMA DE MEMORIA TEMÁTICA =====
// Guarda motivos y sus transformaciones para recapitulación

export class ThematicMemory {
   private themes: Map<string, Motif[]> = new Map()
   private currentTheme: string = "default"

   constructor() {
      this.themes.set("default", [])
   }

   // Almacena un motivo
   store(name: string, motif: Motif) {
      if (!this.themes.has(name)) {
         this.themes.set(name, [])
      }
      this.themes.get(name)!.push(motif)
   }

   // Recupera todos los motivos de un tema
   recall(name: string): Motif[] {
      return this.themes.get(name) || []
   }

   // Establece tema actual
   setCurrentTheme(name: string) {
      this.currentTheme = name
      if (!this.themes.has(name)) {
         this.themes.set(name, [])
      }
   }

   // Recapitulación: devuelve motivos del tema en orden inverso (clásica forma sonata)
   recapitulate(name?: string): Motif[] {
      const themeName = name || this.currentTheme
      const motifs = this.themes.get(themeName) || []
      return [...motifs].reverse()
   }

   // Desarrollo: aplica transformaciones aleatorias a motivos del tema
   develop(name: string, transformer: MotifTransformer): Motif[] {
      const motifs = this.themes.get(name) || []
      return motifs.map(m => transformer.vary(m))
   }
}