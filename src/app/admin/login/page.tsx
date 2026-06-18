export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">⌚</span>
          <h1 className="text-xl font-bold text-stone-900 mt-3">Admin Login</h1>
          <p className="text-sm text-stone-500 mt-1">WatchStore Dashboard</p>
        </div>

        {/* Form */}
        <form className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              placeholder="admin@watchstore.pk"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-all active:scale-[0.98] text-sm"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-stone-400 mt-6">
          Secure admin access only
        </p>
      </div>
    </div>
  );
}