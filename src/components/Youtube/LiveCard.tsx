import type { LiveDto } from "../../types/LiveDto";
import YtPlayer from "./YtPlayer";

export default function YtCard({video, auto = true, interactive = true} : {video: LiveDto, auto?: boolean, interactive?: boolean}) {
    const openYouTube = (videoId : string) => {
      if(videoId === null || videoId === undefined) return ("https://www.youtube.com");
      return (`https://www.youtube.com/watch?v=${videoId}`);
    };
    if(!interactive){
      return (
        <div className="card-body p-4">
          <div className="flex">
            <YtPlayer videoId={video.videoId} auto={auto} />
          </div>
          <div className="divider my-2" />
          <h3 className="text-2xl text-center font-bold">{video.title}</h3>
          <p className="text-center">{video.channelName}</p>
        </div>
      )}
    return (
              <a className="card hover:scale-105 transition-all bg-base-100 shadow cursor-pointer m-4" href={openYouTube(video.videoId)} target="_blank" rel="noopener noreferrer">
                <div className="card-body p-4">
                  <div className="flex">
                    <YtPlayer videoId={video.videoId} auto={auto} />
                  </div>
                  <div className="divider my-2" />
                  <h3 className="text-2xl text-center font-bold">{video.title}</h3>
                  <p className="text-center">{video.channelName}</p>
                </div>
              </a>
            )
}