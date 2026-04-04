import PlanCard from "./PlanCard";
import { usePlans } from "../hooks/usePlans";

export default function PhonePlans() {
  const { data: plansData, isLoading, isError } = usePlans();

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Loading plans...</p>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-400">Failed to load plans.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:items-start">
        {plansData.map((plan, i) => (
          <PlanCard key={plan.name} plan={plan} index={i} />
        ))}
      </div>
    </div>
  );
}
