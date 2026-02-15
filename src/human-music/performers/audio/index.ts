// ===== MÓDULO DE AUDIO EXPANDIDO =====
// Exporta todas las funcionalidades nuevas del equipo de agentes

// Original
export * from "./MIDI"
export * from "./music-models"
export * from "./notes-generator"
export * from "./operations"
export * from "./player"
export * from "./progressions"
export * from "./transformations"

// Nuevos módulos del equipo de agentes

// Agente-Armonía: Progresiones expandidas
export {
   dorian_progressions,
   phrygian_progressions,
   lydian_progressions,
   mixolydian_progressions,
   secondary_dominants,
   tritone_substitutions,
   fifth_chains,
   contrary_motion,
   getAllProgressions,
   getProgressionsByMode,
} from "./progressions-expanded"

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