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

const COUNTRY_NAMES: Record<string, string> = {
  USA: "미국",
  JAPAN: "일본",
  CHINA: "중국",
  GERMANY: "독일",
  ITALY: "이탈리아",
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
		<div className="relative w-20 h-20">
			<svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
				<circle cx="32" cy="32" r={radius} className="stroke-gray-100" strokeWidth="6" fill="none" />
				<circle
					cx="32"
					cy="32"
					r={radius}
					className="stroke-blue-600"
					strokeWidth="6"
					strokeLinecap="round"
					fill="none"
					strokeDasharray={`${progress} ${circumference - progress}`}
					style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
				/>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center text-[14px] font-black text-gray-900">
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
		<div className="flex-1">
			{/* 헤더 섹션 */}
			<div className="flex items-center justify-between pb-6 border-b-2 border-gray-900 mb-8">
				<h2 className="text-[24px] font-black text-gray-900 tracking-tight">Quiz 학습 통계</h2>
				<span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
					Learning Analytics
				</span>
			</div>

			{/* 상단 요약 카드 영역 */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				<div className="bg-white border-2 border-gray-500 rounded-[2rem] p-8 shadow-sm">
					<p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Total Solved</p>
					<p className="text-4xl font-black text-gray-900">{totalSolved}<span className="text-lg ml-1 font-bold">문제</span></p>
				</div>
				<div className="bg-white border-2 border-gray-500 rounded-[2rem] p-8 shadow-sm">
					<p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Average Accuracy</p>
					<p className="text-4xl font-black text-gray-900">{avgAccuracy}<span className="text-lg ml-1 font-bold">%</span></p>
				</div>
			</div>

			{/* 국가별 통계 상세 */}
			<div className="space-y-8">
				{visibleStats.map((countryStat) => (
					<div key={countryStat.country} className="bg-white border-t border-gray-900 mt-3 p-8">
						<h3 className="text-[20px] font-black text-gray-900 mb-6 flex items-center gap-2">
							<span className="w-2 h-6 bg-blue-600 rounded-full"></span>
							{COUNTRY_NAMES[countryStat.country]}
						</h3>

						<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 ">
							{countryStat.levels.map((levelStat) => {
								const solvedAccuracy = Math.round((levelStat.correctProblems / levelStat.solvedProblems) * 100);
								return (
									<div key={`${countryStat.country}-${levelStat.level}`}
										className="bg-gray-50/50 rounded-3xl p-6 flex flex-col items-center text-center gap-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 border border-gray-400">

										<div className="relative">
											<CircleProgress correct={levelStat.correctProblems} total={levelStat.totalProblems} />
										</div>

										<div className="w-full">
											<p className="text-[16px] font-black text-gray-900 mb-3">{toKoreanLevel(levelStat.level)}</p>

											<div className="space-y-1.5 text-[15px] font-bold">
												<div className="flex justify-between">
													<span>전체 정답률</span>
													<span className="text-gray-900">{levelStat.officialAccuracy}%</span>
												</div>
												<div className="flex justify-between">
													<span>푼 문제 정답률</span>
													<span className="text-blue-600">{solvedAccuracy}%</span>
												</div>
												<div className="pt-2 border-t border-gray-500 mt-2">
													<p className="text-[15px] font-medium leading-relaxed">
														정답 {levelStat.correctProblems} / 전체 {levelStat.totalProblems}<br />
														풀어본 문제 {levelStat.solvedProblems}개
													</p>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
