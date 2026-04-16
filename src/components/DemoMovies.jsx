// ============================================================
//  DemoMovies – Curated showcase of 3 featured films
//  with YouTube trailer modals and Framer Motion animations
// ============================================================
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaStar } from 'react-icons/fa';

// ── Hardcoded movie data ─────────────────────────────────────
const DEMO_MOVIES = [
  {
    id: 1,
    title: 'Shiddat',
    year: 2021,
    rating: 7.1,
    genre: 'Romance • Drama',
    description:
      'A passionate love story that transcends borders and time. Sahil swims across oceans to reunite with the love of his life, proving that true love knows no boundaries.',
    poster: 'https://image.tmdb.org/t/p/w500/dEXxQAspQzZsw9VEiuVWRDJnvvy.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/nGlNQ6uiS63g8MTAbPrhvmCIFO3.jpg',
    embedUrl: 'https://www.youtube.com/embed/iSo9l950QLo?si=19ZuORz8VL8fW7HY',
  },
  {
    id: 2,
    title: 'Dear Comrade',
    year: 2019,
    rating: 7.5,
    genre: 'Romance • Action',
    description:
      'Bobby, a college student union leader with anger issues, falls in love with Lilly, a state-level cricketer. Their journey explores love, loss, and self-discovery.',
    poster: 'https://image.tmdb.org/t/p/w500/wEDh02aLl2fkCXi25V4MOOuEuWF.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/sSoMpYjqECgC74a3HAwdBVxFs6H.jpg',
    embedUrl: 'https://www.youtube.com/embed/zzhfvt5vZHI?si=S0qtYDzqCqIuk7Yg',
  },
  {
    id: 3,
    title: '3 Idiots',
    year: 2009,
    rating: 8.4,
    genre: 'Comedy • Drama',
    description:
      'Two friends embark on a quest for a lost buddy. On the way, they revisit their college days and recall the friend who inspired them to think differently.',
    poster: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8gT3UKtglLVpu0YfccwbmXZ5Eis.jpg',
    embedUrl: 'https://www.youtube.com/embed/K0eDlFX9GMc?si=6OaH1b3RPx9DAjrA',
  },
];

// ── Animation variants ───────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

// ── Movie Card ───────────────────────────────────────────────
const DemoMovieCard = ({ movie, onPlay }) => {
  const posterUrl = movie.poster || `https://placehold.co/300x450/1a1a2e/e50914?text=${encodeURIComponent(movie.title)}`;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] cursor-pointer"
    >
      {/* Card container */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-xl ring-1 ring-white/5 transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-red-500/10 group-hover:ring-netflix-red/30">

        {/* ── Poster ── */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onLoad={(e) => e.target.classList.add('loaded')}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPlay(movie)}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-netflix-red/90 backdrop-blur-sm flex items-center justify-center text-white shadow-xl shadow-red-600/40 border-2 border-white/20"
            >
              <FaPlay className="text-xl md:text-2xl ml-1" />
            </motion.button>
          </div>

          {/* Rating badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2.5 py-1 rounded-full">
            <FaStar className="text-[10px]" />
            {movie.rating}
          </div>

          {/* Year badge */}
          <div className="absolute top-3 left-3 bg-netflix-red/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {movie.year}
          </div>
        </div>

        {/* ── Info ── */}
        <div className="p-4 md:p-5">
          <h3 className="text-white text-lg md:text-xl font-black mb-1 leading-tight group-hover:text-netflix-red transition-colors duration-300">
            {movie.title}
          </h3>
          <p className="text-gray-500 text-[11px] uppercase tracking-widest font-semibold mb-3">
            {movie.genre}
          </p>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2">
            {movie.description}
          </p>

          {/* Play trailer button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPlay(movie)}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-netflix-red text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border border-white/5 hover:border-transparent hover:shadow-lg hover:shadow-red-600/20"
          >
            <FaPlay className="text-[10px]" />
            Watch Movie
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Section ─────────────────────────────────────────────
const DemoMovies = () => {
  const navigate = useNavigate();

  const handlePlay = (movie) => {
    navigate('/player', { 
      state: { embedUrl: movie.embedUrl, title: movie.title } 
    });
  };

  return (
    <>
      <div className="px-4 md:px-8 lg:px-12 py-12">
        {/* ── Section Header ── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-netflix-red rounded-full" />
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              🎬 Featured Demo Movies
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              Handpicked films to showcase — click to watch trailers
            </p>
          </div>
        </div>

        {/* ── Cards Grid ── */}
        <motion.div
          className="flex flex-wrap gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {DEMO_MOVIES.map((movie) => (
            <DemoMovieCard
              key={movie.id}
              movie={movie}
              onPlay={handlePlay}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default DemoMovies;
