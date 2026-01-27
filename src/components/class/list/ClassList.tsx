import { useNavigate } from "react-router-dom";
import { type ClassItem } from "../../../types/ClassItem";


interface ClassListProps {
  classList: ClassItem[];
  dimmed?: boolean;
}

export default function ClassList({ classList, dimmed }: ClassListProps) {
  return (
    <div
      className={`space-y-4 transition-opacity ${
        dimmed ? "opacity-40 pointer-events-none" : "opacity-100"
      }`}
    >
      {classList.map((item) => (
        <ClassListItem key={item.id} item={item} />
      ))}
    </div>
  );
}

function ClassListItem({ item }: { item: ClassItem }) {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 p-3 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {navigate(`/class/${item.id}`)}}>
      <div className="w-40 h-24 bg-gray-300 rounded" />
      <div>
        <h3 className="font-bold">{item.title}</h3>
        <p className="text-sm text-gray-600">
          {item.professor} · {item.level}
        </p>
        <p className="text-sm mt-2 text-gray-700">
          {item.description}
        </p>
      </div>
    </div>
  );
}
