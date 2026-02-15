import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D"
import { TreeNode } from "../../utils/data-structures/tree-node"
import { Chord, ChordVoice, Voice } from "./music-models"
import { operations, Operations } from "./operations"
import { getPremiumProgressions, convertToTree } from "./progressions-classical"
import { euclideanRhythm, applySwing, SwingSettings } from "./rhythms"
import { MotifTransformer, ThematicMemory, basicMotifs } from "./motifs"

// ===== GENERADOR DE MÚSICA CLÁSICA MEJORADO =====

export class ClassicalMusicGenerator {
   private tone: number
   private currentNode: TreeNode<Chord>
   private automata: CellularAutomata1D
   private pulsesInBeat: number
   private tickCount = 0
   private currentPattern: number[] = []
   private motifTransformer: MotifTransformer
   private thematicMemory: ThematicMemory
   private operations: Operations[] = operations.shuffle()
   private swingSettings: SwingSettings
   private density: number = 0.6
   
   // Estados para estructura musical
   private record: TreeNode<Chord>[] = []
   private recordCount = 0
   private finishedRecording = false
   private currentSection: "exposition" | "development" | "recapitulation" = "exposition"
   private sectionProgress = 0

   constructor(automata: CellularAutomata1D, pulsesInBeat: number = 16) {
      this.automata = automata
      this.tone = Math.floor(Math.random() * 13) - 6
      this.pulsesInBeat = pulsesInBeat
      this.motifTransformer = new MotifTransformer(automata)
      this.thematicMemory = new ThematicMemory()
      
      // Usar progresiones clásicas premium
      const classicalProgressions = getPremiumProgressions()
      this.currentNode = convertToTree(classicalProgressions).shuffle()
      
      // Swing suave para música clásica
      this.swingSettings = { ratio: 0.52, strength: 0.3 }
      
      // Guardar tema inicial
      this.thematicMemory.store("main", basicMotifs.ascending)
   }

   // ===== SECCIÓN MUSICAL =====
   
   nextChord() {
      // Gestión de secciones: exposición → desarrollo → recapitulación
      this.manageMusicalForm()
      
      if (this.finishedRecording && this.currentSection !== "development") {
         // Recapitulación: repetir material
         const index = this.recordCount % this.record.length
         this.currentNode = this.record[index]
         this.recordCount++
      } else if (this.currentSection === "development") {
         // Desarrollo: más variación
         const index = this.automata.leeDistance() % this.currentNode.children.length
         const previousChord = this.currentNode.value
         this.currentNode = this.currentNode.children[index]
         
         // Variar la inversión para más interés
         if (this.automata.leeDistance() % 3 === 0) {
            this.currentNode.value.inversion(this.automata, previousChord)
         }
         
         this.record.push(this.currentNode)
         this.sectionProgress++
      } else {
         // Exposición: grabar tema
         const index = this.automata.leeDistance() % this.currentNode.children.length
         const previousChord = this.currentNode.value
         this.currentNode = this.currentNode.children[index]
         this.currentNode.value.inversion(this.automata, previousChord)
         this.record.push(this.currentNode)
         this.finishedRecording = this.currentNode.isLeaf
         this.sectionProgress++
      }
      
      console.log(`[${this.currentSection}] ${this.currentNode.value.label}`)
   }

   private manageMusicalForm() {
      // Cambiar sección según progreso
      if (this.currentSection === "exposition" && this.sectionProgress > 8) {
         this.currentSection = "development"
         this.sectionProgress = 0
         console.log("→ Development section")
      } else if (this.currentSection === "development" && this.sectionProgress > 6) {
         this.currentSection = "recapitulation"
         this.sectionProgress = 0
         this.recordCount = 0
         console.log("→ Recapitulation section")
      } else if (this.currentSection === "recapitulation" && this.sectionProgress > 8) {
         // Volver a exposición con nuevo tema
         this.currentSection = "exposition"
         this.sectionProgress = 0
         this.record = []
         this.finishedRecording = false
         console.log("→ New exposition")
      }
   }

   // ===== RITMO MEJORADO =====

   nextNote() {
      // Generar patrón rítmico euclidiano si es necesario
      if (this.currentPattern.length === 0 || this.tickCount % this.pulsesInBeat === 0) {
         this.generateRichRhythm()
      }
      
      // Aplicar operaciones para variación
      this.applyRhythmicOperations()
      
      // Limitar y normalizar patrón
      this.currentPattern = this.currentPattern
         .map((v) => (v < 0 ? v + 3 : v))
         .map((v) => v % 3)
         .slice(0, this.pulsesInBeat)
      
      this.tickCount++
   }

   private generateRichRhythm() {
      // Densidad variable según sección
      const density = this.currentSection === "development" ? 0.7 : 0.5
      const pulses = Math.floor(this.pulsesInBeat * density)
      
      // Usar ritmo euclidiano
      this.currentPattern = euclideanRhythm(pulses, this.pulsesInBeat, 0)
         .map((hit, i) => hit ? i % 3 : -1)
         .filter((v) => v >= 0)
      
      // Asegurar que hay notas
      if (this.currentPattern.length === 0) {
         this.currentPattern = [0, 1, 2]
      }
   }

   private applyRhythmicOperations() {
      // Operaciones más conservadoras para música clásica
      if (this.automata.leeDistance() % 8 === 0 && this.currentPattern.length === this.pulsesInBeat) {
         const op = this.operations[this.automata.leeDistance() % 3] // Solo operaciones suaves
         
         switch (op) {
            case Operations.REPEAT:
               this.currentPattern = this.currentPattern.slice(0, Math.floor(this.pulsesInBeat / 2))
               break
            case Operations.INVERSE:
               // Inversión sutil
               this.currentPattern = this.currentPattern.map((v) => 2 - v)
               break
         }
      }
   }

   // ===== NOTAS CON MEJOR VOICING =====

   noteFor = (voice: Voice) => {
      const patternIndex = (this.tickCount - 1) % this.currentPattern.length
      const position = this.currentPattern[patternIndex] + voice.positionInChord
      const chordNotes = this.currentNode.value.notes
      
      return (
         chordNotes[position % chordNotes.length] +
         voice.octave * 12 +
         this.tone
      )
   }

   chordFor = (chordVoice: ChordVoice) => 
      this.currentNode.value.notes.map((note) => note + chordVoice.octave * 12 + this.tone)

   // ===== ACCESORES =====

   get progressionFinished(): boolean {
      return this.finishedRecording && this.currentSection === "recapitulation"
   }

   get patternLength(): number {
      return this.currentPattern.length
   }

   get currentSectionName(): string {
      return this.currentSection
   }

   getMotifForVariation() {
      const baseMotif = this.thematicMemory.recall("main")[0] || basicMotifs.ascending
      return this.motifTransformer.vary(baseMotif)
   }
}