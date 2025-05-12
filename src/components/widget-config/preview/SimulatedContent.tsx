
export function SimulatedContent() {
  return (
    <div className="flex flex-col h-full">
      {/* Simulated website header */}
      <div className="w-full bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-3">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
      </div>

      {/* Simulated content blocks */}
      <div className="flex-1 p-4 relative">
        <div className="max-w-md mx-auto space-y-4 pt-8">
          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
