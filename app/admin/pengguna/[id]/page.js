"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import { useData } from "@/context/DataContext";
import {
  User,
  Mail,
  Shield,
  Save,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

function EditPenggunaContent({ params }) {
  const unwrappedParams = use(params);
  const userId = unwrappedParams.id;
  const router = useRouter();

  const { users, currentUser, updateUserProfile } = useData();

  // Otorisasi: Bagian edit hak akses hanya berlaku apabila akun yang terdaftar adalah Super Admin
  if (currentUser?.role !== "super_admin") {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-md mx-auto my-12 shadow-xs">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-red-900">Akses Ditolak</h3>
        <p className="text-xs text-red-700 mt-2 mb-6 leading-relaxed">
          Bagian <strong>Edit Hak Akses Pengguna</strong> hanya berlaku apabila akun yang terdaftar adalah <strong>Super Admin</strong>. Akun Anda saat ini masuk sebagai <strong>{currentUser?.role || "pengguna"}</strong>.
        </p>
        <Link
          href={
            currentUser?.role === "staf"
              ? "/staf/dasbor"
              : currentUser?.role === "tutor"
              ? "/tutor/dasbor"
              : "/siswa/beranda"
          }
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Dasbor
        </Link>
      </div>
    );
  }

  const targetUser = users.find((u) => u.id === userId);

  const [role, setRole] = useState(targetUser?.role || "siswa");
  const [aktif, setAktif] = useState(targetUser?.aktif !== false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (targetUser) {
      setRole(targetUser.role);
      setAktif(targetUser.aktif);
    }
  }, [targetUser]);

  if (!targetUser) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center max-w-md mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#1F2937]">Pengguna tidak ditemukan</h3>
        <Link
          href="/admin/pengguna"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Kelola Pengguna
        </Link>
      </div>
    );
  }

  const isSelf = targetUser.id === currentUser.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // PRD Validation: Super Admin tidak bisa menurunkan peran atau menonaktifkan akunnya sendiri
    if (isSelf) {
      if (role !== "super_admin") {
        setErrorMsg("Super Admin tidak dapat menurunkan peran akunnya sendiri.");
        return;
      }
      if (!aktif) {
        setErrorMsg("Super Admin tidak dapat menonaktifkan akunnya sendiri.");
        return;
      }
    }

    // Role enum validation
    const validRoles = ["siswa", "staf", "tutor", "super_admin"];
    if (!validRoles.includes(role)) {
      setErrorMsg("Peran tidak valid.");
      return;
    }

    updateUserProfile(targetUser.id, {
      role,
      aktif,
    });

    setSuccessMsg("Perubahan peran dan status akun berhasil disimpan!");
    setTimeout(() => {
      router.push("/admin/pengguna");
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/admin/pengguna"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Pengguna</span>
      </Link>

      <div>
        <h2 className="text-xl font-bold text-[#1F2937]">Edit Hak Akses Pengguna</h2>
        <p className="text-sm text-[#5A6B78] mt-0.5">
          Sesuai alur PRD Bab 4.15, ubah peran dan kontrol status aktif akun pengguna.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
              Nama Pengguna
            </label>
            <input
              type="text"
              disabled
              value={targetUser.nama}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
              Email Akun
            </label>
            <input
              type="email"
              disabled
              value={targetUser.email}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
              Peran Pengguna (Role) <span className="text-red-500">*</span>
            </label>
            <select
              value={role}
              disabled={isSelf}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="siswa">Siswa (Akses Beranda, Program, Kelas, Tugas, Profil)</option>
              <option value="staf">Staf (Akses Dasbor Staf, Pendaftaran, Kelola Kelas, Data Siswa)</option>
              <option value="tutor">Tutor (Akses Dasbor Tutor, Kelas yang Diajar, Tugas & Nilai)</option>
              <option value="super_admin">Super Admin (Akses Penuh Semua Modul & Pemilik)</option>
            </select>
            {isSelf && (
              <span className="text-[11px] text-amber-700 mt-1 block font-medium">
                Super Admin tidak dapat menurunkan peran akun sendiri.
              </span>
            )}
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer">
              <input
                type="checkbox"
                disabled={isSelf}
                checked={aktif}
                onChange={(e) => setAktif(e.target.checked)}
                className="rounded text-[#EA580C] focus:ring-[#EA580C] w-4 h-4 disabled:opacity-50"
              />
              <div>
                <span className="text-xs font-bold text-[#1F2937] block">
                  Status Akun Aktif
                </span>
                <span className="text-[11px] text-[#5A6B78]">
                  Bila dinonaktifkan, akun ini tidak dapat masuk ke portal belajar, namun catatan data masa lalunya tetap tersimpan.
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Link
              href="/admin/pengguna"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5A6B78] hover:bg-gray-100"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-sm shadow-[#EA580C]/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditPenggunaAdminPage({ params }) {
  return (
    <PortalLayout title="Edit Pengguna">
      <Suspense fallback={<div className="p-8 text-center text-sm text-[#5A6B78]">Memuat data pengguna...</div>}>
        <EditPenggunaContent params={params} />
      </Suspense>
    </PortalLayout>
  );
}
