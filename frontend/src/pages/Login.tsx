import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const deployed = "https://task-management-5eed.onrender.com/api";
const API_URL = deployed || "http://localhost:5000/api";
interface LoginProps {
  onLogin: (user: any, token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      onLogin(data.user, data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyan-300 p-4 md:p-8 font-mono flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <Link
          to="/"
          className="inline-block mb-8 bg-black text-white border-4 border-black px-6 py-3 font-black hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          ← BACK
        </Link>

        <div className="bg-pink-400 border-8 border-black p-8 mb-6 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
          <h1 className="text-5xl font-black text-black">LOGIN</h1>
        </div>

        {error && (
          <div className="bg-red-400 border-4 border-black p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
            <p className="font-bold text-black text-lg">❌ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-6">
              <div>
                <label className="block font-black text-xl mb-3 text-black">
                  EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-4 border-4 border-black text-black font-bold text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block font-black text-xl mb-3 text-black">
                  PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full p-4 border-4 border-black text-black font-bold text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-400 border-4 border-black p-4 font-black text-2xl text-black hover:bg-green-300 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "LOGGING IN..." : "LOGIN →"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 bg-yellow-300 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-bold text-black text-center mb-4">
            Don't have an account yet?
          </p>
          <Link
            to="/register"
            className="block w-full text-center bg-white border-4 border-black p-4 font-black text-xl text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
}
