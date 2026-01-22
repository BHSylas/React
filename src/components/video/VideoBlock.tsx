import { type VideoResponseDto } from "../../types/VideoResponseDto";

interface VideoBlockProps {
  video: VideoResponseDto;
  onClick: () => void;
}

export default function VideoBlock({ video, onClick }: VideoBlockProps) {
  return (
    <div 
      className="flex flex-col w-full p-3 transition-shadow rounded-lg shadow-sm cursor-pointer bg-base-100 hover:shadow-md group"
      onClick={onClick}
    >
      {/* 썸네일 */}
      <div className="relative overflow-hidden rounded-md aspect-video bg-base-300">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
      </div>
      
      <div className="mt-3">
        <h3 className="font-semibold line-clamp-2 text-base-content">
          {video.title}
        </h3>
        <p className="mt-1 text-sm text-base-content/50">
        YouTube • Paralympic Studio</p>
      </div>
    </div>
  );
}