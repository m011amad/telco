import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

async function fetchPlans() {
  const { data, error } = await supabase.from("plans").select("*").order("id");

  console.log("data:", data);
  console.log("error:", error);

  if (error) throw error;

  return data.map((p) => ({
    name: p.name,
    price: p.price,
    months: p.months,
    giftCard: p.gift_card,
    smbGiftCard: p.smb_gift_card,
    hasSMB: p.has_smb,
    discount: p.discount,
    limitOne: p.limit_one,
    extras: Array.isArray(p.extras)
      ? p.extras
      : typeof p.extras === "string"
        ? p.extras
            .replace(/^{|}$/g, "")
            .split('","')
            .map((s) => s.replace(/^"|"$/g, "").replace(/\\"/g, '"'))
        : [],
  }));
}

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });
}
