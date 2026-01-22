import { useNavigate } from "react-router-dom";
import type { MatchDto } from "../../types/MatchDto";
import type { PredictDto } from "../../types/PredictDto";
import PredictionCard from "../predictions/PredictionCard";

export default function MyPrediction({predict} : {predict: PredictDto}){
    const navigate = useNavigate();
    const match : MatchDto = {
        id: predict.matchId,
        teamA: predict.teamA,
        teamB: predict.teamB,
        homeAmount: predict.homeAmount,
        awayAmount: predict.awayAmount,
        yourPrevResult: predict.yourPrevResult,
        yourPrevBet: predict.yourPrevBet,
        matchDate: predict.matchDate,
        description: predict.description,
        predictionOpen: true,
        alreadyPredicted: true
    }
    return(
        <a className="cursor-pointer" onClick={ () => navigate("/predictions")}>
            <PredictionCard match={match} interactive={false}/>
        </a>
    )
}