import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-300 p-4 md:p-8 font-mono flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Main Hero */}
        <div className="bg-white border-8 border-black p-8 md:p-12 mb-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 transition-transform">
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-black leading-tight">
            TASK
            <br />
            MASTER
          </h1>
          <p className="text-xl md:text-2xl font-bold text-black mb-8 border-l-8 border-black pl-4">
            The most BRUTAL task manager ever created! 💪
          </p>
          <p className="text-lg font-bold text-gray-700 mb-8">
            Stop procrastinating! Get stuff DONE with style. Track your tasks,
            crush your goals, and level up your productivity game! 🚀
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="flex-1 text-center bg-cyan-400 border-4 border-black px-8 py-4 font-black text-2xl text-black hover:bg-cyan-300 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              GET STARTED →
            </Link>
            <Link
              to="/login"
              className="flex-1 text-center bg-white border-4 border-black px-8 py-4 font-black text-2xl text-black hover:bg-gray-100 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              LOGIN
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-2xl font-black mb-2 text-black">TRACK TASKS</h3>
            <p className="font-bold text-black">
              Create, organize, and complete tasks like a boss!
            </p>
          </div>

          <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-2xl font-black mb-2 text-black">PRIORITY</h3>
            <p className="font-bold text-black">
              Mark important tasks and crush them first!
            </p>
          </div>

          <div className="bg-pink-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-2xl font-black mb-2 text-black">
              ADMIN POWERS
            </h3>
            <p className="font-bold text-black">
              Manage teams with admin superpowers!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xl font-black text-black bg-white border-4 border-black p-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            MADE WITH 💛 & CAFFEINE
          </p>
        </div>
      </div>
    </div>
  );
}
