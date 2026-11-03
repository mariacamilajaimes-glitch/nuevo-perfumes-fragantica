import React, { useState } from 'react';
import {
  CatalogFragrance,
  findSimilarFragrancesJaccard,
  TieredJaccardResult,
  getOccasionDescription,
  getFullFragranceReview
} from '../data/fraganzaCatalog';
import {
  getRealNotePhoto,
  computeFragranticaAccords,
  BRAND_CONFIGS,
  getPerfumeBottlePhoto
} from '../data/fragranceVisuals';
import {
  X,
  Heart,
  Sparkles,
  Flame,
  Info,
  ChevronRight,
  ShieldCheck,
  Layers,
  Clock,
  Compass,
  Droplets,
  Wind,
  Percent,
  Calculator
} from 'lucide-react';

interface FragranceModalProps {
  fragrance: CatalogFragrance | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectAnother: (fragrance: CatalogFragrance) => void;
}

export const FragranceModal: React.FC<FragranceModalProps> = ({
  fragrance,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectAnother,
}) => {
  const [selectedNotePopup, setSelectedNotePopup] = useState<string | null>(null);

  if (!fragrance) return null;

  // Similar perfumes calculated using Weighted Jaccard Similarity (Salida 25%, Corazón 35%, Fondo 40%)
  const similarItems: TieredJaccardResult[] = findSimilarFragrancesJaccard(fragrance, 4);

  // Fragrantica Accords
  const mainAccords = computeFragranticaAccords(
    fragrance.family,
    fragrance.allNotes,
    fragrance.sweetness,
    fragrance.intensity
  );

  // Brand config
  const brandCfg = BRAND_CONFIGS[fragrance.brand] || {
    label: fragrance.brand.toUpperCase(),
    fontClass: 'tracking-widest font-sans font-bold',
    bgColor: '#ffffff',
    textColor: '#1a1a1a'
  };

  const bottlePhoto = getPerfumeBottlePhoto(fragrance.name, fragrance.gender, fragrance.image, fragrance.code);

  // Intensity meter values (Fragrantica style)
  const intensityLevels = [
    { id: 'Suave', label: 'Suave', bars: 1, sillage: 'Íntimo (~0.5 m)', desc: 'Aura discreta y pegada a la piel' },
    { id: 'Moderada', label: 'Moderada', bars: 2, sillage: 'Elegante (~1.5 m)', desc: 'Proyección a la distancia de un brazo' },
    { id: 'Intensa', label: 'Intensa', bars: 3, sillage: 'Notable (~2.5 m)', desc: 'Estela que deja huella al pasar' },
    { id: 'Envolvente', label: 'Envolvente', bars: 4, sillage: 'Descomunal (>3 m)', desc: 'Máxima fijación y difusión' },
  ];

  const currentLevelIdx =
    fragrance.intensity === 'Suave'
      ? 1
      : fragrance.intensity === 'Moderada'
      ? 2
      : fragrance.intensity === 'Intensa'
      ? 3
      : 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#0c0c0c] border border-[#C9A84C]/40 rounded-3xl shadow-2xl shadow-[#C9A84C]/20 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-stone-100 bg-black/70 hover:bg-black rounded-full transition-colors border border-stone-800"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-8 space-y-8">
          {/* TOP SECTION: Fragrantica layout with Bottle on Left and Brand/Accords on Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left: Real Bottle Photo & Code */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative w-full aspect-[3/4] max-w-xs mx-auto rounded-3xl overflow-hidden border border-[#C9A84C]/40 shadow-2xl bg-gradient-to-b from-stone-900 via-[#0d0d0d] to-black p-4 flex items-center justify-center group">
                <img
                  src={bottlePhoto}
                  alt={fragrance.name}
                  className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(201,168,76,0.15)] group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Code badge */}
                <div className="absolute top-3 left-3 bg-black/90 backdrop-blur-md px-3 py-1 rounded-xl border border-[#C9A84C]/60 text-xs font-mono font-bold text-[#F0D080] shadow">
                  {fragrance.code}
                </div>

                {/* Favorite button */}
                <button
                  type="button"
                  onClick={() => onToggleFavorite(fragrance.id)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/80 border border-stone-800 text-stone-300 hover:text-rose-400 shadow"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Gender badge */}
                <span className={`absolute bottom-3 right-3 text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${
                  fragrance.gender === 'Dama'
                    ? 'bg-rose-950/90 text-rose-200 border border-rose-800'
                    : fragrance.gender === 'Caballero'
                    ? 'bg-blue-950/90 text-blue-200 border border-blue-800'
                    : 'bg-amber-950/90 text-amber-200 border border-amber-800'
                }`}>
                  {fragrance.gender}
                </span>
              </div>
            </div>

            {/* Right: Brand Card, Name & Fragrantica "Acordes Principales" */}
            <div className="md:col-span-7 space-y-4">
              {/* Brand Logo Card & Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className="inline-block px-3 py-1 rounded-md text-xs shadow mb-2 font-black uppercase"
                    style={{ backgroundColor: brandCfg.bgColor, color: brandCfg.textColor }}
                  >
                    <span className={brandCfg.fontClass}>{brandCfg.label}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-luxury text-stone-100 tracking-tight">
                    {fragrance.name}
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {fragrance.family} · <span className="text-[#F0D080]">{fragrance.subfamily}</span>
                  </p>
                </div>
              </div>

              {/* Acordes Principales (Ordenados de mayor a menor) */}
              <div className="p-4 rounded-2xl bg-[#141414] border border-stone-800 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#F0D080] font-bold block">
                  acordes principales (de mayor a menor)
                </span>
                <div className="space-y-1.5 pt-1">
                  {mainAccords.map((accord) => (
                    <div
                      key={accord.name}
                      style={{
                        backgroundColor: accord.color,
                        color: accord.textColor,
                        width: `${accord.percentage}%`
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
                    >
                      {accord.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Intensity & Sillage Gauge */}
              <div className="p-4 rounded-2xl bg-[#141414] border border-[#C9A84C]/30 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#F0D080] uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#C9A84C]" />
                    <span>Intensidad & Estela</span>
                  </span>
                  <span className="font-bold text-stone-100 px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-[11px]">
                    {fragrance.intensity}
                  </span>
                </div>

                {/* 4 Segment Gauge */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {intensityLevels.map((lvl, idx) => {
                    const active = idx < currentLevelIdx;
                    return (
                      <div key={lvl.id} className="space-y-1">
                        <div
                          className={`h-2.5 rounded-full transition-all ${
                            active
                              ? 'bg-gradient-to-r from-[#A07830] via-[#C9A84C] to-[#F0D080] shadow-sm shadow-[#C9A84C]/40'
                              : 'bg-stone-800'
                          }`}
                        />
                        <span className={`text-[9px] block text-center uppercase tracking-tighter ${
                          active ? 'text-[#F0D080] font-bold' : 'text-stone-600'
                        }`}>
                          {lvl.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-800/60">
                  <span>Radio de proyección: <strong className="text-stone-200">{intensityLevels[currentLevelIdx - 1]?.sillage}</strong></span>
                  <span>{intensityLevels[currentLevelIdx - 1]?.desc}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ¿A QUÉ HUELE ESTA FRAGANCIA? (Reseña Sensorial Oficial Completa) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#141414] border border-[#C9A84C]/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F0D080]" />
                <h3 className="text-sm sm:text-base font-bold font-serif-luxury text-[#F0D080] uppercase tracking-wider">
                  ¿A Qué Huele Esta Fragancia?
                </h3>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">
                Reseña Olfativa Oficial Fraganza
              </span>
            </div>

            <p className="text-sm text-stone-200 leading-relaxed font-sans">
              {getFullFragranceReview(fragrance)}
            </p>

            {/* Sensory Breakdown Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800">
                <span className="text-stone-500 block text-[10px] uppercase font-mono">Sensación:</span>
                <span className="text-stone-100 font-semibold truncate block mt-0.5">{fragrance.sensation || 'Cálida / Especiada'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800">
                <span className="text-stone-500 block text-[10px] uppercase font-mono">Nivel de Dulzor:</span>
                <span className="text-[#F0D080] font-semibold truncate block mt-0.5">{fragrance.sweetness || 'Moderado'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800">
                <span className="text-stone-500 block text-[10px] uppercase font-mono">Piel Óptima:</span>
                <span className="text-emerald-300 font-semibold truncate block mt-0.5">{fragrance.skinCompat}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800">
                <span className="text-stone-500 block text-[10px] uppercase font-mono">Personalidad:</span>
                <span className="text-stone-100 font-semibold truncate block mt-0.5">{fragrance.personality || 'Seductor, Urbano'}</span>
              </div>
            </div>
          </div>

          {/* CUÁNDO USARLO */}
          <div className="p-5 rounded-3xl bg-[#0f0f0f] border border-stone-800 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#F0D080] font-bold block">
              ════ CUÁNDO USARLO ════
            </span>
            <p className="text-sm text-stone-300 leading-relaxed">
              {getOccasionDescription(fragrance.occasion)}
            </p>
            <div className="pt-2 text-xs text-stone-400 flex items-center gap-3">
              <span>Ambiente: <strong className="text-stone-200">{fragrance.environment}</strong></span>
              <span>•</span>
              <span>Rango de edad recomendado: <strong className="text-stone-200">{fragrance.ageRange}</strong></span>
            </div>
          </div>

          {/* OLFACTORY PYRAMID WITH REAL PHOTOGRAPHIC NOTE TILES */}
          <div className="p-6 rounded-3xl bg-[#0d0d0d] border border-[#C9A84C]/35 space-y-6">
            <div className="text-center space-y-1 border-b border-stone-800 pb-3">
              <span className="text-xs uppercase tracking-widest text-[#F0D080] font-bold">
                ════ PIRÁMIDE OLFATIVA ════
              </span>
              <p className="text-xs text-stone-400">
                Evolución de las notas con fotografías reales de cada ingrediente natural.
              </p>
            </div>

            {/* NOTAS DE SALIDA (TOP) */}
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-bold text-[#F0D080]">
                <span>SALIDA (Top Notes)</span>
                <span className="text-[10px] text-stone-500 font-normal">Primeros 15 minutos</span>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {fragrance.pyramid.top.map((note) => {
                  const visual = getRealNotePhoto(note);
                  return (
                    <div
                      key={note}
                      onClick={() => setSelectedNotePopup(note)}
                      className="flex flex-col items-center p-2 rounded-2xl bg-[#141414] border border-stone-800 hover:border-[#C9A84C] cursor-pointer group transition-all"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white p-1 overflow-hidden shadow group-hover:scale-105 transition-transform">
                        <img
                          src={visual.photoUrl}
                          alt={note}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <span className="text-xs text-stone-200 mt-1.5 group-hover:text-[#F0D080] max-w-[80px] text-center truncate">
                        {note.toLowerCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NOTAS DE CORAZÓN (HEART) */}
            <div className="space-y-2 text-center pt-2 border-t border-stone-800/80">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-bold text-rose-300">
                <span>CORAZÓN (Heart Notes)</span>
                <span className="text-[10px] text-stone-500 font-normal">2 a 4 horas</span>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {fragrance.pyramid.heart.map((note) => {
                  const visual = getRealNotePhoto(note);
                  return (
                    <div
                      key={note}
                      onClick={() => setSelectedNotePopup(note)}
                      className="flex flex-col items-center p-2 rounded-2xl bg-[#141414] border border-stone-800 hover:border-rose-400 cursor-pointer group transition-all"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white p-1 overflow-hidden shadow group-hover:scale-105 transition-transform">
                        <img
                          src={visual.photoUrl}
                          alt={note}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <span className="text-xs text-stone-200 mt-1.5 group-hover:text-rose-300 max-w-[80px] text-center truncate">
                        {note.toLowerCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NOTAS DE FONDO (BASE) */}
            <div className="space-y-2 text-center pt-2 border-t border-stone-800/80">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-bold text-amber-300">
                <span>BASE / FONDO (Base Notes)</span>
                <span className="text-[10px] text-stone-500 font-normal">Más de 6 a 12 horas</span>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {fragrance.pyramid.base.map((note) => {
                  const visual = getRealNotePhoto(note);
                  return (
                    <div
                      key={note}
                      onClick={() => setSelectedNotePopup(note)}
                      className="flex flex-col items-center p-2 rounded-2xl bg-[#141414] border border-stone-800 hover:border-amber-400 cursor-pointer group transition-all"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white p-1 overflow-hidden shadow group-hover:scale-105 transition-transform">
                        <img
                          src={visual.photoUrl}
                          alt={note}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <span className="text-xs text-stone-200 mt-1.5 group-hover:text-amber-300 max-w-[80px] text-center truncate">
                        {note.toLowerCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PERFUMES SIMILARES: ALGORITMO JACCARD PONDERADO (SALIDA 25%, CORAZÓN 35%, FONDO 40%) */}
          <div className="space-y-4 pt-6 border-t border-stone-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-lg font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F0D080]" />
                  Fragancias Similares (Similitud Jaccard Ponderada)
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Calculado mediante intersección y unión ponderada por niveles de pirámide: Salida (25%), Corazón (35%) y Fondo (40%).
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#181818] border border-[#C9A84C]/40 text-[11px] font-mono text-[#F0D080] self-start sm:self-auto">
                <Calculator className="w-3.5 h-3.5" />
                <span>Jaccard Ponderado</span>
              </div>
            </div>

            {similarItems.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-[#121212] border border-stone-800 text-xs text-stone-400">
                No hay otras fragancias en este rango con afinidad de notas compartidas suficientes.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarItems.map(({ fragrance: sim, jaccardPercentage, sharedTopNotes, sharedHeartNotes, sharedBaseNotes, allSharedNotes }) => {
                  const simBottle = getPerfumeBottlePhoto(sim.name, sim.gender, sim.image, sim.code);
                  return (
                    <div
                      key={sim.id}
                      onClick={() => onSelectAnother(sim)}
                      className="p-3.5 rounded-2xl bg-[#121212] border border-stone-800 hover:border-[#C9A84C] cursor-pointer group transition-all flex flex-col justify-between space-y-3 relative overflow-hidden"
                    >
                      {/* Jaccard Match Score Pill */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-[#F0D080] border border-stone-800 font-bold">
                          {sim.code}
                        </span>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1e1708] border border-[#C9A84C]/60 text-[11px] font-bold text-[#F0D080]">
                          <Sparkles className="w-2.5 h-2.5 text-[#F0D080]" />
                          <span>{jaccardPercentage}%</span>
                        </div>
                      </div>

                      {/* Flacon bottle real photo */}
                      <div className="relative aspect-square rounded-xl bg-gradient-to-b from-stone-900 to-black border border-stone-800/80 p-2 overflow-hidden flex items-center justify-center">
                        <img
                          src={simBottle}
                          alt={sim.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                        />
                        <span className={`absolute bottom-1.5 right-1.5 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          sim.gender === 'Dama'
                            ? 'bg-rose-950/90 text-rose-200 border border-rose-800'
                            : sim.gender === 'Caballero'
                            ? 'bg-blue-950/90 text-blue-200 border border-blue-800'
                            : 'bg-amber-950/90 text-amber-200 border border-amber-800'
                        }`}>
                          {sim.gender}
                        </span>
                      </div>

                      {/* Name & Brand */}
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block truncate">
                          {sim.brand}
                        </span>
                        <h5 className="font-bold text-xs text-stone-100 truncate group-hover:text-[#F0D080]">
                          {sim.name}
                        </h5>
                        <span className="text-[10px] text-stone-400 truncate block mt-0.5">
                          {sim.family}
                        </span>
                      </div>

                      {/* Tiered Jaccard Progress Bar */}
                      <div className="space-y-1">
                        <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                          <div
                            className="h-full bg-gradient-to-r from-[#C9A84C] to-[#F0D080] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(15, jaccardPercentage))}%` }}
                          />
                        </div>
                      </div>

                      {/* Shared Notes by Tier */}
                      <div className="pt-2 border-t border-stone-800/80 space-y-1 text-[10px]">
                        {sharedTopNotes.length > 0 && (
                          <div className="flex items-start gap-1 text-stone-300">
                            <span className="text-[#F0D080] font-semibold shrink-0">Salida:</span>
                            <span className="truncate text-stone-400">{sharedTopNotes.join(', ')}</span>
                          </div>
                        )}
                        {sharedHeartNotes.length > 0 && (
                          <div className="flex items-start gap-1 text-stone-300">
                            <span className="text-rose-400 font-semibold shrink-0">Corazón:</span>
                            <span className="truncate text-stone-400">{sharedHeartNotes.join(', ')}</span>
                          </div>
                        )}
                        {sharedBaseNotes.length > 0 && (
                          <div className="flex items-start gap-1 text-stone-300">
                            <span className="text-amber-400 font-semibold shrink-0">Fondo:</span>
                            <span className="truncate text-stone-400">{sharedBaseNotes.join(', ')}</span>
                          </div>
                        )}
                        {allSharedNotes.length === 0 && (
                          <span className="text-stone-500 italic block">Similitud por familia y acordes</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* INGREDIENT DETAIL POPUP MODAL (REAL BOTANICAL PHOTOGRAPHY) */}
        {selectedNotePopup && (() => {
          const noteVisual = getRealNotePhoto(selectedNotePopup);
          const isTop = fragrance.pyramid.top.includes(selectedNotePopup);
          const isHeart = fragrance.pyramid.heart.includes(selectedNotePopup);
          const isBase = fragrance.pyramid.base.includes(selectedNotePopup);

          return (
            <div
              className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
              onClick={() => setSelectedNotePopup(null)}
            >
              <div
                className="relative w-full max-w-sm bg-[#121212] border border-[#C9A84C]/50 rounded-3xl p-6 shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setSelectedNotePopup(null)}
                  className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 bg-stone-900 rounded-full border border-stone-800"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-24 h-24 mx-auto rounded-2xl bg-white p-1.5 shadow-xl overflow-hidden border border-stone-700">
                  <img
                    src={noteVisual.photoUrl}
                    alt={selectedNotePopup}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-[#F0D080]">
                    {noteVisual.category}
                  </span>
                  <h4 className="text-xl font-bold font-serif-luxury text-stone-100 capitalize">
                    {selectedNotePopup}
                  </h4>
                  <div className="flex justify-center gap-1.5 pt-1 text-[11px]">
                    {isTop && (
                      <span className="px-2 py-0.5 rounded bg-stone-900 border border-[#F0D080]/40 text-[#F0D080] font-semibold">
                        Salida (Top)
                      </span>
                    )}
                    {isHeart && (
                      <span className="px-2 py-0.5 rounded bg-stone-900 border border-rose-500/40 text-rose-300 font-semibold">
                        Corazón (Heart)
                      </span>
                    )}
                    {isBase && (
                      <span className="px-2 py-0.5 rounded bg-stone-900 border border-amber-500/40 text-amber-300 font-semibold">
                        Fondo (Base)
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed text-center bg-black/40 p-3 rounded-xl border border-stone-800">
                  {noteVisual.description}
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedNotePopup(null)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-[#A07830] to-[#C9A84C] text-stone-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition"
                >
                  Cerrar Ficha
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
