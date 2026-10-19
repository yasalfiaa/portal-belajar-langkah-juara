"use client";

import React, { useState, useEffect } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useData } from "@/context/DataContext";
import {
  User,
  Phone,
  Check,
  AlertCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";

const ROLE_METADATA = {
  siswa: {
    label: "Siswa",
    description: "Siswa Bimbingan Belajar SMP & SMA",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  tutor: {
    label: "Tutor Pengajar",
    description: "Pengajar Tatap Muka & Evaluator Tugas",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
  },
  staf: {
    label: "Staf Administrasi",
    description: "Pengelola Pendaftaran & Kelas Bimbingan",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  super_admin: {
    label: "Super Admin",
    description: "Pemilik & Pengelola Portal Bimbel",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

export default function ProfilPage() {
  const { currentUser, updateUserProfile } = useData();

  // Split nama untuk field Nama Depan & Nama Belakang
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [noHp, setNoHp] = useState("");
  const [noHpOrangTua, setNoHpOrangTua] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (currentUser) {
      const full = (currentUser.nama || "").trim();
      const parts = full.split(" ");
      if (parts.length > 1) {
        setFirstName(parts[0]);
        setLastName(parts.slice(1).join(" "));
      } else {
        setFirstName(full);
        setLastName("");
      }
      setNoHp(currentUser.noHp || "");
      setNoHpOrangTua(currentUser.noHpOrangTua || "");
    }
  }, [currentUser]);

  const validatePhone = (num) => {
    if (!num) return true;
    const phoneRegex = /^08\d{8,11}$/; // 10 sampai 13 digit angka diawali 08
    return phoneRegex.test(num);
  };

  const currentRole = currentUser?.role || "siswa";
  const roleInfo = ROLE_METADATA[currentRole] || ROLE_METADATA.siswa;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const fullNama = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (!fullNama) {
      setErrorMsg("Nama tidak boleh kosong.");
      return;
    }

    if (noHp && !validatePhone(noHp)) {
      setErrorMsg("Nomor HP harus berupa angka, 10 sampai 13 digit, dan diawali 08 (contoh: 081234567890).");
      return;
    }

    if (currentRole === "siswa" && noHpOrangTua && !validatePhone(noHpOrangTua)) {
      setErrorMsg("Nomor HP Orang Tua harus berupa angka, 10 sampai 13 digit, dan diawali 08.");
      return;
    }

    setLoading(true);

    try {
      await updateUserProfile(currentUser.id, {
        nama: fullNama,
        noHp: noHp.trim(),
        noHpOrangTua: currentRole === "siswa" ? noHpOrangTua.trim() : currentUser.noHpOrangTua || "",
      });

      setSuccessMsg("Informasi akun berhasil disimpan!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Gagal memperbarui profil:", err);
      setErrorMsg("Gagal menyimpan perubahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout title="Informasi Akun">
      <div className="max-w-5xl mx-auto space-y-6 pb-16">
        {/* Header Atas: Informasi Akun */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Informasi Akun
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6B78] mt-1">
            Kelola data diri dan kontak aktif Anda yang terdaftar di Portal Langkah Juara.
          </p>
        </div>

        {/* Feedback States Sesuai PRD 5.4 */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50/90 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-3 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Card Panel Utama: Account Settings */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          {/* Card Header: Bahasa Indonesia */}
          <div className="px-6 sm:px-10 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <span className="text-[11px] sm:text-xs font-bold text-[#5A6B78] uppercase tracking-wider">
              PROFIL PENGGUNA
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Kolom Kiri: Profil Kosongan & Keterangan Peran Tanpa Logo/ID */}
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                {/* Profil Kosongan (Avatar Placeholder Netral) */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center text-gray-400">
                  <User className="w-14 h-14 text-gray-300 stroke-[1.5]" />
                </div>

                {/* KETERANGAN PERAN TEPAT DI BAWAH GAMBAR PROFIL (TANPA LOGO & TANPA ID) */}
                <div className="mt-5 w-full max-w-[220px] flex flex-col items-center">
                  <span
                    className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${roleInfo.badgeClass}`}
                  >
                    {roleInfo.label}
                  </span>

                  <p className="text-[11px] text-[#5A6B78] mt-2 leading-tight">
                    {roleInfo.description}
                  </p>

                  <div className="mt-3.5 pt-3 border-t border-gray-100 w-full flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-emerald-700">Akun Aktif</span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Form Data Sesuai PRD 4.6 (Tanpa Menu Ganti Password) */}
              <div className="lg:col-span-8 space-y-8">
                {/* 1. Informasi Umum */}
                <div>
                  <h3 className="text-base font-bold text-[#1F2937] mb-4">
                    Informasi Umum
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#5A6B78] mb-1.5">
                        Nama Depan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Nama Depan"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1F2937] focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/15 transition-all bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A6B78] mb-1.5">
                        Nama Belakang
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Nama Belakang"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1F2937] focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/15 transition-all bg-white"
                      />
                    </div>
                  </div>

                  {/* Baris Email (Read-Only sesuai PRD 4.6) */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-[#5A6B78]">
                        Alamat Email
                      </label>
                      <span className="text-xs font-medium text-[#EA580C]">
                        Email tidak dapat diubah
                      </span>
                    </div>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email || ""}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/80 text-gray-500 text-sm cursor-not-allowed select-none"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* 2. Kontak & Komunikasi (PRD 4.6) */}
                <div>
                  <h3 className="text-base font-bold text-[#1F2937] mb-1">
                    Kontak & Komunikasi
                  </h3>
                  <p className="text-xs text-[#5A6B78] mb-4">
                    Nomor aktif untuk keperluan komunikasi kelas dan informasi bimbingan belajar.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#5A6B78] mb-1.5">
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
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1F2937] focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/15 transition-all tabular-nums bg-white"
                        />
                      </div>
                      <span className="text-[11px] text-[#5A6B78] mt-1 block">
                        10–13 digit angka diawali 08
                      </span>
                    </div>

                    {/* Khusus peran Siswa: Nomor HP Orang Tua (PRD 4.6) */}
                    {currentRole === "siswa" && (
                      <div>
                        <label className="block text-xs font-semibold text-[#5A6B78] mb-1.5">
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
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1F2937] focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/15 transition-all tabular-nums bg-white"
                          />
                        </div>
                        <span className="text-[11px] text-[#5A6B78] mt-1 block">
                          Untuk koordinasi wali siswa & staf
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tombol Simpan Perubahan (Gradient Oranye Sesuai Gambar Referensi) */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-amber-500 hover:from-[#c2410c] hover:to-amber-600 text-white font-semibold text-sm transition-all shadow-md shadow-[#EA580C]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <span>Simpan Perubahan</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
