import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AdminLogin from "./AdminLogin";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminPlans() {
  const queryClient = useQueryClient();
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [plans, setPlans] = useState([]);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("plans")
      .select("*")
      .order("id")
      .then(({ data }) => setPlans(data ?? []));
  }, [session]);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  function updateField(id, field, value) {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  }
  //adding

  async function addPlan() {
    const { data, error } = await supabase
      .from("plans")
      .insert({
        name: "New Plan",
        price: 0,
        months: 24,
        gift_card: 0,
        smb_gift_card: 0,
        has_smb: false,
        discount: 0,
        limit_count: 0,
        limit_one: false,
        extras: [],
        data: 0,
      })
      .select()
      .single();

    if (error) {
      alert("Error adding plan: " + error.message);
    } else {
      setPlans((prev) => [...prev, data]);
    }
  }

  // deleting

  async function deletePlan(id) {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    const { error } = await supabase.from("plans").delete().eq("id", id);

    if (error) {
      alert("Error deleting plan: " + error.message);
    } else {
      setPlans((prev) => prev.filter((p) => p.id !== id));
    }
  }

  async function savePlan(plan) {
    setSaving(plan.id);
    console.log("saving plan:", plan);

    const { data, error } = await supabase
      .from("plans")
      .update({
        name: plan.name,
        price: Number(plan.price),
        months: Number(plan.months),
        gift_card: Number(plan.gift_card),
        smb_gift_card: Number(plan.smb_gift_card),
        has_smb: plan.has_smb,
        discount: Number(plan.discount),
        limit_one: plan.limit_one,
        limit_count: Number(plan.limit_count),
        extras: plan.extras,
        data: Number(plan.data),
      })
      .eq("id", plan.id);
    console.log("result data:", data);
    console.log("result error:", error);

    if (error) {
      alert("Error saving: " + error.message);
    } else {
      setSaved(plan.id);
      setTimeout(() => setSaved(null), 2000); // clears after 2 seconds
      queryClient.invalidateQueries(["plans"]);
    }
    setSaving(null);
  }

  if (checkingSession)
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <p className="text-stone-400">Loading...</p>
      </div>
    );

  if (!session) return <AdminLogin onLogin={() => {}} />;

  return (
    <div className="min-h-screen bg-stone-200 py-10 px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-stone-700 pl-2 font-semibold">
          Edit Plans
        </h1>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-stone-500 hover:text-stone-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </a>
          <button
            type="button"
            onClick={addPlan}
            className="text-sm text-stone-500 hover:text-stone-900 border border-stone-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            + Add plan
          </button>

          <button
            onClick={handleLogout}
            className="text-sm text-stone-500 hover:text-stone-900 border border-stone-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex flex-col gap-1 text-xs text-stone-500">
                Name
                <input
                  className="border rounded-lg px-3 py-2 text-sm text-stone-900"
                  value={plan.name}
                  onChange={(e) => updateField(plan.id, "name", e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-stone-500">
                Price ($/mo)
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 text-sm text-stone-900"
                  value={plan.price}
                  onChange={(e) =>
                    updateField(plan.id, "price", e.target.value)
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-stone-500">
                Data (GB)
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 text-sm text-stone-900"
                  value={plan.data ?? 0}
                  onChange={(e) => updateField(plan.id, "data", e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-stone-500">
                Months
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 text-sm text-stone-900"
                  value={plan.months}
                  onChange={(e) =>
                    updateField(plan.id, "months", e.target.value)
                  }
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-stone-500">
                Discount ($/mo)
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 text-sm text-stone-900"
                  value={plan.discount}
                  onChange={(e) =>
                    updateField(plan.id, "discount", e.target.value)
                  }
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-stone-500">
                Gift Card ($)
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 text-sm text-stone-900"
                  value={plan.gift_card}
                  onChange={(e) =>
                    updateField(plan.id, "gift_card", e.target.value)
                  }
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-stone-500">
                SMB Gift Card ($)
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 text-sm text-stone-900"
                  value={plan.smb_gift_card ?? ""}
                  onChange={(e) =>
                    updateField(plan.id, "smb_gift_card", e.target.value)
                  }
                />
              </label>

              <label className="flex items-center gap-2 text-xs text-stone-500 pt-4">
                <input
                  type="checkbox"
                  checked={plan.has_smb}
                  onChange={(e) =>
                    updateField(plan.id, "has_smb", e.target.checked)
                  }
                />
                Has SMB toggle
              </label>

              <label className="flex flex-col gap-1 text-xs text-stone-500">
                Limit per customer (0 = no limit)
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 text-sm text-stone-900"
                  value={plan.limit_count ?? 0}
                  onChange={(e) =>
                    updateField(plan.id, "limit_count", e.target.value)
                  }
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-xs text-stone-500">
              Extras (one per line)
              <textarea
                rows={3}
                className="border rounded-lg px-3 py-2 text-sm text-stone-900"
                value={(Array.isArray(plan.extras) ? plan.extras : []).join(
                  "\n",
                )}
                onChange={(e) =>
                  updateField(
                    plan.id,
                    "extras",
                    e.target.value.split("\n").filter(Boolean),
                  )
                }
              />
            </label>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => deletePlan(plan.id)}
                className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-4 py-2 rounded-lg transition-colors"
              >
                Delete plan
              </button>
              <button
                onClick={() => savePlan(plan)}
                className="text-sm text-stone-500 hover:text-stone-900 border border-stone-400 px-3 py-1.5 rounded-lg animate-pulse transition-colors"
              >
                {saving === plan.id
                  ? "Saving..."
                  : saved === plan.id
                    ? "Saved!"
                    : "Save changes"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
