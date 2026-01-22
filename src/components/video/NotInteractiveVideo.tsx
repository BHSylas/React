import { type VideoResponseDto } from "../../types/VideoResponseDto";
import { textLimiter } from "../../utils/textLimiter";

interface VideoBlockProps {
  video: VideoResponseDto;
  
}

export default function NotInteractiveVideo({ video }: VideoBlockProps) {
  return (
    <div 
      className="flex flex-col p-3 transition-shadow rounded-lg shadow-sm cursor-pointer bg-base-100 hover:shadow-md"
    >
      {/* 썸네일 */}
      <div className="relative overflow-hidden rounded-md aspect-video bg-base-300">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="object-cover w-full h-full transition-transform"
        />
      </div>
      <div className="mt-3">
        <h3 className="font-semibold line-clamp-2 text-base-content">
          {textLimiter(video.title, 35)}
        </h3>
      </div>
    </div>
  );
}