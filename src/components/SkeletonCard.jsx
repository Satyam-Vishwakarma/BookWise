import PropTypes from 'prop-types';

const SkeletonCard = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="card overflow-hidden animate-pulse">
          <div className="flex p-4">
            {/* Book Cover Skeleton */}
            <div className="flex-shrink-0 w-24 h-36 bg-gray-200 rounded shimmer" />
            
            {/* Book Details Skeleton */}
            <div className="flex-1 ml-4">
              {/* Title */}
              <div className="h-5 bg-gray-200 rounded shimmer w-3/4 mb-2" />
              
              {/* Author */}
              <div className="h-4 bg-gray-200 rounded shimmer w-1/2 mb-3" />
              
              {/* Rating */}
              <div className="flex items-center mt-2">
                <div className="h-4 w-24 bg-gray-200 rounded shimmer" />
              </div>
              
              {/* Platform Offers */}
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded shimmer w-2/3" />
                <div className="h-4 bg-gray-200 rounded shimmer w-1/2" />
              </div>
              
              {/* View Details Link */}
              <div className="mt-4 h-4 bg-gray-200 rounded shimmer w-28" />
            </div>
            
            {/* Price and Buy Button Skeleton */}
            <div className="flex flex-col items-end justify-between ml-4">
              <div className="text-right">
                <div className="h-6 bg-gray-200 rounded shimmer w-16 mb-1" />
                <div className="h-3 bg-gray-200 rounded shimmer w-24" />
              </div>
              
              <div className="h-9 bg-gray-200 rounded shimmer w-20 mt-4" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

SkeletonCard.propTypes = {
  count: PropTypes.number,
};

export default SkeletonCard;