export default function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 shimmer rounded-lg w-40 sm:w-48 mb-1 sm:mb-2"></div>
          <div className="h-4 sm:h-5 bg-gray-200 shimmer rounded-lg w-48 sm:w-64"></div>
        </div>

        {/* Action Bar Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="h-10 bg-gray-200 shimmer rounded-lg w-32"></div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-200 shimmer rounded-lg"></div>
            <div className="h-10 w-20 bg-gray-200 shimmer rounded-lg"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-4 bg-gray-200 shimmer rounded w-16"></div>
              <div className="h-4 bg-gray-200 shimmer rounded w-20"></div>
              <div className="h-4 bg-gray-200 shimmer rounded w-12"></div>
              <div className="h-4 bg-gray-200 shimmer rounded w-14"></div>
            </div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="px-4 sm:px-6 py-4">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="h-4 bg-gray-200 shimmer rounded w-full"></div>
                  <div className="h-4 bg-gray-200 shimmer rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 shimmer rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 shimmer rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between mt-6">
          <div className="h-4 bg-gray-200 shimmer rounded w-32"></div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 shimmer rounded"></div>
            <div className="h-8 w-8 bg-gray-200 shimmer rounded"></div>
            <div className="h-8 w-8 bg-gray-200 shimmer rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}