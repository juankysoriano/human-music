// ===== MÓDULO DE AUDIO EXPANDIDO =====
// Exporta todas las funcionalidades nuevas del equipo de agentes

// Original actualizado
export * from "./MIDI"
export * from "./music-models"
export * from "./operations"
export * from "./player"

// Nuevos módulos del equipo de agentes

// Agente-Armonía: Progresiones clásicas curadas
export {
   classical_progressions,
   romantic_progressions,
   pop_rock_classic,
   jazz_standards,
   cinematic_progressions,
   premium_progressions,
   getClassicalProgressions,
   getPremiumProgressions,
   getAllCuratedProgressions,
   getProgressionsByComplexity,
} from "./progressions-classical"

// Agente-Ritmo: Polirritmos y patrones
export {
   euclideanRhythm,
   commonEuclideanPatterns,
   polyrhythm3over2,
   polyrhythm4over3,
   polyrhythm5over4,
   applySwing,
   swingPresets,
   generateDrumPattern,
   rockBeats,
   funkBeats,
   type RhythmPattern,
   type Polyrhythm,
   type SwingSettings,
   type DrumPattern,
} from "./rhythms"

// Agente-Geometría: Motivos y transformaciones
export {
   basicMotifs,
   MotifTransformer,
   ThematicMemory,
   type Motif,
} from "./motifs"

// Generador clásico mejorado
export { ClassicalMusicGenerator } from "./classical-generator"

// Instrumentos
export {
   classicalInstruments,
   cinematicInstruments,
   romanticInstruments,
   baroqueInstruments,
   jazzInstruments,
   setInstruments,
   getCurrentInstruments,
   noteOnSolo,
   noteOnAccompaniment,
   noteOnBass,
} from "./MIDI"