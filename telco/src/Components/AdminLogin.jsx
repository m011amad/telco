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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Admin login</h1>

        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Email
          <input
            type="email"
            className="border rounded-lg px-3 py-2 text-sm text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Password
          <input
            type="password"
            className="border rounded-lg px-3 py-2 text-sm text-gray-900"
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
            className="bg-gray-900 text-white px-4 w-28 text-sm  py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
          <a
            href="/"
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors w-28 text-center"
          >
            Back
          </a>
        </div>
      </div>
    </div>
  );
}
