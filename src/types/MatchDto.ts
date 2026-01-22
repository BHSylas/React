export interface MatchDto {
  id: number;
  teamA: string;
  teamB: string;
  homeAmount: number;
  awayAmount: number;
  yourPrevBet: number;
  matchDate: string;
  description: string;
  predictionOpen: boolean;
  alreadyPredicted: boolean;
  yourPrevResult: string;
}
