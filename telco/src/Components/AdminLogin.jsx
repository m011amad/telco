import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Invalid email or password");
    } else {
      onLogin();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-stone-700 flex items-center justify-center">
      <div className="bg-stone-200 rounded-xl border border-black-200 p-8 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-black-900">Admin login</h1>

        <label className="flex flex-col gap-1 text-xs text-stone-500">
          Email
          <input
            type="email"
            className="border rounded-lg px-3 py-2 text-sm text-stone-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-stone-500">
          Password
          <input
            type="password"
            className="border rounded-lg px-3 py-2 text-sm text-stone-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </label>

        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-around">
          <button
            type="button"
            onClick={handleLogin}
            className="bg-stone-900 text-white px-4 w-28 text-sm  py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
          <a
            href="/"
            className="bg-stone-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors w-28 text-center"
          >
            Back
          </a>
        </div>
      </div>
    </div>
  );
}
