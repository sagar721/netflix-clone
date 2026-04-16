import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Player = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { embedUrl, title } = location.state || {};

  if (!embedUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white relative z-[500]">
        <div className="text-center">
          <h2 className="text-2xl mb-4 font-bold">Video not found</h2>
          <button 
            onClick={() => navigate('/')} 
            className="bg-netflix-red px-6 py-2 rounded font-bold hover:bg-red-700 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Ensure autoplay is appended if not present
  const videoSrc = embedUrl.includes('?') ? `${embedUrl}&autoplay=1` : `${embedUrl}?autoplay=1`;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black text-white overflow-hidden z-[500]">
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-[510]">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer group"
        >
          <div className="w-10 h-10 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-full group-hover:bg-white/10 transition-colors">
            <FaArrowLeft className="text-xl" />
          </div>
          <span className="text-lg font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">Back</span>
        </button>
      </div>
      <iframe 
        width="100%" 
        height="100%" 
        src={videoSrc} 
        title={title || "Movie Player"} 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerPolicy="strict-origin-when-cross-origin" 
        allowFullScreen
        className="w-full h-full object-cover"
      ></iframe>
    </div>
  );
};

export default Player;
