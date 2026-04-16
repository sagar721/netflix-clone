// ============================================================
//  MovieDemo – HTML5 Video Player with Selection
// ============================================================
import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand } from 'react-icons/fa';

const DEMO_MOVIES = [
  {
    id: 1,
    title: "Cosmic Journey",
    description: "Experience the wonders of the deep universe in 4K.",
    url: "https://vjs.zencdn.net/v/oceans.mp4",
    thumbnail: "https://image.tmdb.org/t/p/w500/v9G7S8S6Z6G6.jpg"
  },
  {
    id: 2,
    title: "Machina Dreams",
    description: "A cyberpunk exploration of artificial intelligence.",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://image.tmdb.org/t/p/w500/iS9UpeBr6j7btfST999uH7pSAtS.jpg"
  },
  {
    id: 3,
    title: "Vanguard",
    description: "High-octane action across futuristic landscapes.",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnail: "https://image.tmdb.org/t/p/w500/r5i76DIs9SAtj3C8kY5D7v9STj7.jpg"
  }
];

const MovieDemo = () => {
  const [activeMovie, setActiveMovie] = useState(DEMO_MOVIES[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setError(false);
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [activeMovie]);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 my-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8 items-center bg-gray-950/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 md:p-10 shadow-3xl">
        
        {/* ── Left: Player ── */}
        <div className="w-full lg:w-3/5 group relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-400 gap-4">
               <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <FaPlay className="text-gray-600" />
               </div>
               <p className="text-sm font-medium">Demo video preview unavailable</p>
               <button 
                  onClick={() => setError(false)}
                  className="text-netflix-red text-xs font-bold hover:underline"
               >
                  Retry Loading
               </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={activeMovie.url}
              autoPlay
              muted={isMuted}
              className="w-full aspect-video object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={togglePlay}
              onError={() => setError(true)}
            />
          )}
          
          {/* Custom Overlay Controls */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl">
              {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
            </button>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-3">
             <button 
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-netflix-red transition-all"
             >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
             </button>
             <button 
                onClick={handleFullscreen}
                className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-netflix-red transition-all"
             >
                <FaExpand />
             </button>
          </div>
        </div>

        {/* ── Right: Info & Selection ── */}
        <div className="w-full lg:w-2/5 text-white">
          <span className="text-netflix-red text-xs font-black uppercase tracking-[0.2em] mb-2 block">
            Featured Demo
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
            {activeMovie.title}
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
            {activeMovie.description}
          </p>

          <div className="space-y-4">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Select Demo Video
            </p>
            <div className="flex gap-3">
              {DEMO_MOVIES.map(movie => (
                <button
                  key={movie.id}
                  onClick={() => setActiveMovie(movie)}
                  className={`
                    flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all duration-300
                    ${activeMovie.id === movie.id 
                      ? 'bg-netflix-red text-white shadow-lg shadow-red-600/20' 
                      : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {movie.id === 1 ? 'COSMIC' : movie.id === 2 ? 'MACHINA' : 'VANGUARD'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-5">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-950 overflow-hidden bg-gray-800">
                  <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="avatar" />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 leading-tight">
              <span className="text-gray-300 font-bold">12.4k users</span> are watching<br />this demo right now.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDemo;
