import catalogData from './fraganzaCatalog.json';

export interface OlfactoryPyramid {
  top: string[];
  heart: string[];
  base: string[];
}

export type GenderType = 'Dama' | 'Caballero' | 'Unisex';

export type MainCategory =
  | 'Floral'
  | 'Dulce / Acaramelado'
  | 'Cítrico / Acuático'
  | 'Amaderado / Oriental';

export type IntensityLevel = 'Suave' | 'Moderada' | 'Intensa' | 'Envolvente';

export type SkinCompatibility = 'Piel Seca' | 'Piel Grasa' | 'Piel Mixta' | 'Versátil';

export interface CatalogFragrance {
  id: string;
  idNum: number;
  code: string;
  name: string;
  brand: string;
  gender: GenderType;
  family: string;
  subfamily: string;
  mainCategory: MainCategory;
  popularity: 'Alta' | 'Media';
  aromasClave: string[];
  pyramid: OlfactoryPyramid;
  allNotes: string[];
  sweetness: 'Fresco' | 'Moderado' | 'Muy Dulce' | 'Seco';
  sensation: string;
  intensity: IntensityLevel;
  skinCompat: SkinCompatibility;
  ageRange: string;
  personality: string;
  environment: 'Día' | 'Noche' | 'Indistinto';
  occasion: string;
  tags: string[];
  description: string;
  image: string;
}

export const CATALOG: CatalogFragrance[] = catalogData as CatalogFragrance[];

// Helper to get unique list of all notes in the entire catalog
export const ALL_UNIQUE_NOTES: string[] = (() => {
  const notesSet = new Set<string>();
  CATALOG.forEach(f => {
    f.allNotes.forEach(n => notesSet.add(n));
  });
  return Array.from(notesSet).sort((a, b) => a.localeCompare(b));
})();

// Helper to find similar perfumes sharing at least 2 notes with STRICT gender matching
export function findSimilarFragrances(target: CatalogFragrance, limit: number = 4): { fragrance: CatalogFragrance; sharedNotes: string[] }[] {
  const isGenderCompatible = (f: CatalogFragrance) => {
    if (target.gender === 'Dama') {
      return f.gender === 'Dama' || f.gender === 'Unisex';
    }
    if (target.gender === 'Caballero') {
      return f.gender === 'Caballero' || f.gender === 'Unisex';
    }
    return true;
  };

  const similarities = CATALOG
    .filter(f => f.id !== target.id && isGenderCompatible(f))
    .map(f => {
      const fNotesLower = f.allNotes.map(n => n.toLowerCase());
      const shared = target.allNotes.filter(n => fNotesLower.some(fn => fn.includes(n.toLowerCase()) || n.toLowerCase().includes(fn)));
      return {
        fragrance: f,
        sharedNotes: shared,
        score: shared.length * 2 + (f.mainCategory === target.mainCategory ? 3 : 0) + (f.intensity === target.intensity ? 1 : 0)
      };
    })
    .filter(item => item.sharedNotes.length >= 2)
    .sort((a, b) => b.score - a.score);

  // If less than limit, fallback to same family but STRICTLY honoring gender compatibility
  if (similarities.length < limit) {
    const existingIds = new Set(similarities.map(s => s.fragrance.id));
    const fallback = CATALOG
      .filter(f => f.id !== target.id && !existingIds.has(f.id) && isGenderCompatible(f) && f.mainCategory === target.mainCategory)
      .map(f => ({
        fragrance: f,
        sharedNotes: target.allNotes.filter(n => f.allNotes.some(fn => fn.toLowerCase().includes(n.toLowerCase()))),
        score: 1
      }))
      .slice(0, limit - similarities.length);
    return [...similarities, ...fallback];
  }

  return similarities.slice(0, limit);
}

// Occasion text generator for Question 8
export function getOccasionDescription(occasionAnswer: string): string {
  switch (occasionAnswer) {
    case 'Ocasiones especiales':
      return 'Perfecto para citas románticas, veladas elegantes o salidas nocturnas. Su intensidad y profundidad lo convierten en el compañero ideal para los momentos que quieres hacer inolvidables.';
    case 'Todo uso / Diario':
      return 'Ideal para acompañarte en tu rutina diaria. Fresco y versátil, se adapta a cualquier ambiente sin resultar invasivo.';
    case 'Oficina / Trabajo':
      return 'Su proyección discreta y elegante lo hace perfecto para entornos profesionales y espacios cerrados.';
    case 'Deportivo / Activo':
      return 'Energizante y fresco, pensado para acompañarte en movimiento sin perder personalidad.';
    default:
      return 'Versátil y distinguido, capaz de adaptarse armónicamente a tus momentos más preciados.';
  }
}

// Generates an exhaustive, complete sensory narrative without truncation
export function getFullFragranceReview(f: CatalogFragrance): string {
  const topText = f.pyramid.top.join(', ');
  const heartText = f.pyramid.heart.join(', ');
  const baseText = f.pyramid.base.join(', ');

  const cleanedDesc = f.description
    .replace(/\s+y\s+dulzor$/i, '.')
    .replace(/\s+y\s+dulzor\.$/i, '.')
    .replace(/,\s*$/, '.');

  return `${cleanedDesc} Se despliega con una apertura vivaz dominada por notas de salida de ${topText}, evolucionando hacia un corazón distinguido de ${heartText} que define su sello olfativo. En su secado final, se asienta sobre un fondo envolvente de ${baseText}, garantizando una proyección ${f.intensity.toLowerCase()} con longevidad óptima y un nivel de dulzor ${f.sweetness.toLowerCase()}, diseñada especialmente para ${f.skinCompat.toLowerCase()}.`;
}

