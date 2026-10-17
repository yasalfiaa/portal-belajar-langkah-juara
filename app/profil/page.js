"use client";

import React, { useState, useEffect } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useData } from "@/context/DataContext";
import { User, Mail, Phone, ShieldCheck, Check, AlertCircle, Save } from "lucide-react";

export default function ProfilPage() {
  const { currentUser, updateUserProfile } = useData();

  const [nama, setNama] = useState(currentUser?.nama || "");
  const [noHp, setNoHp] = useState(currentUser?.noHp || "");
  const [noHpOrangTua, setNoHpOrangTua] = useState(currentUser?.noHpOrangTua || "");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (currentUser) {
      setNama(currentUser.nama || "");
      setNoHp(currentUser.noHp || "");
      setNoHpOrangTua(currentUser.noHpOrangTua || "");
    }
  }, [currentUser]);

  const validatePhone = (num) => {
    if (!num) return true; // optional unless entered
    const phoneRegex = /^08\d{8,11}$/; // 10 to 13 digits starting with 08
    return phoneRegex.test(num);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nama.trim()) {
      setErrorMsg("Nama tidak boleh kosong.");
      return;
    }

    if (noHp && !validatePhone(noHp)) {
      setErrorMsg("Nomor HP harus berupa angka, 10 sampai 13 digit, dan diawali 08 (contoh: 081234567890).");
      return;
    }

    if (currentUser.role === "siswa" && noHpOrangTua && !validatePhone(noHpOrangTua)) {
      setErrorMsg("Nomor HP Orang Tua harus berupa angka, 10 sampai 13 digit, dan diawali 08.");
      return;
    }

    updateUserProfile(currentUser.id, {
      nama: nama.trim(),
      noHp: noHp.trim(),
      noHpOrangTua: currentUser.role === "siswa" ? noHpOrangTua.trim() : currentUser.noHpOrangTua,
    });

    setSuccessMsg("Profil berhasil diperbarui!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <PortalLayout title="Profil Saya">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Data Diri Akun</h2>
          <p className="text-sm text-[#5A6B78] mt-1">
            Informasi akun dan kontak Anda yang terdaftar di Portal Belajar Langkah Juara.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
            <Check className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
          {/* User header avatar */}
          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#EA580C] font-extrabold text-2xl flex items-center justify-center border border-orange-200 shadow-xs">
              {currentUser?.nama?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F2937]">{currentUser?.nama}</h3>
              <p className="text-xs text-[#5A6B78]">{currentUser?.email}</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 rounded-full bg-orange-50 text-[#EA580C] text-[11px] font-bold uppercase tracking-wider border border-orange-200/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                Peran: {currentUser?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                Alamat Email (Tidak dapat diubah)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || ""}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
              <span className="text-[11px] text-[#5A6B78] mt-1 block">
                Email terikat dengan identitas akun belajar Anda.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                Nomor HP (WhatsApp)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all tabular-nums"
                />
              </div>
              <span className="text-[11px] text-[#5A6B78] mt-1 block">
                10 sampai 13 digit angka diawali 08
              </span>
            </div>

            {/* Siswa only: Nomor HP Orang Tua */}
            {currentUser?.role === "siswa" && (
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Nomor HP Orang Tua
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={noHpOrangTua}
                    onChange={(e) => setNoHpOrangTua(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all tabular-nums"
                  />
                </div>
                <span className="text-[11px] text-[#5A6B78] mt-1 block">
                  Digunakan staf untuk koordinasi perkembangan belajar siswa
                </span>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-sm font-semibold transition-all shadow-sm shadow-[#EA580C]/20 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
