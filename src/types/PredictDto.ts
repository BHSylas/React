export interface PredictDto{
    id: number;
    matchId: number;
    teamA: string;
    teamB: string;
    matchDate: string;
    predictedResult: string;
    predictedResultText: string;
    predictedAt: string;
    actualResult: string | null;
    actualResultText: string | null;
    isCorrect: boolean | null;
    matchStatus: string;
    homeAmount: number;
    awayAmount: number;
    description: string;
    yourPrevResult: string;
    yourPrevBet: number;
}

/* 
    private Long id;
    private Long matchId;
    private String teamA;
    private String teamB;
    private LocalDateTime matchDate;
    private String predictedResult;
    private String predictedResultText;
    private LocalDateTime predictedAt;
    private String actualResult;
    private String actualResultText;
    private Boolean isCorrect;
    private String matchStatus;
*/