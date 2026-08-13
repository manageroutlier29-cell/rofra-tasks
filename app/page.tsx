import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between p-6">
      <div className="max-w-md mx-auto my-auto text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-blue-500 tracking-tight">
          Rofra Tasks
        </h1>
        <p className="text-gray-300 text-base leading-relaxed">
          Complete simple online tasks, unlock high-paying premium gigs, and withdraw your earnings instantly via M-Pesa, Bank, or Crypto.
        </p>

        <div className="space-y-3 pt-4">
          <Link
            href="/register"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg"
          >
            Create Account
          </Link>
          <Link
            href="/dashboard"
            className="block w-full bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold py-3 px-6 rounded-xl border border-gray-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>

      <footer className="text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} Rofra Tasks. All rights reserved.
      </footer>
    </div>
  );
}
