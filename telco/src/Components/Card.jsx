import { useState, useEffect, useRef } from "react";

const plansData = [
  {
    name: "60GB",
    price: 64,
    months: 24,
    giftCard: 0,
    discount: 0,
    hasSMB: false,
    smbGiftCard: 0,
    limitOne: false,
    extras: [],
  },
  {
    name: "150GB",
    price: 79,
    months: 24,
    giftCard: 550,
    discount: 0,
    hasSMB: true,
    smbGiftCard: 700,
    limitOne: false,
    extras: [],
  },
  {
    name: "300GB",
    price: 99,
    months: 24,
    giftCard: 1100,
    discount: 0,
    hasSMB: false,
    smbGiftCard: null,
    limitOne: false,
    extras: [
      "$0 Pixel 10 Pro XL 256GB (P)",
      "$1,599 off Pixel Pro XL 512GB (P)",
      "$0 iPhone 16 128GB (P)",
    ],
  },
  {
    name: "MBB69",
    price: 69,
    months: 24,
    giftCard: 800,
    discount: 0,
    hasSMB: false,
    smbGiftCard: 0,
    limitOne: true,
    extras: [],
  },
];

function calcPlan(plan, isSMB) {
  const disc = plan.discount || 0;
  const effectivePrice = plan.price - disc;
  const giftCard = isSMB ? plan.smbGiftCard || plan.giftCard : plan.giftCard;
  const total = effectivePrice * plan.months;
  const actualTotal = total - giftCard;
  const actualMonthly = (actualTotal / plan.months).toFixed(2);
  return { disc, effectivePrice, giftCard, total, actualTotal, actualMonthly };
}

function getMathLines(plan, isSMB) {
  const { disc, effectivePrice, giftCard, total, actualTotal, actualMonthly } =
    calcPlan(plan, isSMB);
  const lines = [];
  if (disc > 0) {
    lines.push({
      text: `$${plan.price}/mo  −  $${disc} discount  =  $${effectivePrice}/mo`,
      type: "discount",
    });
  }
  lines.push({
    text: `$${effectivePrice}/mo  ×  ${plan.months} months  =  $${total}`,
    type: "normal",
  });
  if (giftCard > 0) {
    lines.push({
      text: `$${total}  −  $${giftCard} gift card  =  $${actualTotal}`,
      type: "gift",
    });
  }
  lines.push({ type: "divider" });
  lines.push({
    text: `$${actualTotal}  ÷  ${plan.months} months  =  $${actualMonthly}/mo effective`,
    type: "result",
  });
  return lines;
}

function useTypewriter(lines, trigger) {
  const [displayed, setDisplayed] = useState([]);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (!trigger) {
      setDisplayed([]);
      return;
    }

    const result = lines.map((l) => ({
      ...l,
      text: l.type === "divider" ? "" : "",
      done: false,
    }));
    setDisplayed(
      result.map((l) => ({
        ...l,
        text: l.type === "divider" ? "divider" : "",
      })),
    );

    let delay = 0;
    lines.forEach((line, li) => {
      if (line.type === "divider") {
        delay += 80;
        return;
      }
      const speed = 18;
      for (let ci = 0; ci <= line.text.length; ci++) {
        const charDelay = delay + ci * speed;
        const charIndex = ci;
        const lineIndex = li;
        const t = setTimeout(() => {
          setDisplayed((prev) => {
            const next = [...prev];
            next[lineIndex] = {
              ...next[lineIndex],
              text: line.text.slice(0, charIndex),
            };
            return next;
          });
        }, charDelay);
        timers.current.push(t);
      }
      delay += line.text.length * speed + 120;
    });

    return () => timers.current.forEach(clearTimeout);
  }, [trigger, JSON.stringify(lines)]);

  return displayed;
}

function MathBlock({ plan, isSMB, open }) {
  const lines = getMathLines(plan, isSMB);
  const displayed = useTypewriter(lines, open);

  return (
    <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm flex flex-col gap-1">
      {displayed.map((line, i) =>
        line.type === "divider" ? (
          <div key={i} className="border-t border-gray-200 my-1" />
        ) : (
          <div
            key={i}
            className={`min-h-[18px] ${line.type === "result" ? "font-medium text-gray-900 text-[14px]" : "text-gray-500"}`}
          >
            {line.text}
            {line.text.length < lines[i]?.text?.length && (
              <span className="inline-block w-px h-3 bg-gray-400 ml-px align-middle animate-pulse" />
            )}
          </div>
        ),
      )}
    </div>
  );
}

function PlanCard({ plan, index }) {
  const [open, setOpen] = useState(false);
  const [isSMB, setIsSMB] = useState(false);
  const { giftCard, actualMonthly } = calcPlan(plan, isSMB);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div>
          <p className="text-sm font-medium text-gray-900">{plan.name} plan</p>
          <p className="text-xs text-gray-400 mt-0.5">
            ${plan.price}/mo × {plan.months} months
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-medium text-gray-900">
            ${actualMonthly}/mo
          </span>
          {plan.discount > 0 && (
            <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
              −${plan.discount}/mo
            </span>
          )}
          {giftCard > 0 && (
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
              ${giftCard} gift
            </span>
          )}
          {plan.hasSMB && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              SMB
            </span>
          )}
          {plan.limitOne && (
            <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
              Limit 1
            </span>
          )}
          <svg
            className={`w-4 h-4 stroke-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Body */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3">
            {/* SMB Toggle */}
            {plan.hasSMB && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-500">Consumer</span>
                <button
                  onClick={() => setIsSMB(!isSMB)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${isSMB ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${isSMB ? "translate-x-4" : ""}`}
                  />
                </button>
                <span
                  className={`text-xs font-medium ${isSMB ? "text-green-700" : "text-gray-500"}`}
                >
                  SMB
                </span>
              </div>
            )}

            {/* Details rows */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Monthly price</span>
              <span className="font-medium">
                ${plan.price}
                {plan.discount > 0 && (
                  <span className="text-red-500 text-xs ml-1">
                    −${plan.discount} off
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Contract</span>
              <span className="font-medium">{plan.months} months</span>
            </div>
            {giftCard > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Gift card</span>
                <span className="font-medium text-emerald-600">
                  ${giftCard}
                </span>
              </div>
            )}

            <div className="border-t border-gray-100" />

            {/* Typewriter math */}
            <p className="text-xs text-gray-400 font-medium">
              How the math works
            </p>
            <MathBlock plan={plan} isSMB={isSMB} open={open} />

            {/* Extras */}
            {plan.extras.length > 0 && (
              <>
                <div className="border-t border-gray-100" />
                <div className="text-xs text-gray-500 leading-relaxed">
                  {plan.extras.map((e) => (
                    <p key={e} className="m-0">
                      {e}
                    </p>
                  ))}
                </div>
              </>
            )}

            {/* Limit 1 warning */}
            {plan.limitOne && (
              <>
                <div className="border-t border-gray-100" />
                <p className="text-sm font-medium text-red-500 m-0">
                  Limit <u>1</u> per customer
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PhonePlans() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md flex flex-col gap-3">
        {plansData.map((plan, i) => (
          <PlanCard key={plan.name} plan={plan} index={i} />
        ))}
      </div>
    </div>
  );
}
