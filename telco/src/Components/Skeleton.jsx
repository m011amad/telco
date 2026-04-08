export default function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="flex gap-2">
          <div className="h-4 bg-gray-200 rounded-full w-32" />
          <div className="h-4 bg-gray-200 rounded w-4" />
        </div>
      </div>
    </div>
  );
}
