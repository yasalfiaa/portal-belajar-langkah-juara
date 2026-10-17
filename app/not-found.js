import React from "react";
import Link from "next/link";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F5F2] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 bg-orange-100 text-[#EA580C] rounded-2xl flex items-center justify-center mb-4 border border-orange-200 shadow-xs">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight mb-2">
        404 - Halaman Tidak Ditemukan
      </h1>
      <p className="text-sm text-[#5A6B78] max-w-md mb-8 leading-relaxed">
        Maaf, alamat halaman yang Anda tuju tidak ditemukan di Portal Belajar Langkah Juara.
        Silakan periksa kembali tautan Anda atau kembali ke halaman utama.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/beranda"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-sm shadow-[#EA580C]/20"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
