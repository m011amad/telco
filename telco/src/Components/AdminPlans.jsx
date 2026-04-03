import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AdminLogin from "./AdminLogin";

export default function AdminPlans() {
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
        extras: plan.extras,
      })
      .eq("id", plan.id);
    console.log("result data:", data);
    console.log("result error:", error);

    if (error) {
      alert("Error saving: " + error.message);
    } else {
      setSaved(plan.id);
      setTimeout(() => setSaved(null), 2000); // clears after 2 seconds
    }
    setSaving(null);
  }

  if (checkingSession)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );

  if (!session) return <AdminLogin onLogin={() => {}} />;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Edit Plans</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          Log out
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex flex-col gap-1 text-xs text-gray-500">
                Name
                <input
                  className="border rounded-lg px-3 py-2 text-sm text-gray-900"
                  value={plan.name}
                  onChange={(e) => updateField(plan.id, "name", e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-gray-500">
                Price ($/mo)
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 text-sm text-gray-900"
                  value={plan.price}
                  onChange={(e) =>
                    updateField(plan.id, "price", e.target.value)
                  }
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-gray-500">
                Months
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 text-sm text-gray-900"
                  value={plan.months}
                  onChange={(e) =>
                    updateField(plan.id, "months", e.target.value)
                  }
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-gray-500">
                Discount ($/mo)
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 text-sm text-gray-900"
                  value={plan.discount}
                  onChange={(e) =>
                    updateField(plan.id, "discount", e.target.value)
                  }
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-gray-500">
                Gift Card ($)
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 text-sm text-gray-900"
                  value={plan.gift_card}
                  onChange={(e) =>
                    updateField(plan.id, "gift_card", e.target.value)
                  }
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-gray-500">
                SMB Gift Card ($)
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 text-sm text-gray-900"
                  value={plan.smb_gift_card ?? ""}
                  onChange={(e) =>
                    updateField(plan.id, "smb_gift_card", e.target.value)
                  }
                />
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-500 pt-4">
                <input
                  type="checkbox"
                  checked={plan.has_smb}
                  onChange={(e) =>
                    updateField(plan.id, "has_smb", e.target.checked)
                  }
                />
                Has SMB toggle
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-500 pt-4">
                <input
                  type="checkbox"
                  checked={plan.limit_one}
                  onChange={(e) =>
                    updateField(plan.id, "limit_one", e.target.checked)
                  }
                />
                Limit 1 per customer
              </label>
            </div>

            <label className="flex flex-col gap-1 text-xs text-gray-500">
              Extras (one per line)
              <textarea
                rows={3}
                className="border rounded-lg px-3 py-2 text-sm text-gray-900"
                value={(Array.isArray(plan.extras) ? plan.extras : []).join(
                  "\n",
                )}
                onChange={(e) =>
                  updateField(plan.id, "extras", e.target.value.split("\n"))
                }
              />
            </label>

            <button
              onClick={() => savePlan(plan)}
              className="self-end bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {saving === plan.id
                ? "Saving..."
                : saved === plan.id
                  ? "Saved!"
                  : "Save changes"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
