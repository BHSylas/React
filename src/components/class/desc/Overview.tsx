interface OverviewProps {
  description: string;
  objectives?: string[];
  instructorBio?: string;
}

export default function Overview({
  description,
  objectives,
  instructorBio,
}: OverviewProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Description */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">강의 소개</h2>
        <p className="text-lg text-gray-700 leading-relaxed p-2">
          {description}
        </p>
      </div>

      {/* Objectives */}
      {objectives && <div>
        <h2 className="text-lg font-semibold mb-3">학습 목표</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {objectives.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>}

      {/* Instructor */}
      {instructorBio && <div>
        <h2 className="text-lg font-semibold mb-3">강사 소개</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          {instructorBio}
        </p>
      </div>}
    </section>
  );
}
