export type RegionCode = 'PE' | 'MX' | 'AR' | 'CO' | 'CL' | 'ES' | 'GENERAL';

export type Preferences = {
  hasCompletedOnboarding: boolean;
  region: RegionCode;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
};

export type Concept = {
  id: string;
  defaultTerm: string;
  terms?: Partial<Record<RegionCode, string>>;
  regions?: RegionCode[];
};

export type DeckDefinition = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  accent: string;
  concepts: Concept[];
};

export type ResolvedCard = {
  id: string;
  term: string;
};

export type ResolvedDeck = Omit<DeckDefinition, 'concepts'> & {
  cards: ResolvedCard[];
};

export type AnswerStatus = 'correct' | 'passed';

export type RoundAnswer = ResolvedCard & {
  status: AnswerStatus;
};

export type RoundConfig = {
  deck: ResolvedDeck;
  duration: number;
  playerName: string;
};

export type RoundResult = RoundConfig & {
  id: string;
  playedAt: string;
  answers: RoundAnswer[];
};
