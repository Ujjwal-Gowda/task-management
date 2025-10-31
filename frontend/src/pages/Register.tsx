import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const deployed = "https://task-management-5eed.onrender.com/api";
const API_URL = deployed || "http://localhost:5000/api";

interface RegisterProps {
  onRegister: (user: any, token: string) => void;
}

export default function Register({ onRegister }: RegisterProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Register
      const registerResponse = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || "Registration failed");
      }

      // Auto-login after registration
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(
          "Registration successful but login failed. Please login manually.",
        );
      }

      onRegister(loginData.user, loginData.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-300 p-4 md:p-8 font-mono flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <Link
          to="/"
          className="inline-block mb-8 bg-black text-white border-4 border-black px-6 py-3 font-black hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          ← BACK
        </Link>

        <div className="bg-yellow-400 border-8 border-black p-8 mb-6 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          <h1 className="text-5xl font-black text-black">REGISTER</h1>
        </div>

        {error && (
          <div className="bg-red-400 border-4 border-black p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
            <p className="font-bold text-black text-lg">❌ {error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-400 border-4 border-black p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold text-black text-lg">✅ {success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-6">
              <div>
                <label className="block font-black text-xl mb-3 text-black">
                  NAME
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-4 border-4 border-black text-black font-bold text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  placeholder="John Doe"
                />
              </div>

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
                  minLength={6}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full p-4 border-4 border-black text-black font-bold text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  placeholder="••••••••"
                />
                <p className="text-sm font-bold text-gray-700 mt-2">
                  Must be at least 6 characters
                </p>
              </div>

              <div className="bg-orange-200 border-4 border-black p-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAdmin}
                    onChange={(e) =>
                      setFormData({ ...formData, isAdmin: e.target.checked })
                    }
                    className="w-6 h-6 border-4 border-black mr-4 mt-1 flex-shrink-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-black text-lg text-black block">
                      ADMIN ACCESS ⭐
                    </span>
                    <span className="text-sm font-bold text-gray-700">
                      Get superpowers to manage all tasks
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-400 border-4 border-black p-4 font-black text-2xl text-black hover:bg-green-300 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT →"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 bg-cyan-300 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-bold text-black text-center mb-4">
            Already have an account?
          </p>
          <Link
            to="/login"
            className="block w-full text-center bg-white border-4 border-black p-4 font-black text-xl text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
}
