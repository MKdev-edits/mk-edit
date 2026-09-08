export default function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-black pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse mb-2"></div>
                    <div className="h-4 w-64 bg-gray-800 rounded-lg animate-pulse"></div>
                </div>

                {/* Tabs Skeleton */}
                <div className="flex gap-2 mb-8 border-b border-gray-800 pb-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 w-24 bg-gray-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-900 rounded-xl p-4">
                            <div className="w-full h-40 bg-gray-800 rounded-lg animate-pulse mb-3"></div>
                            <div className="h-5 w-3/4 bg-gray-800 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-full bg-gray-800 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}