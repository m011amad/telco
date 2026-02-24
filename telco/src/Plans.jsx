import React, { useState } from "react";

const PhonePlans = () => {
  const [isSMB, setIsSMB] = useState(false); // Toggle for 150GB plan

  const plans = [
    { name: "60GB", price: 64, months: 24, giftCard: 0 },
    {
      name: "150GB",
      price: 79,
      months: 24,
      giftCard: 600,
      discount: 10, // $10 discount per month
    },
    {
      name: "300GB",
      price: 99,
      months: 24,
      giftCard: isSMB ? 1000 : 800, // SMB (business) logic
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8">Compare SIM Plans</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        {plans.map((plan) => {
          const discountedPrice = plan.discount
            ? plan.price - plan.discount
            : plan.price;

          const total = discountedPrice * plan.months;
          const actualTotal = total - plan.giftCard;
          const actualMonthly = (actualTotal / plan.months).toFixed(2);

          const is150GB = plan.name === "150GB";
          const is300GB = plan.name === "300GB";

          return (
            <div
              key={plan.name}
              className={`
                shadow-lg rounded-xl p-6 text-center transition-transform hover:scale-105
                ${
                  is150GB | is300GB && isSMB
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                }
              `}
            >
              <h2 className="text-xl font-semibold mb-2">{plan.name} Plan</h2>

              {/* SMB Toggle only for 150GB */}
              {is150GB | is300GB && (
                <div className="flex justify-center items-center mb-4">
                  <span className="mr-2 text-sm">Consumer</span>
                  <button
                    onClick={() => setIsSMB(!isSMB)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors
                      ${isSMB ? "bg-green-500" : "bg-gray-400"}
                    `}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform
                        ${isSMB ? "translate-x-6" : ""}
                      `}
                    />
                  </button>
                  <span className="ml-2 text-sm font-bold">SMB</span>
                </div>
              )}

              <p className="text-lg mb-2">
                ${plan.price} / month
                {plan.discount && (
                  <span className="ml-2 text-red-600 font-bold">
                    (-${plan.discount} discount!)
                  </span>
                )}
              </p>

              {/* Total calculation */}
              <div className="mb-2">
                <p className="text-sm opacity-80">
                  Total over {plan.months} months:
                </p>
                {plan.discount ? (
                  <p className="font-bold text-red-500">
                    {discountedPrice} × {plan.months} = ${total}
                  </p>
                ) : (
                  <p className="font-bold">
                    {plan.price} × {plan.months} = ${total}
                  </p>
                )}
              </div>

              {/* Gift card */}
              {plan.giftCard > 0 && (
                <div className="mb-2">
                  <p className="text-sm opacity-80">Minus Gift Card:</p>
                  <p className="font-bold">
                    ${total} − ${plan.giftCard} = ${actualTotal}
                  </p>
                </div>
              )}

              {/* Actual monthly */}
              <div className="mt-2 pt-2 border-t">
                <p className="text-sm opacity-80">Actual Monthly Value:</p>
                <p className="text-xl font-bold">${actualMonthly} / month</p>
              </div>

              {/* SMB badge */}
              {isSMB && (
                <div className="mt-4">
                  {is150GB && (
                    <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      SMB Offer Active (${plans[1].giftCard} Gift Card)
                    </span>
                  )}
                  {is300GB && (
                    <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      SMB Offer Active (${plans[2].giftCard} Gift Card)
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhonePlans;
