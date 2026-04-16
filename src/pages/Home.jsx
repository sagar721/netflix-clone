// ============================================================
//  Home Page – the main Netflix-style landing page
// ============================================================
import Navbar            from '../components/Navbar';
import HeroBanner        from '../components/HeroBanner';
import DemoMovies        from '../components/DemoMovies';
import MovieRow          from '../components/MovieRow';
import RecommendedSection from '../components/RecommendedSection';
import useMovies         from '../hooks/useMovies';
import {
  getTrending,
  getTopRated,
  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
  getRomanceMovies,
  getSciFiMovies,
} from '../services/tmdb';

const Home = () => {
  // ── Fetch all movie categories in parallel ──────────────────
  const trending = useMovies(getTrending);
  const topRated = useMovies(getTopRated);
  const action   = useMovies(getActionMovies);
  const comedy   = useMovies(getComedyMovies);
  const horror   = useMovies(getHorrorMovies);
  const romance  = useMovies(getRomanceMovies);
  const scifi    = useMovies(getSciFiMovies);

  // Seed movie for recommendations (first trending film)
  const seedId = trending.data?.[0]?.id;

  return (
    <div className="min-h-screen bg-netflix-dark">
      <Navbar />

      {/* ── Hero Banner ── */}
      <HeroBanner movies={trending.data} loading={trending.loading} />

      {/* ── Movie Rows (overlap the banner with -mt) ── */}
      <div className="relative z-10 -mt-24 pb-20">
        <MovieRow
          title="🔥 Trending Now"
          movies={trending.data}
          loading={trending.loading}
          error={trending.error}
        />

        {/* ── Featured Demo Movies (Shiddat, Dear Comrade, 3 Idiots) ── */}
        <DemoMovies />
        <MovieRow
          title="⭐ Top Rated All Time"
          movies={topRated.data}
          loading={topRated.loading}
          error={topRated.error}
        />
        <MovieRow
          title="💥 Action & Adventure"
          movies={action.data}
          loading={action.loading}
          error={action.error}
        />
        <MovieRow
          title="😂 Comedy"
          movies={comedy.data}
          loading={comedy.loading}
          error={comedy.error}
        />
        <MovieRow
          title="👻 Horror"
          movies={horror.data}
          loading={horror.loading}
          error={horror.error}
        />
        <MovieRow
          title="❤️ Romance"
          movies={romance.data}
          loading={romance.loading}
          error={romance.error}
        />
        <MovieRow
          title="🚀 Sci-Fi"
          movies={scifi.data}
          loading={scifi.loading}
          error={scifi.error}
        />

        {/* Recommendation row – mounts only once seedId is available */}
        {seedId && <RecommendedSection movieId={seedId} />}
      </div>
    </div>
  );
};

export default Home;
