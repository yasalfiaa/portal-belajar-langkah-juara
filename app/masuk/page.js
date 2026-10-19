"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useData, getFirebaseErrorMessage } from "@/context/DataContext";
import { ImageSlider } from "@/components/ui/image-slider";
import { Sparkles, ArrowRight, Loader2, AlertCircle, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const BIMBEL_SLIDES = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
];

function GoogleIcon(props) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" {...props}>
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
  );
}

function MasukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const {
    users,
    currentUser,
    switchRole,
    setCurrentUserId,
    loginWithEmail,
    loginWithGoogle,
    logoutUser,
    authUser,
    activeRole,
  } = useData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const routeByRole = (role) => {
    if (redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("/masuk")) {
      router.push(redirectParam);
      return;
    }
    if (role === "siswa") router.push("/siswa/beranda");
    else if (role === "staf") router.push("/staf/dasbor");
    else if (role === "tutor") router.push("/tutor/dasbor");
    else if (role === "super_admin") router.push("/admin/dasbor");
    else router.push("/siswa/beranda");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const profile = await loginWithEmail(email.trim(), password);
      routeByRole(profile.role);
    } catch (err) {
      console.warn("Firebase Auth error:", err);
      // Fallback: check if matches local seed user without Firebase Auth account yet
      const seedUser = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (seedUser) {
        if (!seedUser.aktif) {
          setError("Akun Anda dinonaktifkan. Hubungi staf Langkah Juara.");
          setLoading(false);
          return;
        }
        switchRole(seedUser.role);
        setCurrentUserId(seedUser.id);
        routeByRole(seedUser.role);
        return;
      }
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const profile = await loginWithGoogle();
      routeByRole(profile.role);
    } catch (err) {
      console.warn("Google Auth error:", err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        className="w-full max-w-5xl h-auto min-h-[640px] grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 bg-white"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Kolom Kiri: Slider Foto Edukasi Langkah Juara */}
        <div className="hidden lg:block relative h-full min-h-[640px] bg-neutral-900 overflow-hidden">
          <ImageSlider images={BIMBEL_SLIDES} interval={4000} />
          
          {/* Overlay gradien halus untuk kenyamanan estetika */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 pointer-events-none" />

          {/* Info Brand & Tagline Bimbel */}
          <div className="absolute top-8 left-8 right-8 z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EA580C] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-[#EA580C]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block drop-shadow-sm">
                Langkah Juara
              </span>
              <span className="text-[11px] font-medium text-orange-200 tracking-wider uppercase">
                Portal Belajar Makassar
              </span>
            </div>
          </div>

          <div className="absolute bottom-12 left-8 right-8 z-10 text-white pointer-events-none">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">
              Bimbingan Belajar SMP & SMA
            </p>
            <h3 className="text-2xl font-bold leading-snug drop-shadow-md">
              Satu Tempat untuk Belajar, Berprestasi, dan Meraih Kampus Impian.
            </h3>
            <p className="text-xs text-gray-200/90 mt-2 font-normal line-clamp-2">
              Jadwal tatap muka, tautan materi, pengumpulan tugas, dan nilai presisi di ujung jari Anda.
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Form Autentikasi Masuk */}
        <div className="w-full h-full bg-white text-[#1F2937] flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-12">
          <div className="w-full max-w-sm mx-auto">
            {/* Header Brand untuk tampilan Mobile */}
            <div className="lg:hidden flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#EA580C] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#EA580C]/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#1F2937]">
                Langkah Juara
              </span>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1F2937]">
                Masuk ke Portal
              </h1>
              <p className="text-sm text-[#5A6B78] mt-1.5">
                Silakan masuk menggunakan akun Langkah Juara Anda.
              </p>
            </div>

            {/* Sesi pengguna aktif bila sudah terhubung */}
            {authUser && (
              <div className="mb-5 p-3.5 rounded-2xl bg-orange-50/90 border border-orange-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#5A6B78]">Sesi aktif sebagai:</span>
                  <span className="font-bold text-[#EA580C] uppercase tracking-wider text-[10px] bg-orange-100 px-2 py-0.5 rounded-md">
                    {currentUser?.role || activeRole}
                  </span>
                </div>
                <div className="font-semibold text-[#1F2937] text-sm mt-1 truncate">
                  {currentUser?.nama || authUser.displayName || authUser.email}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => routeByRole(currentUser?.role || activeRole)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white font-semibold text-xs transition-colors shadow-xs text-center"
                  >
                    Buka Dasbor
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await logoutUser();
                    }}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}

            {/* Toast / Banner Notifikasi Error Rapi */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50/90 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Tombol Masuk dengan Google */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200/90 bg-white hover:bg-gray-50 text-sm font-semibold text-[#1F2937] transition-all flex items-center justify-center gap-3 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed hover:border-gray-300"
            >
              <GoogleIcon />
              <span>{loading ? "Menghubungkan..." : "Masuk dengan Google"}</span>
            </button>

            {/* Pembatas Minimalis */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/80" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-[#5A6B78] font-medium tracking-wider text-[11px]">
                  atau gunakan email
                </span>
              </div>
            </div>

            {/* Form Masuk dengan Email & Password */}
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
                  Email Akun <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1F2937] placeholder:text-gray-400 focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
                  Kata Sandi <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1F2937] placeholder:text-gray-400 focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white font-semibold text-sm transition-all shadow-md shadow-[#EA580C]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses Masuk...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Navigasi Pendaftaran Akun Siswa Baru */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-[#5A6B78]">
              Belum punya akun?{" "}
              <Link
                href="/daftar"
                className="font-semibold text-[#EA580C] hover:text-[#c2410c] hover:underline transition-colors"
              >
                Daftar siswa baru
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function MasukPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-4">
          <div className="w-10 h-10 border-3 border-orange-200 border-t-[#EA580C] rounded-full animate-spin" />
        </div>
      }
    >
      <MasukForm />
    </Suspense>
  );
}
