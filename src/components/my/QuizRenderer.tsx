type QuizLevel = {
	level: string;
	totalProblems: number;
	correctProblems: number;
	officialAccuracy: number;
	solvedProblems: number;
};

type QuizCountryStat = {
	country: string;
	levels: QuizLevel[];
};

type QuizStatsResponse = {
	userId: number;
	stats: QuizCountryStat[];
};

function isQuizLevel(value: unknown): value is QuizLevel {
	if (typeof value !== "object" || value === null) return false;
	const entry = value as Partial<QuizLevel>;
	return (
		typeof entry.level === "string" &&
		typeof entry.totalProblems === "number" &&
		typeof entry.correctProblems === "number" &&
		typeof entry.officialAccuracy === "number" &&
		typeof entry.solvedProblems === "number"
	);
}

function isQuizCountryStat(value: unknown): value is QuizCountryStat {
	if (typeof value !== "object" || value === null) return false;
	const entry = value as Partial<QuizCountryStat>;
	return (
		typeof entry.country === "string" &&
		Array.isArray(entry.levels) &&
		entry.levels.every(isQuizLevel)
	);
}

function parseQuizStats(value: unknown): QuizStatsResponse | null {
	if (typeof value !== "object" || value === null) return null;
	const payload = value as Partial<QuizStatsResponse>;

	if (typeof payload.userId !== "number") return null;
	if (!Array.isArray(payload.stats)) return null;
	if (!payload.stats.every(isQuizCountryStat)) return null;

	return {
		userId: payload.userId,
		stats: payload.stats,
	};
}

function averageAccuracy(stats: QuizCountryStat[]): number {
	const allLevels = stats.flatMap((country) => country.levels);
	if (allLevels.length === 0) return 0;

	const sum = allLevels.reduce((acc, level) => acc + level.officialAccuracy, 0);
	return Math.round((sum / allLevels.length) * 10) / 10;
}

function toKoreanLevel(level: string): string {
	if (level === "BEGINNER") return "초급";
	if (level === "INTERMEDIATE") return "중급";
	if (level === "ADVANCED") return "고급";
	return level;
}

export default function QuizRenderer({ data }: { data: unknown }) {
	const parsed = parseQuizStats(data);

	if (!parsed || parsed.stats.length === 0) {
		return <div className="p-5 text-gray-300">퀴즈 학습 통계가 없습니다.</div>;
	}

	const totalSolved = parsed.stats
		.flatMap((country) => country.levels)
		.reduce((acc, level) => acc + level.solvedProblems, 0);
	const avgAccuracy = averageAccuracy(parsed.stats);

	return (
		<div className="ml-3 w-full pr-8 pb-10">
			<h2 className="text-lg font-bold mb-3 border-b-2 pb-2">Quiz 학습 통계</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
				<div className="border border-gray-200 rounded-lg p-4">
					<p className="text-sm text-gray-500">총 풀이 문제 수</p>
					<p className="text-2xl font-bold text-blue-800">{totalSolved}</p>
				</div>
				<div className="border border-gray-200 rounded-lg p-4">
					<p className="text-sm text-gray-500">평균 정답률</p>
					<p className="text-2xl font-bold text-blue-800">{avgAccuracy}%</p>
				</div>
			</div>

			<div className="space-y-4">
				{parsed.stats.map((countryStat) => (
					<div key={countryStat.country} className="border border-gray-200 rounded-lg p-4">
						<h3 className="text-lg font-semibold mb-3">{countryStat.country}</h3>
						<div className="space-y-2">
							{countryStat.levels.map((levelStat) => (
								<div key={`${countryStat.country}-${levelStat.level}`} className="grid grid-cols-4 gap-2 text-sm">
									<span className="font-semibold text-gray-800">{toKoreanLevel(levelStat.level)}</span>
									<span className="text-gray-600">
										{levelStat.correctProblems}/{levelStat.totalProblems} 정답
									</span>
									<span className="text-gray-600">풀이 {levelStat.solvedProblems}개</span>
									<span className="text-gray-700 font-medium text-right">{levelStat.officialAccuracy}%</span>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
