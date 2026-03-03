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

function CircleProgress({ correct, total }: { correct: number; total: number }) {
	const safeTotal = total > 0 ? total : 1;
	const rate = Math.max(0, Math.min(100, (correct / safeTotal) * 100));
	const radius = 24;
	const circumference = 2 * Math.PI * radius;
	const progress = (rate / 100) * circumference;

	return (
		<div className="relative w-16 h-16">
			<svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64" aria-label="정답 비율">
				<circle cx="32" cy="32" r={radius} className="stroke-gray-200" strokeWidth="8" fill="none" />
				<circle
					cx="32"
					cy="32"
					r={radius}
					className="stroke-blue-600"
					strokeWidth="8"
					strokeLinecap="round"
					fill="none"
					strokeDasharray={`${progress} ${circumference - progress}`}
				/>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
				{Math.round(rate)}%
			</div>
		</div>
	);
}

export default function QuizRenderer({ data }: { data: unknown }) {
	const parsed = parseQuizStats(data);
	const visibleStats = parsed?.stats
		.map((country) => ({
			...country,
			levels: country.levels.filter((level) => level.totalProblems > 0 && level.solvedProblems > 0),
		}))
		.filter((country) => country.levels.length > 0);

	if (!parsed || !visibleStats || visibleStats.length === 0) {
		return <div className="p-5 text-gray-300">퀴즈 학습 통계가 없습니다.</div>;
	}

	const totalSolved = visibleStats
		.flatMap((country) => country.levels)
		.reduce((acc, level) => acc + level.solvedProblems, 0);
	const avgAccuracy = averageAccuracy(visibleStats);

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
				{visibleStats.map((countryStat) => (
					<div key={countryStat.country} className="border border-gray-200 rounded-lg p-4">
						<h3 className="text-lg font-semibold mb-3">{countryStat.country}</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
							{countryStat.levels.map((levelStat) => (
								<div key={`${countryStat.country}-${levelStat.level}`} className="border border-gray-100 rounded-lg p-3 flex items-center gap-3">
									<CircleProgress correct={levelStat.correctProblems} total={Math.min(levelStat.totalProblems, levelStat.solvedProblems)} />
									<div className="flex-1 text-sm space-y-1">
										<p className="font-semibold text-gray-800">{toKoreanLevel(levelStat.level)}</p>
										<p className="text-gray-600">
											정답 {levelStat.correctProblems} / 전체 {levelStat.totalProblems}
										</p>
										<p className="text-gray-600">풀어본 문제 {levelStat.solvedProblems}개</p>
										<p className="text-gray-700 font-medium">전체 문제 정답률 {levelStat.officialAccuracy}%</p>
                    <p className="text-gray-700 font-medium">푼 문제 정답률 {Math.round((levelStat.correctProblems / levelStat.solvedProblems) * 100)}%</p>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
