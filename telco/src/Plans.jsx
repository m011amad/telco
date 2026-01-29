import React from "react";

const plans = [
  { name: "60GB", price: 64, months: 24, giftCard: 0 },
  { name: "150GB", price: 79, months: 24, giftCard: 550 },
  {
    name: "300GB",
    price: 99,
    months: 24,
    giftCard: 1100,
    discount: 10, // $10 discount per month
  },
];

const PhonePlans = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8">Compare Phone Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        {plans.map((plan) => {
          const discountedPrice = plan.discount
            ? plan.price - plan.discount
            : plan.price;
          const total = discountedPrice * plan.months;
          const actualTotal = total - plan.giftCard;
          const actualMonthly = (actualTotal / plan.months).toFixed(2);

          return (
            <div
              key={plan.name}
              className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition-transform"
            >
              <h2 className="text-xl font-semibold mb-2">{plan.name} Plan</h2>
              <p className="text-lg mb-2">
                ${plan.price} / month
                {plan.discount && (
                  <span className="ml-2 text-red-600 font-bold">
                    (-${plan.discount} discount!)
                  </span>
                )}
              </p>

              {/* Total cost calculation */}
              <p className="text-gray-600 mb-1">
                Total over {plan.months} months:{" "}
                {plan.discount ? (
                  <span className="text-red-600 font-bold">
                    ${discountedPrice} x {plan.months} = ${total}
                  </span>
                ) : (
                  `${plan.price} x ${plan.months} = $${total}`
                )}
              </p>

              {/* Gift card deduction if any */}
              {plan.giftCard > 0 ? (
                <>
                  <p className="text-gray-600 mb-1">
                    Minus gift card: ${total} - ${plan.giftCard} =
                    <div className="font-bold"> $ {actualTotal}</div>
                  </p>
                  <p className="text-gray-600 mb-1">
                    Actual monthly: {actualTotal} ÷ {plan.months} =
                    <div className="font-bold"> $ {actualMonthly}</div>
                  </p>
                </>
              ) : (
                <p className="text-gray-600 mb-1">
                  Actual monthly: ${actualMonthly} (no gift card)
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhonePlans;
