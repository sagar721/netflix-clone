// ============================================================
//  SkeletonLoader – animated placeholder UI while data loads
// ============================================================

/** Single movie card skeleton */
export const SkeletonCard = () => (
  <div className="flex-shrink-0 w-36 md:w-44">
    <div className="h-52 md:h-64 rounded-md shimmer-bg" />
    <div className="mt-2 h-3 rounded shimmer-bg w-3/4" />
    <div className="mt-1 h-3 rounded shimmer-bg w-1/2" />
  </div>
);

/** Full horizontal row skeleton */
export const SkeletonRow = ({ count = 7 }) => (
  <div className="px-4 md:px-8 my-6">
    {/* Row title skeleton */}
    <div className="h-5 w-48 rounded shimmer-bg mb-4" />
    {/* Cards */}
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

/** Full-width hero banner skeleton */
export const SkeletonBanner = () => (
  <div className="relative h-[85vh] w-full shimmer-bg">
    <div className="absolute bottom-24 left-8 md:left-12 space-y-4 max-w-xl">
      <div className="h-12 rounded shimmer-bg w-3/4" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <div className="h-4 rounded shimmer-bg" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <div className="h-4 rounded shimmer-bg w-5/6" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <div className="h-4 rounded shimmer-bg w-2/3" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <div className="flex gap-4 mt-6">
        <div className="h-12 w-32 rounded shimmer-bg" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="h-12 w-32 rounded shimmer-bg" style={{ background: 'rgba(255,255,255,0.07)' }} />
      </div>
    </div>
  </div>
);

// Default export is the row skeleton (most commonly used)
export default SkeletonRow;
