"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { Sparkles, ArrowRight, UserCheck } from "lucide-react";

export default function MasukPage() {
  const router = useRouter();
  const { users, switchRole, setCurrentUserId } = useData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      setError("Email tidak ditemukan dalam sistem.");
      return;
    }

    if (!user.aktif) {
      setError("Akun Anda dinonaktifkan. Hubungi staf Langkah Juara.");
      return;
    }

    switchRole(user.role);
    setCurrentUserId(user.id);

    // Direct to role specific page as per Peta Route
    if (user.role === "siswa") router.push("/siswa/beranda");
    else if (user.role === "staf") router.push("/staf/dasbor");
    else if (user.role === "tutor") router.push("/tutor/dasbor");
    else if (user.role === "super_admin") router.push("/admin/dasbor");
    else router.push("/siswa/beranda");
  };

  const handleQuickLogin = (role, userEmail) => {
    const user = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
    if (user) {
      switchRole(user.role);
      setCurrentUserId(user.id);
      if (user.role === "siswa") router.push("/siswa/beranda");
      else if (user.role === "staf") router.push("/staf/dasbor");
      else if (user.role === "tutor") router.push("/tutor/dasbor");
      else if (user.role === "super_admin") router.push("/admin/dasbor");
    }
  };

  const handleGoogleLogin = () => {
    switchRole("siswa");
    router.push("/siswa/beranda");
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EA580C] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#EA580C]/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#1F2937]">
            Langkah Juara
          </span>
        </Link>
        <h2 className="text-xl font-bold text-[#1F2937]">Masuk ke Portal Belajar</h2>
        <p className="mt-1 text-sm text-[#5A6B78]">
          Silakan masuk menggunakan akun Langkah Juara Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200/80 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                Email Akun <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white font-semibold text-sm transition-all shadow-sm shadow-[#EA580C]/20 flex items-center justify-center gap-2"
            >
              <span>Masuk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#5A6B78] font-medium">atau</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-[#1F2937] transition-all flex items-center justify-center gap-3 shadow-xs"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Masuk dengan Google</span>
          </button>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider mb-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#EA580C]" />
              Masuk Cepat Sebagai Akun Contoh:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin("siswa", "raka@example.com")}
                className="p-2 text-left rounded-lg bg-gray-50 hover:bg-orange-50 hover:border-orange-200 border border-gray-200/60 transition-colors"
              >
                <div className="font-semibold text-[#1F2937]">Raka (Siswa)</div>
                <div className="text-[11px] text-[#5A6B78]">raka@example.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("staf", "fira@langkahjuara.id")}
                className="p-2 text-left rounded-lg bg-gray-50 hover:bg-orange-50 hover:border-orange-200 border border-gray-200/60 transition-colors"
              >
                <div className="font-semibold text-[#1F2937]">Kak Fira (Staf)</div>
                <div className="text-[11px] text-[#5A6B78]">fira@langkahjuara.id</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("tutor", "dimas@langkahjuara.id")}
                className="p-2 text-left rounded-lg bg-gray-50 hover:bg-orange-50 hover:border-orange-200 border border-gray-200/60 transition-colors"
              >
                <div className="font-semibold text-[#1F2937]">Kak Dimas (Tutor)</div>
                <div className="text-[11px] text-[#5A6B78]">dimas@langkahjuara.id</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("super_admin", "arif@langkahjuara.id")}
                className="p-2 text-left rounded-lg bg-gray-50 hover:bg-orange-50 hover:border-orange-200 border border-gray-200/60 transition-colors"
              >
                <div className="font-semibold text-[#1F2937]">Pak Arif (Owner)</div>
                <div className="text-[11px] text-[#5A6B78]">arif@langkahjuara.id</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#5A6B78]">
            Belum punya akun?{" "}
            <Link href="/daftar" className="font-semibold text-[#EA580C] hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
