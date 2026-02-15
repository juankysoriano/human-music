// ===== RITMOS Y POLIRRITMOS =====
// Sistema avanzado de patrones rítmicos

export interface RhythmPattern {
   pulses: number      // Número de pulsos (notas)
   steps: number       // Número de pasos totales
   rotation: number    // Rotación del patrón
   velocity: number    // Velocidad base (0-127)
}

// Algoritmo de ritmos euclidianos
// Distribuye 'pulses' notas lo más equitativamente posible en 'steps' pasos
export function euclideanRhythm(pulses: number, steps: number, rotation: number = 0): boolean[] {
   if (pulses > steps) pulses = steps
   if (pulses <= 0) return new Array(steps).fill(false)
   
   const pattern: boolean[] = []
   const counts: number[] = []
   const remainders: number[] = []
   let divisor = steps - pulses
   let level = 0
   
   remainders.push(pulses)
   
   while (true) {
      counts.push(Math.floor(divisor / remainders[level]))
      remainders.push(divisor % remainders[level])
      divisor = remainders[level]
      level++
      
      if (remainders[level] <= 1) break
   }
   
   counts.push(divisor)
   
   const build = (level: number): boolean[] => {
      if (level === -1) {
         return [false]
      } else if (level === -2) {
         return [true]
      } else {
         const result: boolean[] = []
         for (let i = 0; i < counts[level]; i++) {
            result.push(...build(level - 1))
         }
         if (remainders[level] !== 0) {
            result.push(...build(level - 2))
         }
         return result
      }
   }
   
   const result = build(level)
   
   // Aplicar rotación
   const rotated = [...result.slice(-rotation), ...result.slice(0, -rotation)]
   
   return rotated
}

// Patrones euclidianos comunes
export const commonEuclideanPatterns: { [key: string]: RhythmPattern } = {
   // Tresillo (3 sobre 2)
   tresillo: { pulses: 3, steps: 8, rotation: 0, velocity: 100 },
   // Cinquillo (5 sobre 4) 
   cinquillo: { pulses: 5, steps: 16, rotation: 0, velocity: 90 },
   // Clave de son cubano
   son_clave: { pulses: 5, steps: 16, rotation: 0, velocity: 110 },
   // Clave de rumba
   rumba_clave: { pulses: 5, steps: 16, rotation: 1, velocity: 110 },
   // Bossa nova
   bossa_clave: { pulses: 4, steps: 16, rotation: 0, velocity: 85 },
   // Shuffle básico
   shuffle: { pulses: 6, steps: 16, rotation: 0, velocity: 95 },
}

// ===== POLIRRITMOS =====
// Dos o más ritmos simultáneos con diferentes subdivisiones

export interface Polyrhythm {
   rhythms: RhythmPattern[]
   baseTempo: number
   swing: number  // 0 = recto, 1 = swing máximo
}

// Crea un polirritmo 3:2 (tresillo contra dosillo)
export function polyrhythm3over2(baseSteps: number = 12): Polyrhythm {
   return {
      rhythms: [
         { pulses: 3, steps: baseSteps, rotation: 0, velocity: 100 },
         { pulses: 2, steps: baseSteps, rotation: 0, velocity: 90 },
      ],
      baseTempo: 120,
      swing: 0,
   }
}

// Crea un polirritmo 4:3
export function polyrhythm4over3(baseSteps: number = 12): Polyrhythm {
   return {
      rhythms: [
         { pulses: 4, steps: baseSteps, rotation: 0, velocity: 100 },
         { pulses: 3, steps: baseSteps, rotation: 0, velocity: 90 },
      ],
      baseTempo: 120,
      swing: 0,
   }
}

// Crea un polirritmo 5:4
export function polyrhythm5over4(baseSteps: number = 20): Polyrhythm {
   return {
      rhythms: [
         { pulses: 5, steps: baseSteps, rotation: 0, velocity: 100 },
         { pulses: 4, steps: baseSteps, rotation: 0, velocity: 90 },
      ],
      baseTempo: 120,
      swing: 0,
   }
}

// ===== SWING Y GROOVE =====

export interface SwingSettings {
   ratio: number     // 0.5 = recto, 0.67 = swing triplete, 0.6 = light swing
   strength: number  // 0-1, cuánto se aplica el swing
}

// Aplica swing a un tiempo de nota
export function applySwing(beatPosition: number, swing: SwingSettings): number {
   if (swing.strength <= 0) return beatPosition
   
   // En un swing típico, las notas en posición impar se retrasan
   const subBeat = beatPosition % 1
   const isOffbeat = subBeat >= 0.5
   
   if (isOffbeat) {
      const swingAmount = (swing.ratio - 0.5) * 2 * swing.strength
      return beatPosition + swingAmount * 0.5
   }
   
   return beatPosition
}

// Patrones de swing predefinidos
export const swingPresets: { [key: string]: SwingSettings } = {
   straight: { ratio: 0.5, strength: 0 },
   light_swing: { ratio: 0.58, strength: 0.6 },
   medium_swing: { ratio: 0.62, strength: 0.75 },
   heavy_swing: { ratio: 0.67, strength: 0.9 },
   shuffle: { ratio: 0.67, strength: 0.85 },
}

// ===== GENERADOR DE PATRONES DE BATERÍA =====

export interface DrumPattern {
   kick: boolean[]
   snare: boolean[]
   hihat: boolean[]
   open_hihat: boolean[]
}

// Genera patrón de batería basado en semillas
export function generateDrumPattern(steps: number = 16, density: number = 0.5): DrumPattern {
   // Kick: típicamente en 1 y 3 (pasos 0 y 8 en 16)
   const kick = euclideanRhythm(Math.floor(steps * 0.25 * density), steps, 0)
   
   // Snare: típicamente en 2 y 4 (pasos 4 y 12 en 16)
   const snare = euclideanRhythm(Math.floor(steps * 0.2 * density), steps, Math.floor(steps / 4))
   
   // Hi-hat: típicamente en cada corchea (cada paso en 16)
   const hihat = euclideanRhythm(Math.floor(steps * 0.5), steps, 0)
   
   // Open hi-hat: sporádico
   const open_hihat = euclideanRhythm(Math.floor(steps * 0.1 * density), steps, Math.floor(steps / 3))
   
   return { kick, snare, hihat, open_hihat }
}

// Patrones de batería estilo rock
export const rockBeats: DrumPattern[] = [
   // Básico: BD en 1,3 - SN en 2,4
   {
      kick: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      open_hihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
   },
   // Con bombo doble
   {
      kick: [true, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      open_hihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false],
   },
]

// Patrones de batería estilo funk
export const funkBeats: DrumPattern[] = [
   // Funk básico con ghost notes
   {
      kick: [true, false, false, true, false, true, false, false, true, false, true, false, false, true, false, false],
      snare: [false, false, true, false, true, false, false, true, false, false, true, false, true, false, false, true],
      hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      open_hihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false],
   },
]