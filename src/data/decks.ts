import type { Concept, DeckDefinition, RegionCode, ResolvedDeck } from '../types';

const regionalWords: Concept[] = [
  {
    id: 'popcorn',
    defaultTerm: 'palomitas',
    terms: { PE: 'canchita', MX: 'palomitas', AR: 'pochoclo', CO: 'crispetas', CL: 'cabritas', VE: 'cotufas', ES: 'palomitas' },
  },
  {
    id: 'avocado',
    defaultTerm: 'aguacate',
    terms: { PE: 'palta', MX: 'aguacate', AR: 'palta', CO: 'aguacate', CL: 'palta', VE: 'aguacate', ES: 'aguacate' },
  },
  {
    id: 'straw',
    defaultTerm: 'pajita',
    terms: { PE: 'cañita', MX: 'popote', AR: 'sorbete', CO: 'pitillo', CL: 'bombilla', VE: 'pitillo', ES: 'pajita' },
  },
  {
    id: 'beans',
    defaultTerm: 'frijoles',
    terms: { PE: 'frejoles', MX: 'frijoles', AR: 'porotos', CO: 'fríjoles', CL: 'porotos', VE: 'caraotas', ES: 'alubias' },
  },
  {
    id: 'fridge',
    defaultTerm: 'refrigerador',
    terms: { PE: 'refrigeradora', MX: 'refrigerador', AR: 'heladera', CO: 'nevera', CL: 'refrigerador', VE: 'nevera', ES: 'nevera' },
  },
  {
    id: 'tshirt',
    defaultTerm: 'camiseta',
    terms: { PE: 'polo', MX: 'playera', AR: 'remera', CO: 'camiseta', CL: 'polera', VE: 'franela', ES: 'camiseta' },
  },
  {
    id: 'pen',
    defaultTerm: 'bolígrafo',
    terms: { PE: 'lapicero', MX: 'pluma', AR: 'birome', CO: 'esfero', CL: 'lápiz pasta', VE: 'bolígrafo', ES: 'bolígrafo' },
  },
  {
    id: 'corn',
    defaultTerm: 'maíz',
    terms: { PE: 'choclo', MX: 'elote', AR: 'choclo', CO: 'mazorca', CL: 'choclo', VE: 'jojoto', ES: 'maíz' },
  },
  {
    id: 'peanuts',
    defaultTerm: 'cacahuetes',
    terms: { PE: 'maní', MX: 'cacahuates', AR: 'maní', CO: 'maní', CL: 'maní', VE: 'maní', ES: 'cacahuetes' },
  },
  {
    id: 'peach',
    defaultTerm: 'melocotón',
    terms: { PE: 'durazno', MX: 'durazno', AR: 'durazno', CO: 'durazno', CL: 'durazno', VE: 'durazno', ES: 'melocotón' },
  },
  {
    id: 'cake',
    defaultTerm: 'pastel',
    terms: { PE: 'torta', MX: 'pastel', AR: 'torta', CO: 'torta', CL: 'torta', VE: 'torta', ES: 'tarta' },
  },
  {
    id: 'car',
    defaultTerm: 'coche',
    terms: { PE: 'carro', MX: 'coche', AR: 'auto', CO: 'carro', CL: 'auto', VE: 'carro', ES: 'coche' },
  },
  {
    id: 'apartment',
    defaultTerm: 'apartamento',
    terms: { PE: 'departamento', MX: 'departamento', AR: 'departamento', CO: 'apartamento', CL: 'departamento', VE: 'apartamento', ES: 'piso' },
  },
  {
    id: 'pool',
    defaultTerm: 'piscina',
    terms: { PE: 'piscina', MX: 'alberca', AR: 'pileta', CO: 'piscina', CL: 'piscina', VE: 'piscina', ES: 'piscina' },
  },
  {
    id: 'mop',
    defaultTerm: 'fregona',
    terms: { PE: 'trapeador', MX: 'trapeador', AR: 'trapo de piso', CO: 'trapero', CL: 'trapero', VE: 'coleto', ES: 'fregona' },
  },
  {
    id: 'baby-bottle',
    defaultTerm: 'biberón',
    terms: { PE: 'biberón', MX: 'mamila', AR: 'mamadera', CO: 'tetero', CL: 'mamadera', VE: 'tetero', ES: 'biberón' },
  },
  {
    id: 'juice',
    defaultTerm: 'jugo',
    terms: { PE: 'jugo', MX: 'jugo', AR: 'jugo', CO: 'jugo', CL: 'jugo', VE: 'jugo', ES: 'zumo' },
  },
  {
    id: 'sneakers',
    defaultTerm: 'zapatillas',
    terms: { PE: 'zapatillas', MX: 'tenis', AR: 'zapatillas', CO: 'tenis', CL: 'zapatillas', VE: 'zapatos deportivos', ES: 'zapatillas' },
  },
];

const concepts = (...terms: string[]): Concept[] =>
  terms.map((term) => ({
    id: term.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'),
    defaultTerm: term,
  }));

const regionReferences: Concept[] = [
  { id: 'ceviche', defaultTerm: 'ceviche', regions: ['PE'] },
  { id: 'mistura', defaultTerm: 'anticuchos', regions: ['PE'] },
  { id: 'machu-picchu', defaultTerm: 'Machu Picchu', regions: ['PE'] },
  { id: 'chavo', defaultTerm: 'El Chavo del 8', regions: ['MX'] },
  { id: 'tacos-al-pastor', defaultTerm: 'tacos al pastor', regions: ['MX'] },
  { id: 'lucha-libre', defaultTerm: 'lucha libre', regions: ['MX'] },
  { id: 'mate', defaultTerm: 'mate', regions: ['AR'] },
  { id: 'obelisco', defaultTerm: 'el Obelisco', regions: ['AR'] },
  { id: 'alfajor', defaultTerm: 'alfajor', regions: ['AR'] },
  { id: 'arepa', defaultTerm: 'arepa', regions: ['CO'] },
  { id: 'sombrero-vueltiao', defaultTerm: 'sombrero vueltiao', regions: ['CO'] },
  { id: 'cumbia', defaultTerm: 'cumbia', regions: ['CO'] },
  { id: 'completo', defaultTerm: 'completo', regions: ['CL'] },
  { id: 'moai', defaultTerm: 'moái', regions: ['CL'] },
  { id: 'cueca', defaultTerm: 'cueca', regions: ['CL'] },
  { id: 'hallaca', defaultTerm: 'hallaca', regions: ['VE'] },
  { id: 'salto-angel', defaultTerm: 'Salto Ángel', regions: ['VE'] },
  { id: 'cuatro-venezolano', defaultTerm: 'cuatro venezolano', regions: ['VE'] },
  { id: 'paella', defaultTerm: 'paella', regions: ['ES'] },
  { id: 'flamenco', defaultTerm: 'flamenco', regions: ['ES'] },
  { id: 'churros', defaultTerm: 'churros', regions: ['ES'] },
];

const DECKS: DeckDefinition[] = [
  {
    id: 'mix',
    title: 'De todo un poco',
    description: 'Objetos, lugares y cosas que todos conocen.',
    emoji: '🎉',
    color: '#EF5B3F',
    accent: '#8D2D1D',
    concepts: [
      ...concepts(
        'paraguas', 'aeropuerto', 'cepillo de dientes', 'montaña rusa', 'control remoto', 'semáforo',
        'fotógrafo', 'supermercado', 'ascensor', 'cumpleaños', 'biblioteca', 'guitarra', 'maleta',
        'bombero', 'espejo', 'wifi', 'volcán', 'taxi', 'pirata', 'robot', 'playa', 'hospital',
      ),
      ...regionalWords.slice(0, 6),
    ],
  },
  {
    id: 'food',
    title: 'Con hambre',
    description: 'Comidas, antojos y palabras de tu región.',
    emoji: '🍿',
    color: '#F1BD3D',
    accent: '#6F4A00',
    concepts: [
      ...regionalWords.filter((item) => ['popcorn', 'avocado', 'straw', 'beans', 'corn', 'peanuts', 'peach', 'cake', 'juice'].includes(item.id)),
      ...concepts('hamburguesa', 'espaguetis', 'helado', 'limonada', 'desayuno', 'microondas', 'sandía', 'sopa', 'chocolate', 'galletas', 'queso', 'cebolla', 'café', 'picante'),
    ],
  },
  {
    id: 'actions',
    title: 'Puro movimiento',
    description: 'Acciones perfectas para actuar sin hablar.',
    emoji: '🕺',
    color: '#2F7D5B',
    accent: '#174B35',
    concepts: concepts(
      'bailar salsa', 'saltar la cuerda', 'lavarse el pelo', 'tocar batería', 'pasear al perro',
      'hacer una videollamada', 'quedarse dormido', 'abrir un regalo', 'tomarse una selfie',
      'cocinar', 'andar en bicicleta', 'nadar', 'cantar en karaoke', 'buscar las llaves',
      'estornudar', 'hacer yoga', 'tomar el sol', 'apagar una vela', 'planchar ropa',
      'perder el autobús', 'armar un mueble', 'cambiar un pañal', 'pedir la cuenta', 'ver una película',
    ),
  },
  {
    id: 'regional',
    title: 'Habla como tú',
    description: 'Palabras familiares y guiños de tu país.',
    emoji: '🗣️',
    color: '#5E65C5',
    accent: '#30346F',
    concepts: [...regionalWords, ...regionReferences],
  },
];

function resolveTerm(concept: Concept, region: RegionCode) {
  return concept.terms?.[region] ?? concept.defaultTerm;
}

export function getDecks(region: RegionCode): ResolvedDeck[] {
  return DECKS.map(({ concepts: deckConcepts, ...deck }) => ({
    ...deck,
    cards: deckConcepts
      .filter((concept) => !concept.regions || concept.regions.includes(region))
      .map((concept) => ({ id: concept.id, term: resolveTerm(concept, region) })),
  }));
}

export function shuffleCards<T>(cards: T[]): T[] {
  const copy = [...cards];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex]!, copy[index]!];
  }
  return copy;
}
